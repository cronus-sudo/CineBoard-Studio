import { DirectorRole, ImageSize, AspectRatio, ArtisticStyleOption } from "../types";

export const IMAGE_SIZE_OPTIONS: {
  id: ImageSize;
  label: string;
  badge: string;
  desc: string;
  pixels: string;
}[] = [
  {
    id: "1K",
    label: "1K Standard",
    badge: "1024px",
    desc: "Fast preview & agile storyboarding",
    pixels: "1024 × 576",
  },
  {
    id: "2K",
    label: "2K Cinema",
    badge: "2048px",
    desc: "Crisp production frames & pitch decks",
    pixels: "2048 × 1152",
  },
  {
    id: "4K",
    label: "4K Master",
    badge: "4096px",
    desc: "Ultra-high-fidelity cinematic stills",
    pixels: "4096 × 2304",
  },
];

export const ASPECT_RATIO_OPTIONS: {
  id: AspectRatio;
  label: string;
  ratio: string;
  desc: string;
}[] = [
  { id: "16:9", label: "16:9 Cinema", ratio: "16:9", desc: "Modern widescreen standard" },
  { id: "2.39:1", label: "2.39:1 Scope", ratio: "2.39:1", desc: "Anamorphic epic theatrical" },
  { id: "4:3", label: "4:3 Academy", ratio: "4:3", desc: "Vintage classic cinema" },
  { id: "1:1", label: "1:1 Square", ratio: "1:1", desc: "Instagram & square framing" },
  { id: "9:16", label: "9:16 Vertical", ratio: "9:16", desc: "Vertical video / Reels" },
];

