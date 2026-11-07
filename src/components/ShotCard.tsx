import React, { useState } from "react";
import {
  Camera,
  Maximize2,
  RefreshCw,
  Edit3,
  Download,
  MessageSquare,
  Sparkles,
  Volume2,
  Check,
  FileText,
  Wand2,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Shot, ImageSize, AspectRatio } from "../types";

interface ShotCardProps {
  shot: Shot;
  index: number;
  totalShots?: number;
  currentImageSize: ImageSize;
  currentAspectRatio: AspectRatio;
  onGenerateFrame: (index: number, customPrompt?: string) => void;
  onOpenLightbox: (shot: Shot) => void;
  onConsultDirector: (shot: Shot) => void;
  onUpdateShotPrompt: (index: number, newPrompt: string) => void;
  onUpdateShotPanelDescription?: (index: number, newDesc: string) => void;
  // Drag and Drop props
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragEnter?: (e: React.DragEvent, index: number) => void;
  onDragLeave?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onMoveShot?: (fromIndex: number, toIndex: number) => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({
  shot,
  index,
  totalShots = 1,
  currentImageSize,
  currentAspectRatio,
  onGenerateFrame,
  onOpenLightbox,
  onConsultDirector,
  onUpdateShotPrompt,
  onUpdateShotPanelDescription,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDropTarget = false,
  onMoveShot,
}) => {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(shot.imagePrompt);

  const [isEditingPanelDesc, setIsEditingPanelDesc] = useState(false);
  const [editedPanelDesc, setEditedPanelDesc] = useState(
    shot.panelDescription || shot.action
  );
  const [isSummarizingDesc, setIsSummarizingDesc] = useState(false);

  const handleSavePrompt = () => {
    onUpdateShotPrompt(index, editedPrompt);
    setIsEditingPrompt(false);
  };

  const handleSavePanelDesc = () => {
    if (onUpdateShotPanelDescription) {
      onUpdateShotPanelDescription(index, editedPanelDesc);
    }
    setIsEditingPanelDesc(false);
  };

  // Auto-summarize panel description using AI
  const handleAutoSummarize = async () => {
    setIsSummarizingDesc(true);
    try {
      const res = await fetch("/api/storyboard/summarize-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shotType: shot.shotType,
          action: shot.action,
          dialogue: shot.dialogue,
        }),
      });
      const data = await res.json();
      if (data.panelDescription) {
        setEditedPanelDesc(data.panelDescription);
        if (onUpdateShotPanelDescription) {
          onUpdateShotPanelDescription(index, data.panelDescription);
        }
      }
    } catch (err) {
      console.error("Auto summarize failed:", err);
    } finally {
      setIsSummarizingDesc(false);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shot.imageUrl) return;
    const a = document.createElement("a");
    a.href = shot.imageUrl;
    a.download = `shot_${shot.shotNumber}_${shot.shotType.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getAspectRatioClass = () => {
    switch (shot.aspectRatio || currentAspectRatio) {
      case "2.39:1":
        return "aspect-[2.39/1]";
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
      default:
        return "aspect-[16/9]";
    }
  };

  const displayedPanelDesc = shot.panelDescription || shot.action;

  return (
    <div
      draggable={!isEditingPrompt && !isEditingPanelDesc}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDragEnter={(e) => onDragEnter && onDragEnter(e, index)}
      onDragLeave={(e) => onDragLeave && onDragLeave(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      onDragEnd={(e) => onDragEnd && onDragEnd(e)}
      className={`bg-zinc-900 border rounded-2xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col group relative ${
        isDragging
          ? "opacity-35 scale-95 border-amber-500 border-dashed ring-2 ring-amber-500/50 shadow-2xl"
          : isDropTarget
          ? "border-amber-400 ring-4 ring-amber-400/30 scale-[1.02] bg-zinc-800"
          : "border-zinc-800 hover:border-zinc-700/80"
      }`}
    >
      {/* Drop Target Guide Indicator */}
      {isDropTarget && (
        <div className="absolute inset-x-0 top-0 h-1.5 bg-amber-400 animate-pulse z-30 rounded-t-2xl shadow-lg shadow-amber-400/80" />
      )}

      {/* Card Header Bar with Drag Handle & Reorder Nudges */}
      <div className="px-3.5 py-2.5 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-1.5">
          {/* Drag Handle */}
          <div
            title="Drag to reorder shot sequence"
            className="p-1 rounded text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 transition cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Shot badge */}
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-xs font-black tracking-wider uppercase">
            SHOT #{shot.shotNumber}
          </span>

          <span className="text-xs font-semibold text-zinc-200 truncate max-w-[130px] sm:max-w-[150px]">
            {shot.shotType}
          </span>
        </div>

        {/* Header Right Actions: Nudge Buttons, Resolution, Director Chat */}
        <div className="flex items-center gap-1">
          {/* Left / Right Quick Reorder Buttons */}
          {onMoveShot && (
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 mr-1">
              <button
                onClick={() => index > 0 && onMoveShot(index, index - 1)}
                disabled={index === 0}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition cursor-pointer"
                title="Move shot earlier in sequence"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => index < totalShots - 1 && onMoveShot(index, index + 1)}
                disabled={index >= totalShots - 1}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 rounded transition cursor-pointer"
                title="Move shot later in sequence"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {shot.imageSize && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-amber-400 border border-zinc-700 font-bold hidden sm:inline">
              {shot.imageSize}
            </span>
          )}

          <button
            onClick={() => onConsultDirector(shot)}
            title="Ask Director AI to review or refine this shot"
            className="p-1.5 rounded-md text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Visual Container */}
      <div className={`relative w-full ${getAspectRatioClass()} bg-zinc-950 overflow-hidden flex items-center justify-center`}>
        {shot.isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-center p-4">
            <div className="w-9 h-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3 shadow-lg shadow-amber-500/20" />
            <p className="text-xs font-bold text-amber-300">Rendering Frame...</p>
            <p className="text-[10px] text-zinc-400 mt-1 font-mono">
              Model: gemini-3-pro-image-preview ({currentImageSize})
            </p>
          </div>
        ) : shot.imageUrl ? (
          <div
            onClick={() => onOpenLightbox(shot)}
            className="relative w-full h-full cursor-pointer group/img"
          >
            <img
              src={shot.imageUrl}
              alt={`Shot ${shot.shotNumber} - ${shot.shotType}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-[1.02]"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-zinc-300 font-mono border border-white/10">
                  {shot.modelUsed?.includes("gemini") ? shot.modelUsed : "gemini-3-pro-image-preview"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-amber-500 hover:text-zinc-950 text-white transition backdrop-blur-sm cursor-pointer"
                    title="Download Frame"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(shot);
                    }}
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-amber-500 hover:text-zinc-950 text-white transition backdrop-blur-sm cursor-pointer"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-amber-300 font-medium drop-shadow-md">
                  Click to inspect in high-resolution
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-3 group-hover:text-amber-400 group-hover:border-amber-500/30 transition">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs text-zinc-400 font-medium mb-1">Frame not yet rendered</p>
            <p className="text-[11px] text-zinc-400 mb-3 max-w-[200px]">
              Ready for generation at <strong className="text-amber-400">{currentImageSize}</strong> resolution
            </p>
            <button
              onClick={() => onGenerateFrame(index)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate ({currentImageSize})</span>
            </button>
          </div>
        )}
      </div>

      {/* Frame Metadata & Direction details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Technical specs pill tags */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
            🎥 {shot.cameraMovement}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
            🔍 {shot.lens}
          </span>
          {shot.durationSec && (
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-800 font-mono">
              ⏱️ {shot.durationSec}s
            </span>
          )}
        </div>

        {/* Feature 2: Concise Textual Description of Visual Panel */}
        <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" /> Panel Content Summary:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleAutoSummarize}
                disabled={isSummarizingDesc}
                className="text-[10px] text-zinc-400 hover:text-amber-300 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800/60 transition cursor-pointer"
                title="Automatically summarize panel action"
              >
                <Wand2 className={`w-2.5 h-2.5 ${isSummarizingDesc ? "animate-spin" : ""}`} />
                <span>{isSummarizingDesc ? "Summarizing..." : "Re-summarize"}</span>
              </button>
              <button
                onClick={() => setIsEditingPanelDesc(!isEditingPanelDesc)}
                className="text-[10px] text-zinc-400 hover:text-white px-1 py-0.5 cursor-pointer"
                title="Edit description"
              >
                <Edit3 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {isEditingPanelDesc ? (
            <div className="space-y-1.5 pt-1">
              <textarea
                value={editedPanelDesc}
                onChange={(e) => setEditedPanelDesc(e.target.value)}
                rows={2}
                className="w-full bg-zinc-950 border border-amber-500/50 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none"
              />
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => setIsEditingPanelDesc(false)}
                  className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePanelDesc}
                  className="px-2.5 py-0.5 bg-amber-500 text-zinc-950 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs font-medium text-amber-100/90 leading-snug">
              {displayedPanelDesc}
            </p>
          )}
        </div>

        {/* Action description */}
        <div className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-zinc-500 uppercase tracking-wider text-[10px] block mb-0.5">
            Full Blocking &amp; Action:
          </strong>
          {shot.action}
        </div>

        {/* Spoken Dialogue (if any) */}
        {shot.dialogue && (
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-0.5">
              Dialogue:
            </span>
            <p className="italic text-zinc-200 font-serif">"{shot.dialogue}"</p>
          </div>
        )}

        {/* Audio Cue (if any) */}
        {shot.audioCue && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono">
            <Volume2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{shot.audioCue}</span>
          </div>
        )}

        {/* Edit Prompt Accordion */}
        {isEditingPrompt ? (
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Diffusion Prompt:
            </label>
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
            />
            <div className="flex justify-end gap-1.5">
              <button
                onClick={() => setIsEditingPrompt(false)}
                className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrompt}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3 text-emerald-400" /> Save
              </button>
              <button
                onClick={() => {
                  handleSavePrompt();
                  onGenerateFrame(index, editedPrompt);
                }}
                className="px-2.5 py-1 bg-amber-500 text-zinc-950 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Save &amp; Render
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <button
              onClick={() => setIsEditingPrompt(true)}
              className="text-zinc-500 hover:text-zinc-300 text-[11px] flex items-center gap-1 transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Prompt</span>
            </button>

            <button
              onClick={() => onGenerateFrame(index)}
              disabled={shot.isGenerating}
              className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1 transition disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${shot.isGenerating ? "animate-spin" : ""}`} />
              <span>{shot.imageUrl ? "Regenerate" : "Generate"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
