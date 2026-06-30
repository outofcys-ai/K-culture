import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onPhotoSelected: (dataUrl: string) => void;
  onClose?: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoSelected, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Stop video stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Start video stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        '카메라에 접근할 수 없습니다. 권한 승인을 하셨는지 확인하시거나 파일 업로드를 이용해 주세요.'
      );
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Take Snapshot
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // We want a square crop for the face try-on
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 오버레이할 수 있습니다!');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const resultSrc = event.target.result as string;
        setCapturedImage(resultSrc);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onPhotoSelected(capturedImage);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Action canvas to do snapping hidden */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-between items-center pb-4 border-b border-rose-100">
        <div>
          <h3 className="font-sans font-semibold text-lg text-rose-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-rose-700" />
            내 사진 촬영 / 업로드
          </h3>
          <p className="text-xs text-rose-800/70 mt-1">
            원하는 사진을 찍거나 업로드하여 한복을 맞춤 조정해 볼 수 있습니다.
          </p>
        </div>
        {onClose && (
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 hover:bg-rose-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-rose-900" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-3">
        {/* Dynamic Screen View */}
        <div className="relative w-full max-w-[340px] aspect-square rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 overflow-hidden flex flex-col items-center justify-center shadow-inner">
          <AnimatePresence mode="wait">
            {/* 1. Camera live streaming */}
            {isCameraActive && !capturedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full"
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover scale-x-[-1]" // mirrored
                  playsInline
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={captureSnapshot}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-sans text-sm font-medium rounded-full shadow-lg flex items-center gap-2 transition-all"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping" />
                    사진 촬영하기
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Captured preview or upload result */}
            {capturedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full flex flex-col justify-between p-4 bg-zinc-950/90"
              >
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
                  <img
                    src={capturedImage}
                    alt="Captured preview"
                    className="max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={retakePhoto}
                    className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all font-sans text-sm font-medium flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시 찍기
                  </button>
                  <button
                    onClick={confirmPhoto}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-all font-sans text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-white" />
                    한복 입히러 가기
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Camera Error & Fallback drag file UI */}
            {cameraError && !capturedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center flex flex-col items-center justify-center h-full w-full"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ backgroundColor: dragOver ? 'rgba(251, 113, 133, 0.1)' : 'transparent' }}
              >
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-xs text-rose-950 px-2 line-clamp-3 mb-4 leading-relaxed font-sans">{cameraError}</p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-6 rounded-xl border border-dashed border-rose-300 hover:border-rose-500 bg-white hover:bg-rose-50/50 cursor-pointer transition-all flex flex-col items-center gap-2"
                >
                  <Upload className="w-6 h-6 text-rose-600" />
                  <span className="text-xs font-medium text-rose-900 font-sans">내 기기에서 사진 올리기</span>
                  <span className="text-[10px] text-rose-800/60 font-sans">또는 이곳에 파일 끌어다 놓기</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Manual file upload bar always accessible as alternative helper */}
      <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-4">
        <span className="text-xs text-rose-800/80 font-sans flex items-center gap-1.5 leading-none">
          <ImageIcon className="w-3.5 h-3.5 text-rose-700" />
          가로세로 비율이 정사각에 가까우면 예쁘게 나옵니다.
        </span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border border-rose-200"
        >
          <Upload className="w-3.5 h-3.5" />
          직접 업로드
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
