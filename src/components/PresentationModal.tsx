import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Volume2,
  Camera,
  Film,
} from "lucide-react";
import { SceneBreakdown, Shot } from "../types";

interface PresentationModalProps {
  scene: SceneBreakdown | null;
  shots: Shot[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  scene,
  shots,
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalSec, setIntervalSec] = useState(4);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying && shots.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % shots.length);
      }, intervalSec * 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, intervalSec, shots.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % shots.length);
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + shots.length) % shots.length);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, shots.length, onClose]);

  if (!isOpen || shots.length === 0) return null;

  const currentShot = shots[currentIndex] || shots[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar */}
      <div className="p-4 px-6 flex items-center justify-between border-b border-zinc-900 bg-black/60">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">
              {scene?.title || "STORYBOARD ANIMATIC"}
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">
              {scene?.slugline || "SCENE 1"} • Shot {currentIndex + 1} of {shots.length}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 text-xs text-zinc-300 border border-zinc-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-bold flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <select
              value={intervalSec}
              onChange={(e) => setIntervalSec(Number(e.target.value))}
              className="bg-transparent text-zinc-300 text-xs px-2 focus:outline-none"
            >
              <option value={3} className="bg-zinc-900">3s pace</option>
              <option value={4} className="bg-zinc-900">4s pace</option>
              <option value={6} className="bg-zinc-900">6s pace</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Cinematic Frame Showcase */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + shots.length) % shots.length)}
          className="absolute left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-zinc-950 border border-zinc-800 transition backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Frame container */}
        <div className="max-w-5xl w-full max-h-[75vh] flex flex-col items-center justify-center relative">
          {currentShot.imageUrl ? (
            <img
              src={currentShot.imageUrl}
              alt={`Shot ${currentShot.shotNumber}`}
              className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-zinc-800/80"
            />
          ) : (
            <div className="w-full aspect-[16/9] max-h-[60vh] bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600">
              <Camera className="w-12 h-12 mb-2 text-zinc-700" />
              <p className="text-sm font-mono text-zinc-400">Frame Not Generated Yet</p>
            </div>
          )}

          {/* Screenplay Subtitle / Dialogue Bar */}
          {currentShot.dialogue && (
            <div className="mt-3 px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-center max-w-2xl shadow-xl">
              <p className="text-sm sm:text-base font-serif italic text-amber-200 tracking-wide drop-shadow">
                "{currentShot.dialogue}"
              </p>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % shots.length)}
          className="absolute right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-zinc-950 border border-zinc-800 transition backdrop-blur-md"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Shot Information Timeline & Filmstrip */}
      <div className="p-4 px-6 border-t border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-zinc-950 font-black text-xs uppercase">
                SHOT #{currentShot.shotNumber}
              </span>
              <span className="text-white font-bold text-sm">{currentShot.shotType}</span>
              <span className="text-xs text-zinc-400 font-mono">
                • {currentShot.cameraMovement} • {currentShot.lens}
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-300 line-clamp-1 max-w-2xl mb-0.5">
              Panel: {currentShot.panelDescription || currentShot.action}
            </p>
            <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-2xl">
              Blocking: {currentShot.action}
            </p>
          </div>

          {/* Mini Filmstrip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-md">
            {shots.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-14 h-9 rounded-md overflow-hidden border transition-all ${
                  currentIndex === idx
                    ? "border-amber-400 ring-2 ring-amber-400/30 scale-105"
                    : "border-zinc-800 opacity-60 hover:opacity-100"
                }`}
              >
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[9px] font-mono text-zinc-500">
                    #{s.shotNumber}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
