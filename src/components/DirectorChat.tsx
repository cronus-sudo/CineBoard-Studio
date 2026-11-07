import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Clapperboard,
  Sparkles,
  Zap,
  Bot,
  User,
  Copy,
  Check,
  Paperclip,
  Trash2,
  CornerDownLeft,
} from "lucide-react";
import { ChatMessage, DirectorRole, Shot, CharacterProfile } from "../types";
import { DIRECTOR_ROLES } from "../data/config";

interface DirectorChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  scriptContext: string;
  selectedShot: Shot | null;
  characters: CharacterProfile[];
  onApplyPromptToShot?: (prompt: string) => void;
}

export const DirectorChat: React.FC<DirectorChatProps> = ({
  isOpen,
  onClose,
  messages,
  setMessages,
  scriptContext,
  selectedShot,
  characters,
  onApplyPromptToShot,
}) => {
  const [activeRole, setActiveRole] = useState<"director" | "script_doctor" | "prompt_polisher">("director");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachScript, setAttachScript] = useState(true);
  const [attachShot, setAttachShot] = useState(Boolean(selectedShot));

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedShot) {
      setAttachShot(true);
    }
  }, [selectedShot]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const currentRoleConfig = DIRECTOR_ROLES.find((r) => r.id === activeRole) || DIRECTOR_ROLES[0];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          roleId: activeRole,
          scriptContext: attachScript ? scriptContext : "",
          selectedShot: attachShot && selectedShot ? selectedShot : null,
          characters,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from Gemini");
      }

      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: data.modelUsed,
        roleId: activeRole,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: `Error: ${err.message || "Failed to reach AI Director"}. Please verify your API key or model availability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: currentRoleConfig.model,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRoleIcon = (id: string) => {
    switch (id) {
      case "prompt_polisher":
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case "script_doctor":
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case "director":
      default:
        return <Clapperboard className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const suggestedPrompts = [
    activeRole === "director"
      ? "How can I enhance the camera movement and 180° axis for Shot 1?"
      : activeRole === "prompt_polisher"
      ? "Generate a hyper-vivid 4K diffusion prompt for this scene"
      : "Review the pacing and character continuity between these shots",
    "Suggest 3 alternative dramatic camera angles",
    "How to make the lighting more atmospheric?",
  ];

  if (!isOpen) return null;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col transition-all duration-300"
      aria-label="Director AI Studio Drawer"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
              Director's AI Suite
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700">
                Multi-Turn
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Interactive film consultant with dedicated model roles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
              title="Clear conversation history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Role Switcher Tabs */}
      <div className="p-2 bg-zinc-900/60 border-b border-zinc-800">
        <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {DIRECTOR_ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex flex-col items-center gap-0.5 ${
                activeRole === role.id
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/80 font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center gap-1">
                {getRoleIcon(role.id)}
                <span className="truncate">{role.name}</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 truncate">
                {role.model.replace("gemini-", "")}
              </span>
            </button>
          ))}
        </div>

        {/* Active Role Meta description */}
        <div className="mt-2 px-2 py-1 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="italic">{currentRoleConfig.tagline}</span>
          <span className="font-mono text-amber-400 text-[10px] font-bold">
            {currentRoleConfig.model}
          </span>
        </div>
      </div>

      {/* Context attachment indicators */}
      <div className="px-4 py-2 bg-zinc-950/70 border-b border-zinc-800/60 flex flex-wrap items-center gap-2 text-[11px]">
        <label className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer">
          <input
            type="checkbox"
            checked={attachScript}
            onChange={(e) => setAttachScript(e.target.checked)}
            className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0"
          />
          <span>Include Script Context</span>
        </label>

        {selectedShot && (
          <label className="flex items-center gap-1.5 text-amber-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={attachShot}
              onChange={(e) => setAttachShot(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0"
            />
            <span>Active Shot #{selectedShot.shotNumber} ({selectedShot.shotType})</span>
          </label>
        )}
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-amber-400">
              <Clapperboard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-zinc-300 text-sm mb-1">
              {currentRoleConfig.name} is ready
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs mb-4">
              {currentRoleConfig.description}
            </p>

            <div className="w-full space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 block">
                Suggested Directorial Queries:
              </span>
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-zinc-950 font-bold flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md ${
                    isUser
                      ? "bg-amber-500 text-zinc-950 font-medium rounded-tr-sm"
                      : "bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75 font-mono">
                    <span>{isUser ? "You (Director)" : currentRoleConfig.name}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-[10px] text-zinc-500">
                      <span className="font-mono text-amber-400">
                        {msg.modelUsed || currentRoleConfig.model}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-zinc-200 flex items-center gap-1 transition"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>

                        {onApplyPromptToShot && selectedShot && (
                          <button
                            onClick={() => onApplyPromptToShot(msg.content)}
                            className="text-amber-400 hover:text-amber-300 font-medium transition"
                            title="Apply this recommendation into active shot prompt"
                          >
                            Apply to Shot #{selectedShot.shotNumber}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-1 border border-zinc-700">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-xs text-zinc-400 bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 w-fit">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono">{currentRoleConfig.name} ({currentRoleConfig.model}) is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 bg-zinc-900/90 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${currentRoleConfig.name} about shots, blocking, lens choices...`}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/80 rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 transition cursor-pointer font-bold shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500 px-1 font-mono">
          <span>Role: {currentRoleConfig.name}</span>
          <span>Engine: {currentRoleConfig.model}</span>
        </div>
      </div>
    </aside>
  );
};
