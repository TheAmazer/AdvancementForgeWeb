# 🏗️ Architecture & System Design

This document details the system architecture of the **Minecraft Advancement Generator & Interactive Web GUI** (`AdvancementForgeWeb`).

---

## 🏛️ System Overview

The system consists of a dual-tier architecture:
1. **Frontend Client (Vite + React 19)**: Renders an interactive 2D canvas, handles smooth panning/zooming, enforces linear prerequisite progression, synthesizes retro Web Audio sound effects, and renders crisp SVG pixel art item icons.
2. **Backend AI Engine (Express + Vercel Serverless Functions)**: Receives mod folder screenshots or text lists and generates dynamic advancement JSON trees via Google Gemini 3.6 Flash LLM models.

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
|                    Express Backend Server / Vercel Serverless                   |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | JSON Body Parser    |  | Gemini 3.6 Flash     |  | repairJson Recovery    |  |
|  | (50MB Payload Limit)|  | (System Architect)   |  | (String-Aware Parser)  |  |
|  +---------------------+  +----------------------+  +------------------------+  |
+---------------------------------------------------------------------------------+
```

---

## 🖥️ Frontend Subsystems

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

---

## 🔌 Backend AI Engine (`server.js` & `api/analyze-mods.js`)

* **Endpoint**: `POST /api/analyze-mods`
* **Model Pipeline**: Primary `gemini-3.6-flash` (with fallback to `gemini-3.5-flash` across `v1beta` and `v1` REST endpoints).
* **Payload Architecture**: Direct base64 JSON payload supporting up to 50MB request sizes.
* **Truncation Recovery (`repairJson`)**:
  1. String-aware tokenizer tracks escaped quotes `"`, open brackets `[`, and open braces `{`.
  2. If an AI response truncates mid-stream, the parser safely clips at the last complete object boundary `}`, balances trailing brackets `]` and braces `}`, and returns valid JSON.
* **33-Mod Directory Fallback**: If no API key is provided, the backend falls back to an offline directory analyzer supporting 33+ recognized Minecraft mods.
