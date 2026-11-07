# CineBoard Studio 🎬

> **AI Script-to-Storyboard Production Suite**  
> Turn screenplays into sequenced cinematic storyboards, animatics, and production contact sheets with character continuity and multi-style visual rendering.

---

## 🌟 Overview

**CineBoard Studio** is a full-stack web application designed for film directors, screenwriters, storyboard artists, and creative producers. By combining screenwriting tools with the Google Gemini ecosystem (`gemini-3-pro-image-preview`, `gemini-4-argon`, `gemini-3.8-flash`, and `gemini-3.1-flash-lite`), CineBoard Studio converts raw script text into structured scenes, shot breakdowns, and sequenced storyboard visual frames.

---

## ✨ Key Features

### 1. In-App Script Editor & Intelligent Breakdown
- **Interactive Script Editor**: Write or paste screenplays directly into the app with full editing support:
  - **Undo / Redo** stack (with `Ctrl+Z` / `Ctrl+Y` shortcuts).
  - **Cut, Copy, Paste** clipboard buttons.
  - **Screenplay Quick Inserts**: `+ EXT.`, `+ INT.`, `+ DIALOGUE`, `+ ACTION`.
  - **Real-time Telemetry**: Word count, line count, and character counters.
- **Preloaded Sample Scripts**: Includes sample scripts for Sci-Fi, Film Noir, and Fantasy.
- **Instant Scene Breakdown**: Uses `gemini-3.1-flash-lite` with a deterministic fallback parser to extract sluglines, mood, camera movements, shot types, lenses, lighting, and dialogue.

### 2. Multi-Artistic Style Engine (8 Distinct Styles)
Select from 8 artistic rendering styles to tailor the visual aesthetic to your narrative tone:
- **Cinematic 35mm**: Anamorphic lenses, natural film grain, dynamic cinematic range.
- **Anime Key Art**: Studio Ghibli & Makoto Shinkai inspired, cel-shaded, vibrant skies.
- **Photorealistic IMAX**: 70mm natural capture, authentic skin textures, hyper-detailed environments.
- **Watercolor Wash**: Translucent fluid washes, wet-on-wet pigments, cold-pressed paper texture.
- **Comic Book Panel**: Bold ink outlines, retro Ben-Day halftone screen dot shading.
- **Graphite Sketch**: Hollywood production sketches, charcoal cross-hatching, animation paper.
- **Vintage Technicolor**: 1970s Kodak 5247 film stock, warm saturation, organic grain.
- **Neo-Cyberpunk**: Cyan and magenta volumetric lighting, rain-slicked asphalt reflections.

### 3. Character Consistency Engine (Dossier)
- Maintains facial identity, hairstyles, wardrobe, color anchors, and distinctive traits across every generated frame in the scene.
- Automatically isolates characters appearing in specific shots and injects their identity anchors directly into the image generation prompts.
- Directors can customize, add, or edit character profiles in the **Character Consistency Dossier**.

### 4. Automatic Concise Panel Descriptions
- Every shot card automatically generates and displays a concise, punchy visual description (`panelDescription`) summarizing the visual action or content of the frame (under 20 words).
- Directors can edit panel descriptions directly or trigger AI auto-summarization at any time.

### 5. Drag-and-Drop Sequence Reordering
- **Native Drag-and-Drop**: Reorder any shot in the timeline by grabbing its `GripVertical` handle.
- **Visual Feedback**: Dragged cards highlight with amber accents and dashed borders, while drop targets illuminate with animated guides.
- **Quick Nudge Buttons**: Use `◀` / `▶` step buttons to move cards forward or backward in sequence with one click.
- **Live Re-indexing**: Reordering immediately re-indexes `shotNumber` sequentially across all shots, staying synchronized with animatic playback and PDF exports.

### 6. High-Fidelity Image Generation (1K / 2K / 4K)
- Generates frames using Google's **`gemini-3-pro-image-preview`** model.
- Supports **1K**, **2K**, and **4K** image sizes, as well as multiple aspect ratios:
  - `16:9` (Widescreen)
  - `2.39:1` (Anamorphic CinemaScope)
  - `4:3` (Academy Ratio)
  - `1:1` (Square Format)
  - `9:16` (Vertical / Mobile)
- **High-Fidelity Vector Canvas Fallback**: When Gemini Pro Image quota is exceeded or unavailable on Free Tier projects, the application automatically renders a stylized SVG storyboard frame tailored to the selected art style and aspect ratio.

