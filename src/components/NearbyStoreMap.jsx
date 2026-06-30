import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";

const SEOUL_CITY_HALL = { lat: 37.5663, lng: 126.9779 };
const SEARCH_RADIUS_METERS = 1500;
const REMOTE_OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const LOCAL_PROXY_ENDPOINT = "/api/overpass";
const BRAND_FILTERS = [
  { id: "GS25", label: "GS25", short: "GS", color: "#4b8fe8" },
  { id: "CU", label: "CU", short: "CU", color: "#7b61ff" },
  { id: "7-Eleven", label: "7-Eleven", short: "7", color: "#ff7a59" },
  { id: "Other", label: "기타", short: "+", color: "#8a7f78" },
];
const BRAND_PATTERNS = [
  { id: "GS25", label: "GS25", pattern: /\bgs\s?25\b|지에스\s?25/i },
  { id: "CU", label: "CU", pattern: /\bcu\b|씨유/i },
  { id: "7-Eleven", label: "7-Eleven", pattern: /7\s?-?\s?eleven|seven\s?eleven|세븐일레븐/i },
  { id: "Other", label: "Emart24", pattern: /emart\s?24|이마트\s?24/i },
];

function calculateDistanceMeters(from, to) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getStoreCoordinates(item) {
  if (typeof item.lat === "number" && typeof item.lon === "number") {
    return { lat: item.lat, lng: item.lon };
  }

  if (item.center) {
    return { lat: item.center.lat, lng: item.center.lon };
  }

  return null;
}

