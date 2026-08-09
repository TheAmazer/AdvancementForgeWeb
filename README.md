# 🎮 Minecraft 1.21.1 NeoForge — Create & Modpack Advancement Generator

An interactive, pixel-perfect web application and AI-powered backend that replicates the **in-game Minecraft Advancement Menu GUI**. It features a **Blank Canvas start**, step-by-step tutorial progression trees, authentic pixel item icons, strict prerequisite progression rules, and an **AI Agent Generator** that analyzes uploaded screenshots or text lists of mod folders to dynamically generate advancement trees!

![Minecraft Advancement GUI](https://img.shields.io/badge/Minecraft-1.21.1--NeoForge-2ecc71?style=for-the-badge&logo=minecraft)
![Vercel Ready](https://img.shields.io/badge/Vercel-Serverless_API-000000?style=for-the-badge&logo=vercel)
![React & Vite](https://img.shields.io/badge/React_19-Vite_8-61dafb?style=for-the-badge&logo=react)
![Google GenAI](https://img.shields.io/badge/AI_Agent-Google_Gemini-8e44ad?style=for-the-badge&logo=google)

---

## ✨ Key Features

* **🎨 Blank Canvas Start & Welcome Hero**:
  * Opens on a clean, interactive **Minecraft Welcome Canvas** overlay.
  * Instant action buttons for 📷 **Screenshot Upload**, 📝 **Text Mod List Input**, or ⚙️ **Try Create Mod 1.21.1 Demo**!
* **🚀 Ready for Vercel Deployment**:
  * Includes `vercel.json` rewrites and a Vercel Serverless API function (`api/analyze-mods.js`) utilizing `@google/genai` with `GEMINI_API_KEY` environment variables.
* **🎨 Pixel-Perfect Minecraft Advancement GUI**:
  * **Authentic Minecraft & Mod Item Pixel Icons**: Built-in SVG pixel art sprites for Create Mod items (Water Wheels, Shafts, Cogwheels, Andesite Alloy, Mechanical Press, Belts, Blaze Burners, Mixers, Rose Quartz, Electron Tubes, Brass Casings, Speed Controllers, Mechanical Arms, Steam Engines, Train Stations, Rolling Mills, Alternators, Electric Motors, Oil Pumpjacks, Distillation Towers, Diesel Engines, XP Drains, Enchanted Books, Fuel Rods, Nuclear Reactors, Drilling Rigs, Jetpacks, Dragon Cores, Master Crown).
  * **Solid White Nodes & Golden Completions**: Nodes stay 100% solid white by default and turn **golden yellow (`#ffff55`)** upon completion!
  * **Always-Visible Fully White Lines**: Connecting orthogonal tree lines stay fully bright white (`#ffffff`) at all times, turning bright green (`#55ff55`) when completed.
  * **🔒 Strict Prerequisite Progression Enforcement**: Players cannot complete advancements out of order. Clicking a locked node displays a red Minecraft alert toast requiring parent completion first!

---

## ⚡ Deployment to Vercel

### Method 1: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Set Environment Variable in Vercel Dashboard**:
   Add `GEMINI_API_KEY` under Project Settings -> Environment Variables.

---

### Method 2: Deploy via GitHub & Vercel Dashboard

1. Push this repository to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. In the **Environment Variables** section, add:
   * **Key**: `GEMINI_API_KEY`
   * **Value**: *Your Google Gemini API Key* (`AIzaSy...`)
4. Click **Deploy**! Vercel will build the frontend and deploy the serverless AI function `api/analyze-mods.js`.

---

## 🚀 Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a `.env` file** (optional):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   Navigate to [http://localhost:5173/](http://localhost:5173/)

---

## 📄 License

MIT License — Feel free to customize and deploy for your Minecraft community!
