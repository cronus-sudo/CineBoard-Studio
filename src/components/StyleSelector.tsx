import React from "react";
import {
  Palette,
  Check,
  Film,
  Camera,
  Brush,
  Zap,
  Edit3,
  Clock,
  Eye,
  Layers,
} from "lucide-react";
import { ARTISTIC_STYLES } from "../data/config";
import { ArtisticStyleId, ArtisticStyleOption } from "../types";

interface StyleSelectorProps {
  selectedStyle: ArtisticStyleId;
  onSelectStyle: (styleId: ArtisticStyleId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  isOpen = false,
  onClose,
}) => {
  const getStyleIcon = (id: ArtisticStyleId) => {
    switch (id) {
      case "anime":
        return <Brush className="w-4 h-4 text-sky-400" />;
      case "photorealistic":
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case "watercolor":
        return <Palette className="w-4 h-4 text-teal-400" />;
      case "comic-book":
        return <Zap className="w-4 h-4 text-amber-400" />;
      case "sketch":
        return <Edit3 className="w-4 h-4 text-zinc-300" />;
      case "vintage":
        return <Clock className="w-4 h-4 text-orange-400" />;
      case "cyberpunk":
        return <Eye className="w-4 h-4 text-fuchsia-400" />;
      case "cinematic":
      default:
        return <Film className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Artistic &amp; Rendering Style
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono border border-zinc-700 font-bold">
                {ARTISTIC_STYLES.length} Curated Styles
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Select your preferred visual style. All storyboard panels, character consistency anchors, and framing are generated in this chosen aesthetic.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 cursor-pointer"
          >
            Close
          </button>
        )}
      </div>

      {/* Grid of 8 Art Styles (Anime, Photorealistic, Watercolor, Comic Book, Sketch, Cinematic, Vintage, Cyberpunk) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {ARTISTIC_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;

          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? "bg-zinc-800 border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-950/30"
                  : "bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {getStyleIcon(style.id)}
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      {style.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                  {style.subtitle}
                </p>
              </div>

              {/* Color Palette Indicators */}
              <div className="flex items-center gap-1 pt-2 border-t border-zinc-800/60">
                {style.palette.map((color, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-2 h-2 rounded-full border border-black/40"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