function normalizeStoreText(tags = {}) {
  return [tags.brand, tags.name, tags.operator, tags.branch]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveBrand(tags = {}) {
  const normalizedText = normalizeStoreText(tags);
  const matchedBrand = BRAND_PATTERNS.find((item) => item.pattern.test(normalizedText));

  if (matchedBrand) {
    return {
      brandId: matchedBrand.id,
      brandLabel: matchedBrand.label,
      hasKnownBrand: true,
    };
  }

  return {
    brandId: "Other",
    brandLabel: tags.brand || tags.name || "편의점",
    hasKnownBrand: false,
  };
}

function createBrandMarker(brandId) {
  const brand = BRAND_FILTERS.find((item) => item.id === brandId) || BRAND_FILTERS[3];
  return L.divIcon({
    className: "brand-marker-wrapper",
    html: `<div class="brand-marker brand-${brand.id.replace(/[^a-z0-9]/gi, "").toLowerCase()}" style="background:${brand.color}"><span>${brand.short}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -28],
  });
}

function createTimeoutSignal(timeoutMs) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear: () => window.clearTimeout(timer),
  };
}

function getOverpassEndpoints() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return [LOCAL_PROXY_ENDPOINT, ...REMOTE_OVERPASS_ENDPOINTS];
  }
  return REMOTE_OVERPASS_ENDPOINTS;
}

async function requestOverpass(endpoint, query) {
  const { signal, clear } = createTimeoutSignal(12000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body: query,
      signal,
    });

    if (!response.ok) {
      throw new Error(`store-fetch-failed:${response.status}`);
    }

    return response.json();
  } finally {
    clear();
  }
}

async function fetchNearbyStores(position) {
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="convenience"](around:${SEARCH_RADIUS_METERS},${position.lat},${position.lng});
      way["shop"="convenience"](around:${SEARCH_RADIUS_METERS},${position.lat},${position.lng});
      relation["shop"="convenience"](around:${SEARCH_RADIUS_METERS},${position.lat},${position.lng});
    );
    out center tags;
  `;

  let data = null;
  let lastError = null;

  for (const endpoint of getOverpassEndpoints()) {
    try {
      data = await requestOverpass(endpoint, query);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!data) {
    throw lastError || new Error("store-fetch-failed");
  }

  return (data.elements || [])
    .map((item) => {
      const coordinates = getStoreCoordinates(item);
      if (!coordinates) return null;

      const brandInfo = resolveBrand(item.tags);
      const name = item.tags?.name || item.tags?.brand || "편의점";
      const address =
        item.tags?.["addr:full"] ||
        item.tags?.["addr:street"] ||
        item.tags?.["addr:housenumber"] ||
        "주소 정보 없음";
      const searchQuery = `${name} ${address}`;

      return {
        id: `${item.type}-${item.id}`,
        name,
        brandId: brandInfo.brandId,
        brandLabel: brandInfo.brandLabel,
        lat: coordinates.lat,
        lng: coordinates.lng,
        distanceMeters: calculateDistanceMeters(position, coordinates),
        hasKnownBrand: brandInfo.hasKnownBrand,
        address,
        openingHours: item.tags?.opening_hours || null,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
        naverSearchUrl: `https://map.naver.com/p/search/${encodeURIComponent(searchQuery)}`,
      };
    })
    .filter(Boolean)
    .filter((store, index, stores) => {
      const firstIndex = stores.findIndex(
        (candidate) =>
          candidate.name === store.name &&
          Math.abs(candidate.lat - store.lat) < 0.00003 &&
          Math.abs(candidate.lng - store.lng) < 0.00003
      );
      return firstIndex === index;
    })
    .sort((a, b) => {
      if (a.hasKnownBrand !== b.hasKnownBrand) return a.hasKnownBrand ? -1 : 1;
      return a.distanceMeters - b.distanceMeters;
    })
    .slice(0, 12);
}

function getLocationErrorMessage(error) {
  if (!error) return "위치 정보를 가져오지 못했습니다.";
  if (error.code === 1) return "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.";
  if (error.code === 2) return "위치 정보를 확인할 수 없습니다. PC의 위치 서비스나 네트워크 상태를 확인해 주세요.";
  if (error.code === 3) return "위치 확인 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
  return "위치 정보를 가져오지 못했습니다.";
}

export default function NearbyStoreMap() {
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [status, setStatus] = useState("현재 위치를 확인하면 주변 편의점을 실제 좌표로 보여드립니다.");
  const [permissionMessage, setPermissionMessage] = useState("위치 권한을 허용한 뒤 `내 위치로 찾기`를 눌러 주세요.");
  const [position, setPosition] = useState(SEOUL_CITY_HALL);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState({
    GS25: true,
    CU: true,
    "7-Eleven": true,
    Other: true,
  });

  const knownBrandCount = useMemo(
    () => stores.filter((store) => store.hasKnownBrand).length,
    [stores]
  );

  const filteredStores = useMemo(
    () => stores.filter((store) => selectedBrands[store.brandId]),
    [selectedBrands, stores]
  );

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return;

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
    }).setView([SEOUL_CITY_HALL.lat, SEOUL_CITY_HALL.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    window.setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const userMarker = L.circleMarker([position.lat, position.lng], {
      radius: 10,
      color: "#ffffff",
      weight: 3,
      fillColor: "#ef6b5b",
      fillOpacity: 1,
    }).bindPopup("현재 위치");
    markersLayerRef.current.addLayer(userMarker);

    filteredStores.forEach((store) => {
      markersLayerRef.current.addLayer(
        L.marker([store.lat, store.lng], {
          icon: createBrandMarker(store.brandId),
        }).bindPopup(
          `<strong>${store.brandLabel}</strong><br/>${store.name}<br/>약 ${store.distanceMeters}m`
        )
      );
    });

    mapRef.current.setView([position.lat, position.lng], 15);
    mapRef.current.invalidateSize();
  }, [filteredStores, position]);

  const handleToggleBrand = (brandId) => {
    setSelectedBrands((current) => ({ ...current, [brandId]: !current[brandId] }));
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setPermissionMessage("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }

    if (!window.isSecureContext) {
      setStatus("위치 기능을 사용할 수 없습니다.");
      setPermissionMessage("실제 위치 찾기는 HTTPS 또는 localhost 환경에서만 동작합니다.");
      return;
    }

    setIsLoading(true);
    setStatus("현재 위치는 확인했고, 주변 편의점 데이터를 찾는 중입니다.");

    navigator.geolocation.getCurrentPosition(
      async (currentPosition) => {
        const nextPosition = {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude,
        };

        setPosition(nextPosition);
        setPermissionMessage("현재 위치는 확인되었습니다. 주변 편의점 데이터를 불러오는 중입니다.");

        try {
          const nextStores = await fetchNearbyStores(nextPosition);
          setStores(nextStores);
          setStatus(
            nextStores.length > 0
              ? `주변 편의점 ${nextStores.length}곳을 찾았습니다.`
              : "현재 위치는 찾았지만 반경 1.5km 안에서 편의점을 찾지 못했습니다."
          );
        } catch {
          setStatus("현재 위치는 찾았지만 편의점 목록을 가져오지 못했습니다.");
          setPermissionMessage("개발 환경에서는 Vite 프록시를 먼저 사용하고, 실패하면 공개 지도 서버를 다시 시도합니다.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        setStatus("현재 위치를 가져오지 못했습니다.");
        setPermissionMessage(getLocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <section className="section" id="find">
      <div className="section-heading">
        <h3>주변 편의점 찾기</h3>
        <p>실제 좌표 기반</p>
      </div>
      <div className="map-card">
        <div className="map-copy">
          <p className="map-status">{status}</p>
          <span>{permissionMessage}</span>
        </div>
        <div className="map-actions">
          <button className="primary-button map-button" onClick={handleLocate} disabled={isLoading}>
            {isLoading ? "불러오는 중" : "내 위치로 찾기"}
          </button>
          <div className="map-badges">
            <span className="map-badge">반경 약 1.5km</span>
            <span className="map-badge">주요 브랜드 {knownBrandCount}곳</span>
          </div>
          <div className="brand-filter-row">
            {BRAND_FILTERS.map((brand) => {
              const checked = selectedBrands[brand.id];

              return (
                <button
                  key={brand.id}
                  className={`brand-filter ${checked ? "active" : ""}`}
                  onClick={() => handleToggleBrand(brand.id)}
                  type="button"
                >
                  <span className="brand-filter-logo" style={{ backgroundColor: brand.color }}>
                    {brand.short}
                  </span>
                  <span>{brand.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div ref={mapElementRef} className="store-map" aria-label="nearby convenience store map" />
        <div className="store-list">
          {filteredStores.length === 0 ? (
            <div className="empty-card compact">
              <p>아직 표시할 점포가 없습니다.</p>
              <span>위치 권한을 허용한 뒤 `내 위치로 찾기`를 눌러 주세요.</span>
            </div>
          ) : (
            filteredStores.map((store) => (
              <article key={store.id} className="store-item">
                <div>
                  <strong>{store.brandLabel}</strong>
                  <p>{store.name}</p>
                  <span>{store.address}</span>
                  <div className="store-links">
                    <a href={store.googleMapsUrl} target="_blank" rel="noreferrer">
                      Google 지도
                    </a>
                    <a href={store.naverSearchUrl} target="_blank" rel="noreferrer">
                      네이버 지도
                    </a>
                  </div>
                </div>
                <div className="store-meta">
                  <span>{Math.round(store.distanceMeters / 10) * 10}m</span>
                  {store.openingHours ? <small>{store.openingHours}</small> : null}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