export const ARTISTIC_STYLES: ArtisticStyleOption[] = [
  {
    id: "anime",
    label: "Anime",
    subtitle: "Makoto Shinkai & Studio Ghibli",
    description: "Vibrant cel-shaded characters, radiant rim lighting, poetic painterly skies, cinematic anime movie still.",
    promptDirective: "High-end anime feature film key visual, Studio Ghibli and Makoto Shinkai aesthetic, gorgeous painterly sky, detailed cel-shaded anime character illustration, radiant lighting, cinematic anime movie still.",
    badge: "Anime",
    previewBg: "from-sky-900/40 via-indigo-900/30 to-black",
    palette: ["#0284c7", "#10b981", "#facc15", "#f43f5e"],
  },
  {
    id: "photorealistic",
    label: "Photorealistic",
    subtitle: "IMAX 70mm Natural Capture",
    description: "Tactile micro-textures, authentic unstylized photographic lighting, natural skin shaders, realistic depth of field.",
    promptDirective: "Ultra-realistic raw film photograph, IMAX 70mm natural capture, authentic skin textures, physical global illumination, realistic atmospheric perspective, sharp focus, hyper-detailed environment, uncompressed raw footage.",
    badge: "Photoreal",
    previewBg: "from-zinc-800/50 via-zinc-900 to-black",
    palette: ["#09090b", "#27272a", "#a1a1aa", "#fafafa"],
  },
  {
    id: "watercolor",
    label: "Watercolor",
    subtitle: "Wet-on-Wet Pigment & Wash",
    description: "Soft fluid pigment blooms, delicate translucent watercolor washes, textured cold-pressed cotton paper grain.",
    promptDirective: "Fine art watercolor storyboard painting, translucent fluid watercolor washes, soft wet-on-wet bleeding pigment edges, delicate splatter accents, textured heavyweight cold-pressed watercolor paper grain, expressive evocative fine-art illustration.",
    badge: "Watercolor",
    previewBg: "from-teal-950/40 via-cyan-900/20 to-black",
    palette: ["#0d9488", "#38bdf8", "#fbbf24", "#e11d48"],
  },
  {
    id: "comic-book",
    label: "Comic Book",
    subtitle: "Bold Ink Lines & Halftone Dots",
    description: "Dynamic ink line-weights, Ben-Day dot shading, punchy graphic contrasts, classic Marvel/DC graphic novel style.",
    promptDirective: "Classic American graphic novel comic book illustration, bold dynamic black ink brush outlines, vibrant flat and gradient comic colors, retro Ben-Day halftone screen dot shading, expressive action cross-hatching, comic book panel key art.",
    badge: "Comic Book",
    previewBg: "from-red-950/40 via-amber-950/20 to-black",
    palette: ["#ef4444", "#3b82f6", "#eab308", "#18181b"],
  },
  {
    id: "sketch",
    label: "Sketch",
    subtitle: "Pencil & Charcoal Storyboard",
    description: "Authentic production storyboard sketches, expressive graphite pencil lines, smudged charcoal shading on animation paper.",
    promptDirective: "Professional Hollywood storyboard production sketch, hand-drawn graphite pencil and charcoal drawing, dynamic gesture lines, expressive anatomical cross-hatching, textured off-white animation bond paper, classic pre-production storyboard panel.",
    badge: "Sketch",
    previewBg: "from-stone-900/50 via-zinc-900 to-black",
    palette: ["#18181b", "#52525b", "#a1a1aa", "#f4f4f5"],
  },
  {
    id: "cinematic",
    label: "Cinematic",
    subtitle: "35mm Panavision & Arri Alexa",
    description: "Atmospheric theatrical lighting, natural anamorphic lens flare, rich cinematic grading, shallow depth of field.",
    promptDirective: "Cinematic film still, shot on 35mm Arri Alexa with anamorphic prime lens, high production value movie cinematography, natural volumetric lighting, shallow depth of field, photorealistic film grain, 8k resolution.",
    badge: "Cinema",
    previewBg: "from-amber-900/40 via-zinc-900 to-black",
    palette: ["#1c1917", "#d97706", "#0284c7", "#f5f5f4"],
  },
  {
    id: "vintage",
    label: "Vintage",
    subtitle: "1970s Technicolor Film Stock",
    description: "Saturated three-strip Technicolor hues, warm vintage vignette, authentic Kodak 5247 grain, nostalgic glow.",
    promptDirective: "Vintage 1970s Technicolor cinematic still, classic 35mm film stock Kodak 5247, warm vintage color palette, heavy organic film grain, nostalgic optical lens distortions, retro Hollywood cinematography.",
    badge: "Vintage",
    previewBg: "from-orange-950/40 via-amber-950/20 to-black",
    palette: ["#451a03", "#b45309", "#d97706", "#fef3c7"],
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    subtitle: "Rain, Holograms & Neon Glow",
    description: "Wet street reflections, vibrant magenta and cyan rim lights, industrial holographic sprawl, dark atmospheric shadows.",
    promptDirective: "Neo-cyberpunk cinematic frame, rainy dystopian metropolis, wet asphalt reflections, glowing cyan and magenta holographic lighting, dark dramatic chiaroscuro shadows, high-tech industrial aesthetic.",
    badge: "Cyberpunk",
    previewBg: "from-fuchsia-950/40 via-cyan-950/20 to-black",
    palette: ["#0f172a", "#ec4899", "#06b6d4", "#a855f7"],
  },
];

export const VISUAL_STYLES = ARTISTIC_STYLES;

export const DIRECTOR_ROLES: DirectorRole[] = [
  {
    id: "director",
    name: "Master Director",
    model: "gemini-4-argon",
    tagline: "Complex Directorial & Camera Staging",
    description: "Deep visual reasoning, blocking, 180° camera axis, focal compression, character consistency, and pacing analysis.",
    badge: "Complex Reasoning (gemini-4-argon)",
    color: "from-amber-500 to-red-600",
    avatarIcon: "Clapperboard",
  },
  {
    id: "script_doctor",
    name: "Storyboard Doctor",
    model: "gemini-3.8-flash",
    tagline: "Scene Beats & Visual Continuity",
    description: "General script breakdown, shot transitions, character continuity, and narrative flow.",
    badge: "General Tasks (gemini-3.8-flash)",
    color: "from-blue-500 to-indigo-600",
    avatarIcon: "Sparkles",
  },
  {
    id: "prompt_polisher",
    name: "Fast Prompt Doctor",
    model: "gemini-3.1-flash-lite",
    tagline: "Lightning-Fast Prompt & Angle Polish",
    description: "Fast generation of diffusion keywords, lighting setups, and camera angle recommendations.",
    badge: "High Speed (gemini-3.1-flash-lite)",
    color: "from-emerald-500 to-teal-600",
    avatarIcon: "Zap",
  },
];
