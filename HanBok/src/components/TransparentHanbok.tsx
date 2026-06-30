import React, { useState, useEffect, useRef } from 'react';

interface TransparentHanbokProps {
  src: string;
  colorAccent?: string;
  className?: string;
}

export const TransparentHanbok: React.FC<TransparentHanbokProps> = ({
  src,
  colorAccent,
  className = 'w-full h-full select-none object-contain',
}) => {
  const [transparentSrc, setTransparentSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cacheRef = useRef<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const cacheKey = `${src}_${colorAccent || ''}`;
    if (cacheRef.current[cacheKey]) {
      setTransparentSrc(cacheRef.current[cacheKey]);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      if (!active) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setTransparentSrc(src);
        setIsLoading(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // 1. Convert solid white and near-white background to transparent with feathering
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Is it close to white background?
        if (r > 240 && g > 240 && b > 240) {
          // Calculate distance to white
          const avg = (r + g + b) / 3;
          const diff = 255 - avg;
          
          // Feather alpha dynamically for smooth anti-aliased borders
          if (diff < 15) {
            data[i + 3] = Math.round((diff / 15) * 255);
          }
        }
      }

      // 2. Apply dynamic dye color overlay if provided
      if (colorAccent && colorAccent !== '#BE123C') {
        // Create an offscreen canvas for color overlay
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        const oCtx = overlayCanvas.getContext('2d');
        if (oCtx) {
          // Draw the transparent image onto offscreen canvas
          ctx.putImageData(imgData, 0, 0);
          oCtx.drawImage(canvas, 0, 0);

          // Use 'color' blend mode to tint the fabric elegantly without losing shadow/highlights
          oCtx.globalCompositeOperation = 'source-atop';
          oCtx.fillStyle = colorAccent;
          oCtx.fillRect(0, 0, canvas.width, canvas.height);

          // Blend the tinted layer onto our main drawing
          ctx.save();
          ctx.globalAlpha = 0.35; // Soft natural color tint blend ratio
          ctx.globalCompositeOperation = 'color';
          ctx.drawImage(overlayCanvas, 0, 0);
          ctx.restore();
        }
      } else {
        ctx.putImageData(imgData, 0, 0);
      }

      const transparentUrl = canvas.toDataURL('image/png');
      cacheRef.current[cacheKey] = transparentUrl;
      setTransparentSrc(transparentUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      if (!active) return;
      setTransparentSrc(src);
      setIsLoading(false);
    };

    return () => {
      active = false;
    };
  }, [src, colorAccent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-stone-50/20 animate-pulse rounded-2xl">
        <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={transparentSrc}
      alt="Hanbok item"
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};