### 7. Multi-Turn Director AI Consultation Drawer
- A persistent slide-out consultation drawer offering directorial advice:
  - **Director AI** (`gemini-4-argon`): Deep cinematic reasoning, blocking, camera lenses, lighting ratios, and the 180-degree rule.
  - **Script Doctor** (`gemini-3.8-flash`): Scene beats, narrative pacing, dialogue rhythm, and character motivation.
  - **Prompt Polisher** (`gemini-3.1-flash-lite`): Fast visual prompt engineering with one-click insertion directly into shot cards.

### 8. Animatic Presentation Player & PDF Contact Sheet Export
- **Animatic Slideshow**: View the storyboard sequentially in an animatic player with auto-play, adjustable slide intervals, keyboard navigation, and audio cue indicators.
- **PDF Contact Sheet**: Export complete production contact sheets via `jsPDF`, including shot numbers, camera movements, lenses, lighting notes, dialogue, concise panel descriptions, and rendered visual frames.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - Motion (`motion/react`)
  - Lucide React (Icons)
  - jsPDF (Production PDF contact sheets)
- **Backend**:
  - Express.js
  - Node.js 22 / `tsx`
  - Vite middleware (Dev) / Static file serving (Prod)
- **AI Models & SDK**:
  - `@google/genai` (v3.0.0)
  - `gemini-3-pro-image-preview` (Image Generation)
  - `gemini-4-argon` (Director AI Reasoning)
  - `gemini-3.8-flash` (Script Doctor & Multi-turn Chat)
  - `gemini-3.1-flash-lite` (Fast Scene Breakdown & Panel Summaries)

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with SEO metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies and build scripts
├── server.ts                    # Express server with Vite middleware and Gemini API endpoints
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── src/
│   ├── main.tsx                 # React DOM root entry point
│   ├── App.tsx                  # Core application orchestrator & workspace
│   ├── index.css                # Global styles and Tailwind CSS imports
│   ├── types.ts                 # TypeScript interfaces (Shot, CharacterProfile, SceneBreakdown, etc.)
│   ├── components/
│   │   ├── Header.tsx           # Global navigation bar & resolution/ratio controls
│   │   ├── ScriptUpload.tsx     # Screenplay editor with undo/redo & formatting macros
│   │   ├── StyleSelector.tsx    # 8-style visual selector grid
│   │   ├── CharacterDossier.tsx # Character consistency profiles and anchors
│   │   ├── ShotCard.tsx         # Drag-and-drop shot card with panel descriptions and prompt editing
│   │   ├── DirectorChat.tsx     # Multi-turn Gemini AI consultation drawer
│   │   ├── LightboxModal.tsx    # High-resolution image inspector
│   │   └── PresentationModal.tsx# Animatic slideshow player with auto-play
│   ├── data/
│   │   ├── config.ts            # Visual styles configuration & prompt directives
│   │   ├── sampleBreakdowns.ts  # Pre-loaded sample scene with 6 initial shots
│   │   └── sampleScripts.ts     # Sample screenplay presets (Sci-Fi, Noir, Fantasy)
│   └── utils/
│       └── pdfExport.ts         # Multi-page PDF contact sheet generator
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher (v22 recommended)
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd react-example
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Starts the full-stack Express + Vite development server at `http://localhost:3000`.

- **Production Build**:
  ```bash
  npm run build
  ```
  Compiles client assets into the `dist/` directory.

- **Production Start**:
  ```bash
  npm run start
  ```
  Serves the compiled production build on port `3000`.

- **Type Check / Lint**:
  ```bash
  npm run lint
  ```

---

## 🌐 API Reference

| Method | Endpoint | Description | Model Used |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and API key confirmation | N/A |
| `POST` | `/api/script/breakdown` | Breaks down raw screenplay into structured scene, characters, and shots | `gemini-3.1-flash-lite` |
| `POST` | `/api/storyboard/generate-frame` | Renders a visual frame incorporating art style, character anchors, and resolution | `gemini-3-pro-image-preview` |
| `POST` | `/api/storyboard/summarize-panel`| Generates a concise visual panel description summarizing shot action/content | `gemini-3.1-flash-lite` |
| `POST` | `/api/chat` | Multi-turn directorial consultation with role switching | `gemini-4-argon` / `gemini-3.8-flash` |

---

## 🚢 Deployment & Port Configuration

- **Port 3000 Binding**: In containerized environments like Google Cloud Run, ingress reverse proxies (e.g., Nginx) bind externally to port `8080` and route traffic to the internal Node application listening on port `3000`. `server.ts` is strictly configured to listen on port `3000`.
- **Static Asset Serving**: When a `dist/` directory is present, `server.ts` automatically runs in production mode, serving pre-built static assets without requiring Vite dev middleware.

---

## 📄 License

Apache-2.0
