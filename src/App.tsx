import React, { useState } from "react";
import {
  Film,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Wand2,
  Plus,
  Palette,
  Users,
  Info,
  GripVertical,
} from "lucide-react";
import {
  SceneBreakdown,
  Shot,
  ImageSize,
  AspectRatio,
  ArtisticStyleId,
  CharacterProfile,
  ChatMessage,
} from "./types";
import { Header } from "./components/Header";
import { ScriptUpload } from "./components/ScriptUpload";
import { ShotCard } from "./components/ShotCard";
import { StyleSelector } from "./components/StyleSelector";
import { CharacterDossier } from "./components/CharacterDossier";
import { DirectorChat } from "./components/DirectorChat";
import { PresentationModal } from "./components/PresentationModal";
import { LightboxModal } from "./components/LightboxModal";
import { SAMPLE_SCRIPTS } from "./data/sampleScripts";
import {
  INITIAL_SAMPLE_SCENE,
  INITIAL_SAMPLE_SHOTS,
  INITIAL_SAMPLE_CHARACTERS,
} from "./data/sampleBreakdowns";
import { exportStoryboardPdf } from "./utils/pdfExport";

export default function App() {
  // Global configuration state
  const [imageSize, setImageSize] = useState<ImageSize>("2K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [artisticStyle, setArtisticStyle] = useState<ArtisticStyleId>("cinematic");

  // Script & Breakdown state - initialized with rich sample data so page loads INSTANTLY!
  const [scriptText, setScriptText] = useState(SAMPLE_SCRIPTS[0].content);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [sceneBreakdown, setSceneBreakdown] = useState<SceneBreakdown | null>(INITIAL_SAMPLE_SCENE);
  const [shots, setShots] = useState<Shot[]>(INITIAL_SAMPLE_SHOTS);
  const [characters, setCharacters] = useState<CharacterProfile[]>(INITIAL_SAMPLE_CHARACTERS);
  const [breakdownError, setBreakdownError] = useState<string | null>(null);
  const [infoBanner, setInfoBanner] = useState<string | null>(null);

  // Batch generation state
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [cancelBatchRef, setCancelBatchRef] = useState(false);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome_init",
      role: "assistant",
      content: `🎬 Welcome, Director! I've loaded "${INITIAL_SAMPLE_SCENE.title}" with 6 cinematic shots and 2 character consistency profiles in your dossier. You can edit the script, customize character anchors, switch artistic styles, or ask me for blocking and camera advice!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modelUsed: "gemini-4-argon",
      roleId: "director",
    },
  ]);
  const [selectedShotForChat, setSelectedShotForChat] = useState<Shot | null>(null);

  // Modals
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [lightboxShot, setLightboxShot] = useState<Shot | null>(null);

  // Drag-and-drop shot reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // 1. SCRIPT BREAKDOWN ACTION
  const handleBreakdownScript = async () => {
    if (!scriptText.trim()) return;

    setIsBreakingDown(true);
    setBreakdownError(null);

    try {
      const response = await fetch("/api/script/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptText,
          visualStyle: artisticStyle,
          aspectRatio,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to breakdown script");
      }

      const data: SceneBreakdown = json.data;
      setSceneBreakdown(data);
      setCharacters(data.characters || []);

      // Initialize shots with selected aspect ratio and resolution
      const newShots: Shot[] = (data.shots || []).map((s, idx) => ({
        ...s,
        shotNumber: s.shotNumber || idx + 1,
        imageSize,
        aspectRatio,
        isGenerating: false,
      }));
      setShots(newShots);

      setChatMessages((prev) => [
        ...prev,
        {
          id: `breakdown_${Date.now()}`,
          role: "assistant",
          content: `🎬 Break down complete! I have generated ${newShots.length} shots for "${data.title || "your scene"}" in the ${artisticStyle.toUpperCase()} style. The Character Consistency Dossier has been updated with ${data.characters?.length || 0} cast members.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: "gemini-3.8-flash",
          roleId: "director",
        },
      ]);
    } catch (err: any) {
      console.error("Breakdown error:", err);
      setBreakdownError(err.message || "Failed to parse script");
    } finally {
      setIsBreakingDown(false);
    }
  };

  // 2. GENERATE SINGLE STORYBOARD FRAME
  const handleGenerateFrame = async (index: number, customPrompt?: string) => {
    if (!shots[index]) return;

    const shotToUpdate = shots[index];
    const promptToUse = customPrompt || shotToUpdate.imagePrompt;

    setShots((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, isGenerating: true, error: undefined } : s
      )
    );

    try {
      const response = await fetch("/api/storyboard/generate-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          imageSize, // Affordance for 1K, 2K, 4K
          aspectRatio,
          model: "gemini-3-pro-image-preview",
          artisticStyle,
          characters, // Character Consistency Engine
          charactersInShot: shotToUpdate.charactersInShot || [],
          shotDetails: shotToUpdate,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Failed to generate frame image");
      }

      if (json.quotaNote) {
        setInfoBanner(json.quotaNote);
      }

      setShots((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                imageUrl: json.imageUrl,
                modelUsed: json.modelUsed,
                imageSize: json.imageSize || imageSize,
                aspectRatio: json.aspectRatio || aspectRatio,
                imagePrompt: promptToUse,
                isGenerating: false,
              }
            : s
        )
      );
    } catch (err: any) {
      console.error(`Frame #${shotToUpdate.shotNumber} generation error:`, err);
      setShots((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                isGenerating: false,
                error: err.message || "Image generation failed",
              }
            : s
        )
      );
    }
  };

  // 3. BATCH GENERATE ALL STORYBOARD FRAMES
  const handleBatchGenerate = async () => {
    if (shots.length === 0 || isBatchGenerating) return;

    setIsBatchGenerating(true);
    setCancelBatchRef(false);
    setBatchProgress({ current: 0, total: shots.length });

    for (let i = 0; i < shots.length; i++) {
      if (cancelBatchRef) {
        console.log("Batch generation cancelled by user");
        break;
      }

      setBatchProgress({ current: i + 1, total: shots.length });
      await handleGenerateFrame(i);
    }

    setIsBatchGenerating(false);
  };

  // 4. CHARACTER MANAGEMENT (Consistency Engine)
  const handleUpdateCharacter = (index: number, updated: CharacterProfile) => {
    setCharacters((prev) => prev.map((c, i) => (i === index ? updated : c)));
  };

  const handleAddCharacter = (newChar: CharacterProfile) => {
    setCharacters((prev) => [...prev, newChar]);
  };

  const handleDeleteCharacter = (index: number) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  // 5. UPDATE PROMPT FOR A SHOT
  const handleUpdateShotPrompt = (index: number, newPrompt: string) => {
    setShots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, imagePrompt: newPrompt } : s))
    );
  };

  // 5b. UPDATE CONCISE PANEL DESCRIPTION
  const handleUpdateShotPanelDescription = (index: number, newDesc: string) => {
    setShots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, panelDescription: newDesc } : s))
    );
  };

  // 5c. SHOT REORDERING (DRAG & DROP / ARROW NUDGES)
  const handleMoveShot = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= shots.length ||
      toIndex >= shots.length
    ) {
      return;
    }

    setShots((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      const renumbered = updated.map((s, idx) => ({
        ...s,
        shotNumber: idx + 1,
      }));

      // Keep sceneBreakdown shots synchronized
      setSceneBreakdown((scenePrev) =>
        scenePrev ? { ...scenePrev, shots: renumbered } : null
      );

      return renumbered;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dropTargetIndex === index) {
      setDropTargetIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData("text/plain");
    const sourceIndex =
      sourceIndexStr !== "" ? parseInt(sourceIndexStr, 10) : draggedIndex;

    if (
      sourceIndex !== null &&
      !isNaN(sourceIndex) &&
      sourceIndex !== dropIndex
    ) {
      handleMoveShot(sourceIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // 6. EXPORT TO PDF
  const handleExportPdf = () => {
    if (!sceneBreakdown || shots.length === 0) return;
    exportStoryboardPdf(sceneBreakdown, shots);
  };

  // 7. CONSULT DIRECTOR AI FOR A SPECIFIC SHOT
  const handleConsultDirector = (shot: Shot) => {
    setSelectedShotForChat(shot);
    setIsChatOpen(true);
  };

  const handleApplyPromptToShot = (newPromptSnippet: string) => {
    if (!selectedShotForChat) return;
    const shotIdx = shots.findIndex(
      (s) => s.shotNumber === selectedShotForChat.shotNumber
    );
    if (shotIdx !== -1) {
      handleUpdateShotPrompt(
        shotIdx,
        `${shots[shotIdx].imagePrompt}. ${newPromptSnippet}`
      );
    }
  };

  const generatedCount = shots.filter((s) => Boolean(s.imageUrl)).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation & Global Controls */}
      <Header
        imageSize={imageSize}
        setImageSize={setImageSize}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        visualStyle={artisticStyle}
        setVisualStyle={(val) => setArtisticStyle(val as ArtisticStyleId)}
        onOpenChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onExportPdf={handleExportPdf}
        hasShots={shots.length > 0}
        chatMessageCount={chatMessages.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Informational Banner */}
        {infoBanner && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{infoBanner}</span>
            </div>
            <button
              onClick={() => setInfoBanner(null)}
              className="text-amber-400 hover:text-white font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error Notification */}
        {breakdownError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{breakdownError}</span>
            </div>
            <button
              onClick={() => setBreakdownError(null)}
              className="text-red-400 hover:text-red-200 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Script Input & Breakdown */}
        <section aria-labelledby="script-section-heading">
          <h2 id="script-section-heading" className="sr-only">Script Input &amp; Breakdown</h2>
          <ScriptUpload
            scriptText={scriptText}
            setScriptText={setScriptText}
            onBreakdown={handleBreakdownScript}
            isLoading={isBreakingDown}
            visualStyle={artisticStyle}
            setVisualStyle={(val) => setArtisticStyle(val as ArtisticStyleId)}
          />
        </section>

        {/* Section 2: Preferred Artistic Style Selector */}
        <section aria-labelledby="style-section-heading">
          <h2 id="style-section-heading" className="sr-only">Preferred Artistic Style</h2>
          <StyleSelector
            selectedStyle={artisticStyle}
            onSelectStyle={(id) => setArtisticStyle(id)}
          />
        </section>

        {/* Section 3: Character Consistency Dossier */}
        {characters.length > 0 && (
          <section aria-labelledby="character-dossier-heading">
            <h2 id="character-dossier-heading" className="sr-only">Character Consistency Engine</h2>
            <CharacterDossier
              characters={characters}
              onUpdateCharacter={handleUpdateCharacter}
              onAddCharacter={handleAddCharacter}
              onDeleteCharacter={handleDeleteCharacter}
            />
          </section>
        )}

        {/* Section 4: Storyboard Shots Matrix */}
        {sceneBreakdown && (
          <section aria-labelledby="storyboard-sequence-heading" className="space-y-6">
            {/* Scene Banner */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-xs font-bold uppercase">
                    {sceneBreakdown.slugline || "SCENE 1"}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    Mood: <strong className="text-zinc-200">{sceneBreakdown.mood}</strong>
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono border border-zinc-700 font-bold">
                    Res: {imageSize}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-sky-400 font-mono border border-zinc-700">
                    Style: {artisticStyle.toUpperCase()}
                  </span>
                </div>
                <h2 id="storyboard-sequence-heading" className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
                  {sceneBreakdown.title}
                </h2>
                <p className="text-xs md:text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                  {sceneBreakdown.logline}
                </p>
              </div>

              {/* Batch Generation Control */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleBatchGenerate}
                  disabled={isBatchGenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isBatchGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>
                        Rendering {batchProgress.current} / {batchProgress.total} ({imageSize})...
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate All Frames ({imageSize})</span>
                    </>
                  )}
                </button>

                {isBatchGenerating && (
                  <button
                    onClick={() => setCancelBatchRef(true)}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => setIsPresentationOpen(true)}
                  disabled={generatedCount === 0}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Play Animatic ({generatedCount}/{shots.length})</span>
                </button>
              </div>
            </div>

            {/* Storyboard Sequence Header & Reorder Hint */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">
                    Storyboard Timeline ({shots.length} Panels)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Drag shot cards by the grip handle <GripVertical className="w-3 h-3 inline text-amber-400" /> or use the <span className="text-amber-300 font-mono">◀ / ▶</span> arrows on any card to resequence the scene.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
                <span className="text-amber-400 font-bold">{generatedCount}</span> of {shots.length} frames rendered
              </div>
            </div>

            {/* Shots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shots.map((shot, idx) => (
                <ShotCard
                  key={shot.id || `shot-${shot.shotNumber || idx + 1}-${idx}`}
                  shot={shot}
                  index={idx}
                  totalShots={shots.length}
                  currentImageSize={imageSize}
                  currentAspectRatio={aspectRatio}
                  onGenerateFrame={handleGenerateFrame}
                  onOpenLightbox={(s) => setLightboxShot(s)}
                  onConsultDirector={handleConsultDirector}
                  onUpdateShotPrompt={handleUpdateShotPrompt}
                  onUpdateShotPanelDescription={handleUpdateShotPanelDescription}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === idx}
                  isDropTarget={dropTargetIndex === idx && draggedIndex !== idx}
                  onMoveShot={handleMoveShot}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-4 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-zinc-300">CineBoard Studio</span>
            <span>• Powered by Gemini 3 Pro Image &amp; Director AI</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <span>Model: gemini-3-pro-image-preview</span>
            <span>•</span>
            <span>Resolutions: 1K / 2K / 4K</span>
            <span>•</span>
            <span>Character Continuity Engine</span>
          </div>
        </div>
      </footer>

      {/* Multi-turn Gemini Chatbot Drawer */}
      <DirectorChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        setMessages={setChatMessages}
        scriptContext={scriptText}
        selectedShot={selectedShotForChat}
        characters={characters}
        onApplyPromptToShot={handleApplyPromptToShot}
      />

      {/* Lightbox / High-Resolution Frame Inspector */}
      <LightboxModal
        shot={lightboxShot}
        isOpen={Boolean(lightboxShot)}
        onClose={() => setLightboxShot(null)}
        onConsultDirector={handleConsultDirector}
      />

      {/* Animatic / Slideshow Presentation Modal */}
      <PresentationModal
        scene={sceneBreakdown}
        shots={shots}
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
