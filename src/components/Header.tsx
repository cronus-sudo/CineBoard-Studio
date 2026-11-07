import React from "react";
import {
  Film,
  Sparkles,
  Download,
  Play,
  MessageSquare,
  Sliders,
  Ratio,
  Maximize2,
} from "lucide-react";
import { ImageSize, AspectRatio } from "../types";
import { IMAGE_SIZE_OPTIONS, ASPECT_RATIO_OPTIONS, VISUAL_STYLES } from "../data/config";

interface HeaderProps {
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  visualStyle: string;
  setVisualStyle: (style: string) => void;
  onOpenChat: () => void;
  isChatOpen: boolean;
  onOpenPresentation: () => void;
  onExportPdf: () => void;
  hasShots: boolean;
  chatMessageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  imageSize,
  setImageSize,
  aspectRatio,
  setAspectRatio,
  visualStyle,
  setVisualStyle,
  onOpenChat,
  isChatOpen,
  onOpenPresentation,
  onExportPdf,
  hasShots,
  chatMessageCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/50 border border-amber-400/30">
            <Film className="w-5 h-5 text-zinc-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg tracking-wider font-extrabold text-white flex items-center gap-1.5">
                CINEBOARD <span className="text-amber-400 font-sans text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">STUDIO</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              AI Script Breakdown &amp; Storyboard Engine • <span className="text-amber-300 font-mono">gemini-3-pro-image</span>
            </p>
          </div>
        </div>

        {/* Global Controls: Resolution (1K/2K/4K) + Aspect Ratio + Style */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Resolution Affordance (1K, 2K, 4K) as required */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
            <span className="text-zinc-400 px-2 font-medium flex items-center gap-1">
              <Sliders className="w-3 h-3 text-amber-400" /> Res:
            </span>
            <div className="flex gap-0.5">
              {IMAGE_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setImageSize(opt.id)}
                  title={`${opt.label} (${opt.pixels}) - ${opt.desc}`}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    imageSize === opt.id
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  {opt.id}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs">
            <Ratio className="w-3.5 h-3.5 text-zinc-400 mr-1.5" />
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer text-xs"
            >
              {ASPECT_RATIO_OPTIONS.map((ratio) => (
                <option key={ratio.id} value={ratio.id} className="bg-zinc-900 text-zinc-100">
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visual Style */}
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="bg-transparent text-zinc-200 focus:outline-none cursor-pointer text-xs max-w-[150px] truncate"
            >
              {VISUAL_STYLES.map((style) => (
                <option key={style.id} value={style.id} className="bg-zinc-900 text-zinc-100">
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          {hasShots && (
            <>
              <button
                onClick={onOpenPresentation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-lg text-xs font-medium transition"
                title="Play Animatic / Slideshow"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden md:inline">Animatic</span>
              </button>

              <button
                onClick={onExportPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-lg text-xs font-medium transition"
                title="Export Storyboard as PDF"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Export PDF</span>
              </button>
            </>
          )}

          {/* Director AI Assistant Drawer Toggle */}
          <button
            onClick={onOpenChat}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition relative ${
              isChatOpen
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Director AI</span>
            {chatMessageCount > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold flex items-center justify-center">
                {chatMessageCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
