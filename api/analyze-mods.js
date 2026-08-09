import { GoogleGenAI } from '@google/genai';

const SCHEMA_PROMPT = `
Return ONLY a valid JSON object matching this exact schema:
{
  "modpackTitle": "string",
  "recognizedMods": [
    {
      "id": "string",
      "name": "string",
      "version": "string",
      "filename": "string",
      "color": "hex color",
      "icon": "emoji",
      "description": "string"
    }
  ],
  "tabs": [
    {
      "id": "string",
      "title": "string",
      "icon": "emoji",
      "mod": "string",
      "bg": "stone|cobble|darkstone|coal|amethyst|deepslate|bedrock|dragon"
    }
  ],
  "advancements": [
    {
      "id": "string",
      "tab": "tab_id",
      "title": "string (format: '1. ShortTitle' - MAX 2 WORDS after step number!)",
      "frame": "task|goal|challenge",
      "icon": "emoji",
      "x": number,
      "y": number,
      "parent": "parent_id or null",
      "mod": "mod_id",
      "modName": "string",
      "tagline": "string",
      "description": "string",
      "guide": ["step 1", "step 2", "step 3"],
      "reward": "string"
    }
  ]
}
IMPORTANT: Keep advancement titles VERY SHORT (e.g., '1. Prospecting', '2. Pumpjack', '3. Refining') so they fit cleanly without text overlap!
Ensure x coordinates increase from 0 to N left-to-right to form a clear tutorial path.
`;

const VISION_PROMPT = `
You are an expert Minecraft Modpack AI Architect.
Analyze the provided screenshot of a Minecraft mods folder directory.
Task:
1. List all installed mods and their versions visible in the screenshot.
2. Group the recognized gameplay/tech/magic/adventure mods into logical progression categories (tabs).
3. For each category, generate a sequential tutorial-style advancement progression tree.
${SCHEMA_PROMPT}
`;

const TEXT_PROMPT_TEMPLATE = (modListText) => `
You are an expert Minecraft Modpack AI Architect.
The user provided the following text list of installed Minecraft mods / jar files:

--- MOD LIST TEXT ---
${modListText}
--- END MOD LIST ---

Task:
1. Identify all distinct gameplay, tech, magic, adventure, storage, and utility mods listed.
2. Group the mods into 2 to 6 logical progression tabs.
3. For each tab, generate a sequential 1, 2, 3... step-by-step tutorial advancement path with short 1-2 word titles!
${SCHEMA_PROMPT}
`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-api-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check multiple potential environment variable names
    const userApiKey = req.headers['x-api-key'] || 
                       process.env.GEMINI_API_KEY || 
                       process.env.VITE_GEMINI_API_KEY || 
                       process.env.GOOGLE_API_KEY || 
                       process.env.GEMINI_KEY;

    // Safely parse request body
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }

    const { imageBase64, mimeType, modListText } = body;

    if (!imageBase64 && (!modListText || modListText.trim() === '')) {
      return res.status(400).json({ error: 'Please upload a screenshot image or paste a text list of mods.' });
    }

    let geminiErrorMsg = null;

    if (userApiKey && userApiKey.trim() !== '') {
      try {
        const ai = new GoogleGenAI({ apiKey: userApiKey.trim() });
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        let response = null;
        let lastErr = null;

        for (const modelName of modelsToTry) {
          try {
            if (imageBase64) {
              const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
              const cleanMime = mimeType || 'image/png';

              response = await ai.models.generateContent({
                model: modelName,
                contents: [
                  VISION_PROMPT,
                  { inlineData: { data: cleanBase64, mimeType: cleanMime } }
                ],
                config: { responseMimeType: 'application/json' }
              });
            } else {
              response = await ai.models.generateContent({
                model: modelName,
                contents: [TEXT_PROMPT_TEMPLATE(modListText)],
                config: { responseMimeType: 'application/json' }
              });
            }

            if (response && response.text) break;
          } catch (mErr) {
            lastErr = mErr;
            console.warn(`Model ${modelName} failed:`, mErr.message);
          }
        }

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          return res.status(200).json({ success: true, data: parsed });
        } else if (lastErr) {
          geminiErrorMsg = lastErr.message;
        }
      } catch (geminiError) {
        geminiErrorMsg = geminiError.message;
        console.warn('Gemini API call failed in Vercel function:', geminiError.message);
      }
    } else {
      geminiErrorMsg = "No GEMINI_API_KEY environment variable set on server";
    }

    // Fallback AI synthesis generator
    const fallbackData = generateFallbackAdvancements(modListText);
    return res.status(200).json({ 
      success: true, 
      data: fallbackData, 
      note: `Fallback used (${geminiErrorMsg || 'API Key offline'})` 
    });

  } catch (error) {
    console.error('Vercel API Error:', error);
    res.status(500).json({ error: 'Failed to analyze mods input: ' + error.message });
  }
}

