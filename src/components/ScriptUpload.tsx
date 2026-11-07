import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Clapperboard,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Scissors,
  Copy,
  ClipboardPaste,
  Undo2,
  Redo2,
  Trash2,
  AlignLeft,
  Check,
} from "lucide-react";
import { SAMPLE_SCRIPTS, SampleScript } from "../data/sampleScripts";

interface ScriptUploadProps {
  scriptText: string;
  setScriptText: (text: string) => void;
  onBreakdown: () => void;
  isLoading: boolean;
  visualStyle: string;
  setVisualStyle: (style: any) => void;
}

export const ScriptUpload: React.FC<ScriptUploadProps> = ({
  scriptText,
  setScriptText,
  onBreakdown,
  isLoading,
  visualStyle,
  setVisualStyle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<string[]>([scriptText]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isInternalChange = useRef(false);

  // Sync external scriptText updates into history if not triggered by undo/redo
  useEffect(() => {
    if (!isInternalChange.current) {
      if (history[historyIndex] !== scriptText) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(scriptText);
        // Limit history to 50 states
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
    isInternalChange.current = false;
  }, [scriptText]);

  const updateScriptWithHistory = useCallback((newText: string) => {
    isInternalChange.current = true;
    setScriptText(newText);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, setScriptText]);

  // Undo Action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevText = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setScriptText(prevText);
    }
  }, [history, historyIndex, setScriptText]);

  // Redo Action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextText = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setScriptText(nextText);
    }
  }, [history, historyIndex, setScriptText]);

  // Cut Action
  const handleCut = async () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end);

    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
      } catch (err) {
        document.execCommand("cut");
      }
      const newText = el.value.substring(0, start) + el.value.substring(end);
      updateScriptWithHistory(newText);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start);
      }, 0);
    }
  };

  // Copy Action
  const handleCopy = async () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end) || el.value;

    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      } catch (err) {
        document.execCommand("copy");
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }
    }
  };

  // Paste Action
  const handlePaste = async () => {
    const el = textareaRef.current;
    if (!el) return;

    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newText = el.value.substring(0, start) + clipboardText + el.value.substring(end);
        updateScriptWithHistory(newText);
        setTimeout(() => {
          el.focus();
          const newPos = start + clipboardText.length;
          el.setSelectionRange(newPos, newPos);
        }, 0);
      }
    } catch (err) {
      setPasteNotice("Press Ctrl+V / Cmd+V to paste directly into the editor.");
      setTimeout(() => setPasteNotice(null), 3000);
      el.focus();
    }
  };

  // Quick screenplay snippet inserters
  const insertSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText = el.value.substring(0, start) + snippet + el.value.substring(end);
    updateScriptWithHistory(newText);
    setTimeout(() => {
      el.focus();
      const newCursor = start + snippet.length;
      el.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      if (e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else {
        e.preventDefault();
        handleUndo();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handleRedo();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        updateScriptWithHistory(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        updateScriptWithHistory(content);
      }
    };
    reader.readAsText(file);
  };

  const loadSample = (sample: SampleScript) => {
    setFileName(null);
    updateScriptWithHistory(sample.content);
    setVisualStyle(sample.recommendedStyle);
  };

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const lineCount = scriptText.trim() ? scriptText.split("\n").length : 0;
  const charCount = scriptText.length;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 md:p-7 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clapperboard className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-wide">Screenplay &amp; Scene Text Editor</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Write, paste, cut, copy, or edit your scene before generating storyboard shots. Full undo/redo and screenplay formatting shortcuts included.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.fountain,.md,.json,.pdf,.doc,.docx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Script File</span>
          </button>
        </div>
      </div>

      {/* Sample Scripts Chips */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick load industry sample screenplays:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCRIPTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => loadSample(sample)}
              className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-amber-500/50 transition flex items-center gap-1.5 group text-left cursor-pointer"
            >
              <FileText className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              <span className="font-medium">{sample.title}</span>
              <span className="text-[10px] text-zinc-400 font-mono">({sample.genre.split("/")[0].trim()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Text Editing Toolbar (Cut, Copy, Paste, Undo, Redo, Format) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-zinc-950 border-t border-x border-zinc-800 rounded-t-xl text-xs text-zinc-300">
        {/* Core Edit Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redo</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          <button
            onClick={handleCut}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition"
            title="Cut selection to clipboard"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span>Cut</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition"
            title="Copy selection (or whole script)"
          >
            {copyFeedback ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>{copyFeedback ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handlePaste}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paste</span>
          </button>

          <button
            onClick={() => updateScriptWithHistory("")}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 flex items-center gap-1 border border-zinc-800 transition"
            title="Clear all script text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clear</span>
          </button>
        </div>

        {/* Screenplay Quick Tags */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-zinc-500 mr-1 hidden lg:inline font-sans">Quick Insert:</span>
          <button
            onClick={() => insertSnippet("\nEXT. LOCATION - NIGHT\n")}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition"
          >
            + EXT.
          </button>
          <button
            onClick={() => insertSnippet("\nINT. LOCATION - DAY\n")}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition"
          >
            + INT.
          </button>
          <button
            onClick={() => insertSnippet("\nCHARACTER\n(tone)\nSpoken dialogue line.\n")}
            className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-800 transition"
          >
            + DIALOGUE
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-x border-b transition-all ${
          dragOver
            ? "border-amber-500 bg-amber-500/5 shadow-inner"
            : "border-zinc-800 bg-zinc-950/70 focus-within:border-amber-500/60"
        }`}
      >
        {fileName && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Loaded File: <strong className="font-mono text-white">{fileName}</strong></span>
            </div>
            <button
              onClick={() => {
                setFileName(null);
                updateScriptWithHistory("");
              }}
              className="text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {pasteNotice && (
          <div className="px-4 py-1.5 bg-amber-500/10 text-amber-300 border-b border-amber-500/20 text-xs">
            {pasteNotice}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={scriptText}
          onChange={(e) => updateScriptWithHistory(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`EXT. CYBERPUNK HIGHWAY - RAIN\n\nRain lashes against the neon tarmac. Detective Vance's cruiser drifts around the hairpin turn...\n\n(Type or paste your screenplay here. Edit text freely, then click Generate Storyboard Shots)`}
          rows={10}
          className="w-full bg-transparent px-4 py-3.5 text-sm font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-y leading-relaxed selection:bg-amber-500/30"
        />

        {/* Footer info inside editor */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/60 bg-zinc-950/80 text-[11px] text-zinc-400 rounded-b-xl font-mono">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
          <div className="text-zinc-500 text-[11px] hidden sm:block font-sans">
            Shortcuts: Ctrl+Z (Undo) • Ctrl+Y (Redo) • Ctrl+A (Select All)
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Breakdown and automatic panel description generation</span>
        </div>

        <button
          onClick={onBreakdown}
          disabled={isLoading || !scriptText.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-sm tracking-wide transition shadow-lg shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing &amp; Generating Panel Descriptions...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Analyze Script &amp; Generate Storyboard Shots</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
