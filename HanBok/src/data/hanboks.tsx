import React from 'react';
import { HanbokItem } from '../types';
import { TransparentHanbok } from '../components/TransparentHanbok';

import imgRoyalDangui from '../assets/images/royal_dangui_green_red_1782790634396.jpg';
import imgPastelFusion from '../assets/images/purple_fusion_female_1782790593274.jpg';
import imgScholarDopo from '../assets/images/white_dopo_male_1782790545989.jpg';
import imgKidsSaekdong from '../assets/images/red_royal_saekdong_1782790611451.jpg';
import imgGoldYongpo from '../assets/images/gold_yongpo_photo_1782789784644.jpg';
import imgYellowTraditional from '../assets/images/yellow_traditional_female_1782790531164.jpg';

export const HANBOKS: HanbokItem[] = [
  {
    id: 'royal_dangui',
    name: '궁중 당의 & 대란치마',
    description: '조선 왕실의 품격이 담긴 녹색 당의와 금박 붉은 치마 (실사 고품격)',
    type: 'royal',
    gender: 'female',
    defaultScale: 1.15,
    defaultYOffset: 202,
    necklineFromTop: 30,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgRoyalDangui}
        colorAccent={colorAccent}
      />
    ),
  },
  {
    id: 'pastel_fusion',
    name: '파스텔 꽃가람 퓨전',
    description: '화사하고 현대적인 쉬폰 느낌의 파스텔 퍼플 퓨전 한복 (실사 고품격)',
    type: 'fusion',
    gender: 'female',
    defaultScale: 1.15,
    defaultYOffset: 200,
    necklineFromTop: 30,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgPastelFusion}
        colorAccent={colorAccent}
      />
    ),
  },
  {
    id: 'scholar_dopo',
    name: '선비 도포 & 세조대',
    description: '선비들이 입던 단아하고 기품 있는 전통 도포 자락 (실사 고품격)',
    type: 'traditional',
    gender: 'male',
    defaultScale: 1.15,
    defaultYOffset: 205,
    necklineFromTop: 25,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgScholarDopo}
        colorAccent={colorAccent}
      />
    ),
  },
  {
    id: 'kids_saekdong',
    name: '왕실 용포 & 색동 소매',
    description: '화려한 오색 색동 소매와 가슴의 용 문양이 어우러진 어린이 용포 (실사 고품격)',
    type: 'child',
    gender: 'unisex',
    defaultScale: 1.1,
    defaultYOffset: 200,
    necklineFromTop: 30,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgKidsSaekdong}
        colorAccent={colorAccent}
      />
    ),
  },
  {
    id: 'gold_yongpo',
    name: '황금 보곤룡포 (King Robe)',
    description: '붉은 비단에 황금빛 오조룡보를 가슴과 어깨에 새긴 군주의 고품격 영포 (실사 고품격)',
    type: 'royal',
    gender: 'male',
    defaultScale: 1.15,
    defaultYOffset: 205,
    necklineFromTop: 25,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgGoldYongpo}
        colorAccent={colorAccent}
      />
    ),
  },
  {
    id: 'traditional_yellow',
    name: '단아 고운 노랑치마',
    description: '전통적인 흰색 저고리와 고운 개나리빛 노란 치마의 조화 (실사 고품격)',
    type: 'traditional',
    gender: 'female',
    defaultScale: 1.1,
    defaultYOffset: 200,
    necklineFromTop: 30,
    render: (scale, colorAccent) => (
      <TransparentHanbok
        src={imgYellowTraditional}
        colorAccent={colorAccent}
      />
    ),
  },
];

