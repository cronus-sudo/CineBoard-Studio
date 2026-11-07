export type ImageSize = "1K" | "2K" | "4K";
export type AspectRatio = "16:9" | "2.39:1" | "4:3" | "3:4" | "9:16" | "1:1";

export type ArtisticStyleId =
  | "anime"
  | "photorealistic"
  | "watercolor"
  | "comic-book"
  | "sketch"
  | "cinematic"
  | "vintage"
  | "cyberpunk";

export interface ArtisticStyleOption {
  id: ArtisticStyleId;
  label: string;
  subtitle: string;
  description: string;
  promptDirective: string;
  badge: string;
  previewBg: string;
  palette: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  roleTag?: string; // e.g. "Lead Protagonist", "Antagonist", "Deuteragonist"
  visualDescription: string;
  hairAndFace?: string;
  attire?: string;
  distinctiveFeatures?: string;
  colorAnchor?: string;
}

export interface Shot {
  id?: string;
  shotNumber: number;
  shotType: string;
  cameraMovement: string;
  lens: string;
  lighting?: string;
  action: string;
  panelDescription?: string; // Concise textual description summarizing the action/content of the visual panel
  dialogue?: string;
  audioCue?: string;
  durationSec?: number;
  charactersInShot?: string[]; // Names of characters appearing in this frame
  imagePrompt: string;
  imageUrl?: string;
  imageSize?: ImageSize;
  aspectRatio?: AspectRatio;
  modelUsed?: string;
  isGenerating?: boolean;
  error?: string;
}

export interface SceneBreakdown {
  title: string;
  logline: string;
  slugline: string;
  mood: string;
  colorPalette?: string[];
  characters: CharacterProfile[];
  shots: Shot[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleId?: "director" | "script_doctor" | "prompt_polisher";
}

export interface DirectorRole {
  id: "director" | "script_doctor" | "prompt_polisher";
  name: string;
  model: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
  avatarIcon: string;
}