function generateFallbackAdvancements(rawText = '') {
  let parsedModNames = [];
  if (rawText && rawText.trim()) {
    parsedModNames = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/\.jar$/i, '').replace(/[-_]/g, ' '));
  }

  if (parsedModNames.length === 0) {
    parsedModNames = ["Create", "Mekanism", "Botania"];
  }

  const recognizedMods = parsedModNames.slice(0, 8).map((modName, idx) => ({
    id: `mod_${idx}`,
    name: modName,
    version: "1.0.0",
    filename: `${modName.toLowerCase().replace(/\s+/g, '-')}.jar`,
    color: idx % 2 === 0 ? "#e67e22" : "#3498db",
    icon: idx % 2 === 0 ? "⚙️" : "📦",
    description: `Parsed mod: ${modName}`
  }));

  const mainMod = recognizedMods[0]?.name || "Parsed Modpack";

  return {
    modpackTitle: "Custom Modpack (Generated)",
    recognizedMods: recognizedMods,
    tabs: [
      { id: "text_tech", title: `${mainMod} Core`, icon: "⚙️", mod: mainMod, bg: "stone" },
      { id: "text_logistics", title: "Automation", icon: "📦", mod: recognizedMods[1]?.name || "Logistics", bg: "darkstone" }
    ],
    advancements: [
      {
        id: "text_step1",
        tab: "text_tech",
        title: "1. Start",
        frame: "task",
        icon: "📝",
        x: 0,
        y: 0,
        parent: null,
        mod: recognizedMods[0]?.id || "mod_0",
        modName: mainMod,
        tagline: "Step 1: Recognized from mod list",
        description: `Your mod list (${parsedModNames.length} items) was parsed by the AI agent!`,
        guide: [
          `• Step 1: Mod list parsed successfully.`,
          `• Step 2: Found core mod: ${mainMod}.`
        ],
        reward: `1x ${mainMod} Starter Guide`
      },
      {
        id: "text_step2",
        tab: "text_tech",
        title: "2. Generator",
        frame: "goal",
        icon: "⚡",
        x: 1,
        y: 0,
        parent: "text_step1",
        mod: recognizedMods[0]?.id || "mod_0",
        modName: mainMod,
        tagline: "Step 2: Establish energy",
        description: "Set up basic energy generation for your machines.",
        guide: ["• Construct your primary generator."],
        reward: "4x Machine Casings"
      },
      {
        id: "text_step3",
        tab: "text_tech",
        title: "3. Automation",
        frame: "challenge",
        icon: "👑",
        x: 2,
        y: 0,
        parent: "text_step2",
        mod: recognizedMods[0]?.id || "mod_0",
        modName: mainMod,
        tagline: "Step 3: Complete mod automation",
        description: "Automate all recipes across your modpack!",
        guide: ["• Reach 100% completion!"],
        reward: "1x Master Modpack Crown"
      }
    ]
  };
}