export const ACCESSORIES: HanbokItem[] = [
  {
    id: 'gat_hat',
    name: '전통 갓 (Scholar Hat)',
    description: '흑색 필터 실로 짜여진 선비들의 멋스러운 전통 갓',
    type: 'accessory',
    gender: 'male',
    defaultScale: 1.25,
    defaultYOffset: 65,
    render: (scale) => (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="gat-hat-drawing" transform={`scale(${scale})`} transformOrigin="100 85">
          <path d="M72,85 C73,122 100,165 100,165 C100,165 127,122 128,85" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.8" />
          <circle cx="82" cy="115" r="3" fill="#EF4444" />
          <circle cx="91" cy="138" r="3.5" fill="#FBBF24" />
          <circle cx="100" cy="165" r="5" fill="#10B981" />
          <circle cx="109" cy="138" r="3.5" fill="#FBBF24" />
          <circle cx="118" cy="115" r="3" fill="#EF4444" />

          <path
            d="M75,80 L79,25 Q100,20 121,25 L125,80 Z"
            fill="#1E293B"
            fillOpacity="0.88"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M90,23 L93,80" stroke="#475569" strokeWidth="1.5" opacity="0.5" />
          <path d="M100,22 L100,80" stroke="#475569" strokeWidth="2" opacity="0.6" />
          <path d="M110,23 L107,80" stroke="#475569" strokeWidth="1.5" opacity="0.5" />

          <rect x="76.5" y="72" width="47" height="6" fill="#DC2626" />

          <ellipse
            cx="100"
            cy="85"
            rx="85"
            ry="18"
            fill="#111827"
            fillOpacity="0.75"
            stroke="#030712"
            strokeWidth="4"
          />
          <ellipse cx="100" cy="85" rx="60" ry="12" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
          <ellipse cx="100" cy="85" rx="35" ry="7" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    ),
  },
  {
    id: 'jokduri_crown',
    name: '왕실 족두리 (Queen Crown)',
    description: '궁중 여인들이 격식 있는 날 머리에 얹던 화려한 관모',
    type: 'accessory',
    gender: 'female',
    defaultScale: 0.9,
    defaultYOffset: 80,
    render: (scale) => (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="jokduri-drawing" transform={`scale(${scale})`} transformOrigin="100 80">
          <path
            d="M68,85 L72,45 L128,45 L132,85 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="85" cy="65" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="85" cy="65" r="4" fill="#DC2626" />
          <circle cx="115" cy="65" r="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="115" cy="65" r="4" fill="#DC2626" />
          <rect x="94" y="52" width="12" height="15" rx="2" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="100" cy="60" r="3" fill="#10B981" />
          <ellipse cx="100" cy="38" rx="10" ry="6" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="100" cy="27" r="5" fill="#FACC15" />
          <circle cx="100" cy="20" r="3" fill="#3B82F6" />
          <path d="M55,80 L35,160" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="35" cy="164" r="5" fill="#EF4444" />
          <circle cx="40" cy="120" r="3" fill="#FBBF24" />
          <path d="M145,80 L165,160" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="165" cy="164" r="5" fill="#EF4444" />
          <circle cx="160" cy="120" r="3" fill="#FBBF24" />
        </g>
      </svg>
    ),
  },
  {
    id: 'baessi_daenggi',
    name: '배씨댕기 (Blossom Headband)',
    description: '꽃 모양 장식을 얹어 이마 쪽으로 매는 귀여운 처녀 배씨댕기',
    type: 'accessory',
    gender: 'female',
    defaultScale: 1.0,
    defaultYOffset: 82,
    render: (scale) => (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="baessi-drawing" transform={`scale(${scale})`} transformOrigin="100 85">
          <path
            d="M40,85 C55,45 145,45 160,85"
            fill="none"
            stroke="#991B1B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <g transform="translate(100, 52)">
            <rect x="-12" y="-4" width="24" height="8" rx="2" fill="#DB2777" />
            <circle cx="-10" cy="0" r="8" fill="#F472B6" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="10" cy="0" r="8" fill="#F472B6" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="0" cy="-10" r="8" fill="#F472B6" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="0" cy="10" r="8" fill="#F472B6" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="-7" cy="-7" r="8" fill="#FB7185" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="7" cy="-7" r="8" fill="#FB7185" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="-7" cy="7" r="8" fill="#FB7185" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="7" cy="7" r="8" fill="#FB7185" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="7" fill="#FACC15" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="#3B82F6" />
          </g>
        </g>
      </svg>
    ),
  },
  {
    id: 'daenggi_ribbon',
    name: '금박 댕기 (Daenggi Ribbon)',
    description: '곱게 땋은 머리 끝에 다는 화려한 전통 금박 붉은 자락',
    type: 'accessory',
    gender: 'female',
    defaultScale: 1.05,
    defaultYOffset: 125,
    render: (scale) => (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="daenggi-drawing" transform={`scale(${scale})`} transformOrigin="145 45">
          <path d="M135,40 L155,40 L160,200 L140,200 Z" fill="#4B044E" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="147" cy="70" r="4.5" fill="#FACC15" />
          <polygon points="142,100 152,100 147,110" fill="#FACC15" />
          <polygon points="142,140 152,140 147,150" fill="#FACC15" />
          <circle cx="147" cy="175" r="4.5" fill="#FACC15" />
          <polygon points="140,200 150,190 160,200 150,215" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
          <circle cx="150" cy="201" r="2.5" fill="#FACC15" />
        </g>
      </svg>
    ),
  },
  {
    id: 'norigae_pendant',
    name: '삼작 삼장 노리개',
    description: '한복 옷고름이나 치마허리에 다는 보석 장신구',
    type: 'accessory',
    gender: 'unisex',
    defaultScale: 1.0,
    defaultYOffset: 155,
    render: (scale) => (
      <svg
        viewBox="0 0 200 120"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="norigae-drawing" transform={`scale(${scale})`} transformOrigin="100 45">
          <path d="M100,5 L100,45" fill="none" stroke="#EA580C" strokeWidth="3" />
          <circle cx="100" cy="25" r="4.5" fill="#B45309" />
          <path d="M90,38 C80,28 75,48 95,43 L100,45" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M110,38 C120,28 125,48 105,43 L100,45" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="100" cy="43" r="5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <polygon points="90,52 110,52 115,72 85,72" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
          <ellipse cx="100" cy="62" rx="6" ry="6" fill="#F1F5F9" opacity="0.3" />
          <circle cx="100" cy="76" r="5.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <path d="M88,80 L80,185 C80,185 92,185 88,80 Z" fill="#EC4899" opacity="0.9" />
          <circle cx="85" cy="88" r="3.5" fill="#BE185D" />
          <path d="M100,80 L100,195 C100,195 106,192 100,80 Z" fill="#FBBF24" />
          <circle cx="100" cy="88" r="3.5" fill="#D97706" />
          <path d="M112,80 L120,185 C112,185 120,185 112,80 Z" fill="#3B82F6" opacity="0.9" />
          <circle cx="115" cy="88" r="3.5" fill="#1D4ED8" />
        </g>
      </svg>
    ),
  },
];
