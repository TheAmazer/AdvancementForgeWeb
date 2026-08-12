# 🎮 Minecraft 1.21.1 NeoForge — AdvancementForge Web

An interactive, pixel-perfect web application and AI-powered backend that replicates the **in-game Minecraft Advancement Menu GUI**. It features a **Blank Canvas start**, step-by-step tutorial progression trees, authentic pixel item icons, strict prerequisite progression rules, and an **AI System Architect Agent** (powered by **Google Gemini 3.6 Flash**) that performs exhaustive visual inspection of uploaded screenshots or text lists of mod folders to dynamically generate tutorial advancement trees!

[![Live Web Application](https://img.shields.io/badge/🌐_LIVE_WEB_APP-advancement--forge--web.vercel.app-2ecc71?style=for-the-badge&logo=vercel)](https://advancement-forge-web.vercel.app/)
![Minecraft Version](https://img.shields.io/badge/Minecraft-1.21.1--NeoForge-2ecc71?style=for-the-badge&logo=minecraft)
![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless_API-000000?style=for-the-badge&logo=vercel)
![React & Vite](https://img.shields.io/badge/React_19-Vite_8-61dafb?style=for-the-badge&logo=react)
![Google GenAI](https://img.shields.io/badge/AI_Agent-Gemini_3.6_Flash-8e44ad?style=for-the-badge&logo=google)

---

## 🌐 Live Web Application

👉 **[https://advancement-forge-web.vercel.app/](https://advancement-forge-web.vercel.app/)**

Experience the live app directly in your browser without any installation required! Upload your Minecraft mod folder screenshot or paste a text list of `.jar` files to instantly generate multi-branch advancement trees.

---

## ✨ Project Description & Key Features

* **🎨 Blank Canvas Start & Welcome Hero**:
  * Opens on a clean, interactive **Minecraft Welcome Canvas** overlay.
  * Instant action buttons for 📷 **Screenshot Upload**, 📝 **Text Mod List Input**, or ⚙️ **Try Create Mod 1.21.1 Demo**!
* **🤖 Powered by Gemini 3.6 Flash System Architect**:
  * Utilizes Google's latest `gemini-3.6-flash` model with structured System Role prompts for exhaustive visual inspection of `.jar` filenames.
  * Custom `repairJson` truncation recovery engine automatically fixes unclosed strings and balances structural brackets to ensure 100% JSON parsing reliability.
* **📦 Exhaustive 33+ Mod Directory Recognition**:
  * Full recognition support for major Minecraft modpacks including Create (and 8+ addons), Applied Energistics 2, Industrial Foregoing, Sophisticated Storage & Backpacks, Simple Quarries, Sodium, Iris, FTB, and utility libraries.
* **🎨 Pixel-Perfect Minecraft Advancement GUI**:
  * **Authentic Item Pixel Icons**: Built-in SVG pixel art sprites for Create Mod & general tech items (Water Wheels, Shafts, Mechanical Press, Belts, Blaze Burners, Mixers, Electron Tubes, Brass Casings, Alternators, Diesel Engines, Fuel Rods, Nuclear Reactors, Drilling Rigs, Master Crown).
  * **Solid White Nodes & Golden Completions**: Nodes stay 100% solid white by default and turn **golden yellow (`#ffff55`)** upon completion!
  * **Always-Visible Fully White Lines**: Connecting orthogonal tree lines stay bright white (`#ffffff`) at all times, turning bright green (`#55ff55`) when completed.
  * **🔒 Strict Prerequisite Progression Enforcement**: Players cannot complete advancements out of order. Clicking a locked node displays a red Minecraft alert toast requiring parent completion first!
  * **♾️ Unlimited Horizontal Tab Scrolling**: Supports unlimited advancement tabs with smooth horizontal scrolling (`overflow-x: auto`) that never distorts or breaks the menu layout.

---

## 🏗️ System Architecture & Engineering

The application utilizes a dual-tier serverless architecture engineered for instant response times, high reliability, and zero setup for end users:

```
+---------------------------------------------------------------------------------+
|                               User Web Browser                                  |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | Advancement GUI     |  | Prerequisite Engine  |  | MinecraftIcon Renderer |  |
|  | (Pan/Zoom Canvas)   |  | (Strict Progression) |  | (Pixel Art SVGs)       |  |
|  +----------+----------+  +----------------------+  +------------------------+  |
|             |             +----------------------+  +------------------------+  |
|             |             | Web Audio Engine     |  | LocalStorage           |  |
|             |             | (Retro Chimes)       |  | (Saved Trees)          |  |
|             |             +----------------------+  +------------------------+  |
+-------------|-------------------------------------------------------------------+
              | HTTP POST /api/analyze-mods (Base64 / JSON)
              v
+---------------------------------------------------------------------------------+
|                         Vercel Serverless Function                              |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | JSON Body Parser    |  | Gemini 3.6 Flash     |  | repairJson Recovery    |  |
|  | (50MB Payload Limit)|  | (System Architect)   |  | (String-Aware Parser)  |  |
|  +---------------------+  +----------------------+  +------------------------+  |
+---------------------------------------------------------------------------------+
```

### 1. Dynamic Canvas & Non-Overlapping Lines (`AdvancementTree.jsx`)
* **Grid Coordinate Mapping**:
  Nodes map discrete grid coordinates `(x, y)` to pixel locations:
  $$\text{Pixel}_X = \text{OFFSET}_X + x \times 160$$
  $$\text{Pixel}_Y = \text{OFFSET}_Y + y \times 105$$
* **Non-Overlapping Orthogonal SVG Paths**:
  Connections between parent right edge $(x_{1,R}, y_{1,C})$ and child left edge $(x_{2,L}, y_{2,C})$ turn in the empty midpoint between columns:
  $$x_{\text{mid}} = \frac{x_{1,R} + x_{2,L}}{2}$$
  $$\text{Path} = \text{M } x_{1,R}\,y_{1,C} \text{ L } x_{\text{mid}}\,y_{1,C} \text{ L } x_{\text{mid}}\,y_{2,C} \text{ L } x_{2,L}\,y_{2,C}$$
* **Visual Line Stroke Rules**:
  * Default: `#ffffff` (100% bright white and fully visible).
  * Completed: `#55ff55` (bright green).

### 2. Prerequisite Progression Validation Engine (`App.jsx`)
* **Validation Check**:
  $$\text{CanComplete}(A) = \begin{cases} 
  \text{true} & \text{if } A.\text{parent} == \text{null} \\
  \text{completedMap}[A.\text{parent}] & \text{otherwise}
  \end{cases}$$
* If $\text{CanComplete}(A) == \text{false}$, completion is blocked, a click sound plays, and a red alert toast displays `🔒 PREREQUISITE REQUIRED! Complete "[Parent Title]" first!`.

### 3. Pixel Item & Mod Icon Renderer (`MinecraftIcon.jsx`)
* Uses 16x16 SVG pixel matrices rendered with `shape-rendering="crispEdges"` to display crisp, scalable Minecraft item textures without blur or external network dependencies.

### 4. Real-Time Web Audio Synthesizer (`audio.js`)
* Uses Web Audio API `AudioContext` to generate retro UI sounds dynamically:
  * **Click Sound**: Short triangle wave with exponential pitch decay (440Hz $\to$ 120Hz).
  * **Task/Goal Chime**: Sine wave arpeggio across C5, E5, G5, C6 frequencies.
  * **Challenge Fanfare**: Square wave brass fanfare (A4, C#5, E5, A5) with envelope sustain.

### 5. Backend AI & Truncation Recovery Engine (`api/analyze-mods.js`)
* **Endpoint**: `POST /api/analyze-mods`
* **Model Pipeline**: Primary `gemini-3.6-flash` (with fallback to `gemini-3.5-flash` across `v1beta` and `v1` REST endpoints).
* **Payload Architecture**: Direct base64 JSON payload supporting up to 50MB request sizes.
* **Truncation Recovery (`repairJson`)**:
  1. String-aware tokenizer tracks escaped quotes `"`, open brackets `[`, and open braces `{`.
  2. If an AI response truncates mid-stream, the parser safely clips at the last complete object boundary `}`, balances trailing brackets `]` and braces `}`, and returns valid JSON.
* **33-Mod Directory Fallback**: If no API key is provided, the backend falls back to an offline directory analyzer supporting 33+ recognized Minecraft mods.

---

## 📄 License

MIT License — Free for the Minecraft modding community!
