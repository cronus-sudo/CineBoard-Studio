import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Edit2,
  Plus,
  Trash2,
  Check,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CharacterProfile } from "../types";

interface CharacterDossierProps {
  characters: CharacterProfile[];
  onUpdateCharacter: (index: number, updated: CharacterProfile) => void;
  onAddCharacter: (character: CharacterProfile) => void;
  onDeleteCharacter: (index: number) => void;
}

export const CharacterDossier: React.FC<CharacterDossierProps> = ({
  characters,
  onUpdateCharacter,
  onAddCharacter,
  onDeleteCharacter,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<CharacterProfile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<CharacterProfile>({
    id: "",
    name: "",
    roleTag: "Lead",
    visualDescription: "",
    hairAndFace: "",
    attire: "",
    distinctiveFeatures: "",
    colorAnchor: "#f59e0b",
  });

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditForm({ ...characters[idx] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editForm) {
      onUpdateCharacter(editingIndex, editForm);
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleAddNew = () => {
    if (!newForm.name.trim()) return;
    onAddCharacter({
      ...newForm,
      id: `char_${Date.now()}`,
    });
    setNewForm({
      id: "",
      name: "",
      roleTag: "Supporting",
      visualDescription: "",
      hairAndFace: "",
      attire: "",
      distinctiveFeatures: "",
      colorAnchor: "#38bdf8",
    });
    setIsAddingNew(false);
  };

  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md mb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                Character Consistency Engine
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Active
                </span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              Extracted cast visual anchors applied uniformly to every shot to maintain identical facial geometry, hairstyle, and wardrobe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Add Character</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body content */}
      {isOpen && (
        <div className="mt-5 space-y-4 pt-4 border-t border-zinc-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={char.id || idx}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition relative group"
                >
                  {isEditing && editForm ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Name &amp; Role</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white font-bold w-2/3"
                          />
                          <input
                            type="text"
                            value={editForm.roleTag || ""}
                            onChange={(e) => setEditForm({ ...editForm, roleTag: e.target.value })}
                            placeholder="Role"
                            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-300 w-1/3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Face &amp; Hair</label>
                        <textarea
                          rows={2}
                          value={editForm.hairAndFace || ""}
                          onChange={(e) => setEditForm({ ...editForm, hairAndFace: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Attire / Costume</label>
                        <textarea
                          rows={2}
                          value={editForm.attire || ""}
                          onChange={(e) => setEditForm({ ...editForm, attire: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase">Distinctive Features</label>
                        <input
                          type="text"
                          value={editForm.distinctiveFeatures || ""}
                          onChange={(e) => setEditForm({ ...editForm, distinctiveFeatures: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-zinc-200"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-2.5 py-1 text-zinc-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-amber-500 text-zinc-950 font-bold rounded flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Character Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center font-bold text-xs text-zinc-950 shadow-sm">
                            {char.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{char.name}</h4>
                            <span className="text-[10px] text-amber-400 font-mono">
                              {char.roleTag || "Character"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                            title="Edit character visual anchor"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteCharacter(idx)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                            title="Delete character"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Visual Details */}
                      <div className="space-y-2 text-xs text-zinc-300">
                        <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                            Face &amp; Hair:
                          </span>
                          <p className="line-clamp-2 text-zinc-200">
                            {char.hairAndFace || char.visualDescription}
                          </p>
                        </div>

                        <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                            Wardrobe / Attire:
                          </span>
                          <p className="line-clamp-2 text-zinc-200">
                            {char.attire || "Consistent signature outfit"}
                          </p>
                        </div>

                        {char.distinctiveFeatures && (
                          <div className="text-[11px] text-amber-300/90 font-mono">
                            <span className="text-zinc-500 font-sans">Features: </span>
                            {char.distinctiveFeatures}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Character Modal / Inline Form */}
          {isAddingNew && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/50 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Add New Character Anchor for Visual Consistency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-zinc-400">Character Name</label>
                  <input
                    type="text"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="e.g. Detective Vance"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400">Role / Tag</label>
                  <input
                    type="text"
                    value={newForm.roleTag}
                    onChange={(e) => setNewForm({ ...newForm, roleTag: e.target.value })}
                    placeholder="e.g. Lead Protagonist"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-zinc-400">Face, Hair &amp; Age</label>
                  <input
                    type="text"
                    value={newForm.hairAndFace}
                    onChange={(e) => setNewForm({ ...newForm, hairAndFace: e.target.value })}
                    placeholder="e.g. 35yo, angular jawline, dark brown slicked hair, piercing grey eyes"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-zinc-400">Costume / Attire</label>
                  <input
                    type="text"
                    value={newForm.attire}
                    onChange={(e) => setNewForm({ ...newForm, attire: e.target.value })}
                    placeholder="e.g. Charcoal wool trenchcoat, loosened white tie, worn black leather gloves"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs"
                >
                  Add to Dossier
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
