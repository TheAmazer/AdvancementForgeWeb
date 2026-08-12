# 🤝 Contributing to Minecraft Advancement Generator (`AdvancementForgeWeb`)

Thank you for your interest in contributing! Whether you are adding support for new Minecraft mods, creating pre-set advancement trees, adding pixel item icons, improving the AI agent prompts, or polishing the pixel UI, this guide will help you get started.

---

## 🛠️ Development Setup

1. Fork & clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
4. Verify build stability before submitting PRs:
   ```bash
   npm run build
   ```

---

## 📜 Advancement Node Schema Specification

When adding pre-set advancement nodes to `src/data/advancements.js` or customizing AI outputs in `server.js` / `api/analyze-mods.js`, adhere strictly to this JSON schema:

```json
{
  "modpackTitle": "string",
  "recognizedMods": [
    {
      "id": "string",
      "name": "Display Mod Name",
      "filename": "full-jar-filename.jar",
      "color": "#hexcolor",
      "icon": "emoji"
    }
  ],
  "tabs": [
    {
      "id": "tab_id",
      "title": "Tab Title",
      "icon": "emoji",
      "mod": "Main Mod Name",
      "bg": "stone|cobble|darkstone|deepslate|coal|bedrock"
    }
  ],
  "advancements": [
    {
      "id": "unique_string_id",
      "tab": "tab_id",
      "title": "1. Short Title (MAX 2 WORDS)",
      "frame": "task|goal|challenge",
      "icon": "emoji",
      "x": 0,
      "y": 0,
      "parent": "parent_node_id or null",
      "mod": "mod_id",
      "modName": "Display Mod Name",
      "tagline": "Brief 1-line summary",
      "description": "Full objective description (MAX 8 WORDS)",
      "guide": [
        "• Step 1: Crafting or placement instruction.",
        "• Step 2: Power and piping instructions."
      ],
      "reward": "Item or XP reward"
    }
  ]
}
```

### Guidelines for Node Design:
* **Short Titles**: Titles rendered on tree nodes must be short (e.g., `1. Rotation`, `2. Pressing`, `3. Motor`) to prevent text overlap on compact grid trees (`GRID_SPACING_X = 160`).
* **Frame Types**:
  * `task`: Standard rounded square frame for routine crafting and placement steps.
  * `goal`: Starburst oval frame for key tech tier milestones (e.g. Steam Boiler, Nuclear Core).
  * `challenge`: Spiked golden/purple ornate frame for endgame masteries.
* **Prerequisite Linearity**:
  * Every child node MUST specify its direct parent ID (`parent: "parent_id"`).
  * Nodes sit at column $x_{\text{child}} = x_{\text{parent}} + 1$ to guarantee clean, non-overlapping orthogonal lines.
* **Pixel Item Icon Mapping**:
  * Add custom SVG pixel art sprites in `src/components/MinecraftIcon.jsx`.

---

## 🤖 AI Prompting & Truncation Recovery (`server.js` & `api/analyze-mods.js`)

* **Target Model**: `gemini-3.6-flash` (via Google AI Studio REST API).
* **System Role Prompt**: The system prompt uses explicit `# SYSTEM ROLE & CONTEXT` and `# CORE TASK` framing to enforce line-by-line visual inspection of mod folder screenshots.
* **Truncation Recovery**: If modifying AI outputs, ensure your changes work with the `repairJson` tokenizer in `server.js`. `repairJson` tracks string boundaries and closing braces (`}`) to safely reconstruct valid JSON if Gemini output truncates.

---

## 🎨 UI & Aesthetics Rules

* **Node Colors**:
  * Uncompleted nodes MUST stay 100% solid white (`#ffffff`).
  * Completed nodes turn **golden yellow (`#ffff55`)**.
* **Tree Lines**:
  * All connecting orthogonal lines MUST stay fully bright white (`#ffffff`) at all times.
  * Completed paths turn **bright green (`#55ff55`)**.
* **Tabs**: Keep top tabs icon-only (`<span className="mc-tab-icon">{tab.icon}</span>`) to prevent text bleed.
* **In-Game Tooltip Colors**:
  * Dark purple/black translucent background (`rgba(16, 0, 32, 0.95)`).
  * Double cyan/purple border (`#28006e` and `#5000ff`).
  * Aqua title (`#55ffff`) & Yellow description text (`#ffff55`).

---

## 🔒 Prerequisite Validation Rules

The application strictly enforces prerequisite progression in `App.jsx`:
1. `handleToggleComplete(id)` checks if `adv.parent` exists and `!completedMap[adv.parent]`.
2. If parent is incomplete, completion is blocked, a rejection click plays, and a red alert toast displays: `🔒 PREREQUISITE REQUIRED! Complete "[Parent Title]" first!`.

---

## ✉️ Submitting Pull Requests

1. Create a feature branch (`git checkout -b feature/new-mod-tree`).
2. Commit your changes with descriptive messages.
3. Push to your branch and open a Pull Request.
