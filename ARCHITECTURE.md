# 🏗️ Architecture & System Design

This document details the system architecture of the **Minecraft Advancement Generator & Interactive Web GUI**.

---

## 🏛️ System Overview

The system consists of a dual-tier architecture:
1. **Frontend Client (Vite + React 19)**: Renders an interactive 2D canvas, handles smooth panning/zooming, enforces linear prerequisite progression, synthesizes retro Web Audio sound effects, and renders crisp SVG pixel art item icons.
2. **Backend API Server (Express + Google GenAI)**: Receives mod folder screenshots or text lists and generates dynamic advancement JSON trees via Gemini Vision/Text LLM models.

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
              | HTTP POST /api/analyze-mods
              v
+---------------------------------------------------------------------------------+
|                     Express Backend Server (Node)                               |
|  +---------------------+  +----------------------+  +------------------------+  |
|  | Multer Upload       |  | GenAI SDK Agent      |  | Fallback AI            |  |
|  | (Memory Buffer)     |  | (Gemini Vision)      |  | (Text Parser)          |  |
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

## 🔌 Backend AI Agent (`server.js`)

* **Endpoint**: `POST /api/analyze-mods`
* **Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
* **Vision Processing Pipeline**:
  1. Image buffers uploaded via Multer are converted to Base64 inline data.
  2. Prompts instruct Gemini to perform OCR, recognize `.jar` filenames, extract mod names and versions, group mods by game mechanics, and construct parent-child tree nodes with short 1-2 word titles.
  3. Structured JSON output mode (`responseMimeType: 'application/json'`) guarantees schema compliance.
  4. If no API key is provided, the server invokes `generateFallbackAdvancements()`, ensuring 100% system availability.
