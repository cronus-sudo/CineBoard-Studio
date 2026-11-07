import React from "react";
import {
  X,
  Download,
  MessageSquare,
  Sparkles,
  Camera,
  Layers,
  Check,
} from "lucide-react";
import { Shot, ImageSize } from "../types";

interface LightboxModalProps {
  shot: Shot | null;
  isOpen: boolean;
  onClose: () => void;
  onConsultDirector: (shot: Shot) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  shot,
  isOpen,
  onClose,
  onConsultDirector,
}) => {
  if (!isOpen || !shot) return null;

  const handleDownload = () => {
    if (!shot.imageUrl) return;
    const a = document.createElement("a");
    a.href = shot.imageUrl;
    a.download = `cineboard_shot_${shot.shotNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-5xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Container */}
        <div className="md:w-3/5 bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-zinc-800/80">
          {shot.imageUrl ? (
            <img
              src={shot.imageUrl}
              alt={`Shot ${shot.shotNumber}`}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          ) : (
            <div className="aspect-video w-full flex items-center justify-center text-zinc-600">
              <Camera className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Right: Technical Inspector & Directorial Breakdown */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-black text-xs uppercase">
                  SHOT #{shot.shotNumber}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-xs border border-zinc-700">
                  {shot.imageSize || "1K"} Resolution
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                {shot.shotType}
              </h3>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                  Camera Movement
                </span>
                <span className="text-zinc-200 font-medium">{shot.cameraMovement}</span>
              </div>
              <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
                  Focal Length / Lens
                </span>
                <span className="text-zinc-200 font-medium">{shot.lens}</span>
              </div>
            </div>

            {/* Concise Panel Content Description (Feature 2) */}
            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-xs">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                Visual Panel Content Summary
              </span>
              <p className="text-amber-100 font-medium leading-relaxed">
                {shot.panelDescription || shot.action}
              </p>
            </div>

            {/* Lighting */}
            {shot.lighting && (
              <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Lighting &amp; Atmosphere
                </span>
                <p className="text-zinc-300">{shot.lighting}</p>
              </div>
            )}

            {/* Action */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                Blocking &amp; Action
              </span>
              <p className="text-zinc-200 leading-relaxed bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                {shot.action}
              </p>
            </div>

            {/* Dialogue */}
            {shot.dialogue && (
              <div className="bg-zinc-900/80 p-3 rounded-xl border border-amber-500/20 text-xs">
                <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1 font-bold">
                  Spoken Dialogue
                </span>
                <p className="font-serif italic text-amber-100">"{shot.dialogue}"</p>
              </div>
            )}

            {/* Generative Prompt */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                Visual Prompt Anchor
              </span>
              <p className="text-zinc-400 font-mono text-[11px] bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 leading-normal">
                {shot.imagePrompt}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-2 mt-4">
            <button
              onClick={() => {
                onClose();
                onConsultDirector(shot);
              }}
              className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask Director AI</span>
            </button>

            {shot.imageUrl && (
              <button
                onClick={handleDownload}
                className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-950/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Frame</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
