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
1. Identify all installed mods and their versions visible in the screenshot.
2. Group the recognized gameplay/tech/magic/adventure mods into 3 to 8 logical progression tabs.
3. For each tab, generate a detailed 5 to 10 step sequential tutorial advancement progression tree.
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
2. Group the mods into 3 to 8 logical progression tabs.
3. For each tab, generate a detailed 5 to 10 step sequential tutorial advancement path with short 1-2 word titles!
${SCHEMA_PROMPT}
`;

export default async function handler(req, res) {
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
    const userApiKey = req.headers['x-api-key'] || 
                       process.env.GEMINI_API_KEY || 
                       process.env.VITE_GEMINI_API_KEY || 
                       process.env.GOOGLE_API_KEY || 
                       process.env.GEMINI_KEY;

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
        // Use production-tested Gemini models
        const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
        let response = null;
        let lastErr = null;

        for (const modelName of modelsToTry) {
          try {
            if (imageBase64) {
              const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').trim();
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
          let rawText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(rawText);
          return res.status(200).json({ success: true, data: parsed, source: 'ai' });
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

    // Comprehensive Fallback Mod Analyzer
    const fallbackData = generateFallbackAdvancements(modListText);
    return res.status(200).json({ 
      success: true, 
      data: fallbackData, 
      source: 'fallback',
      warning: `AI API Offline (${geminiErrorMsg || 'Key missing'}). Showing analyzed modpack tree.` 
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
    parsedModNames = [
      "Create", "Create Connected", "Create Crafts & Additions", 
      "Create Diesel Generators", "Create Nuclear", "Create Ore Excavation", 
      "Industrial Foregoing", "Applied Energistics 2", "Sophisticated Backpacks"
    ];
  }

  const recognizedMods = parsedModNames.map((modName, idx) => ({
    id: `mod_${idx}`,
    name: modName,
    version: "1.0.0",
    filename: `${modName.toLowerCase().replace(/\s+/g, '-')}.jar`,
    color: idx % 2 === 0 ? "#e67e22" : "#3498db",
    icon: modName.toLowerCase().includes("create") ? "⚙️" : modName.toLowerCase().includes("ae") || modName.toLowerCase().includes("applied") ? "💎" : "📦",
    description: `Analyzed modpack entry: ${modName}`
  }));

  const createMods = recognizedMods.filter(m => m.name.toLowerCase().includes("create"));
  const techMods = recognizedMods.filter(m => !m.name.toLowerCase().includes("create") && (m.name.toLowerCase().includes("industrial") || m.name.toLowerCase().includes("applied") || m.name.toLowerCase().includes("quarry")));
  const utilMods = recognizedMods.filter(m => m.name.toLowerCase().includes("sophisticated") || m.name.toLowerCase().includes("jei") || m.name.toLowerCase().includes("sodium") || m.name.toLowerCase().includes("iris"));

  const tabs = [];
  const advancements = [];

  // Tab 1: Create Engineering
  tabs.push({ id: "tab_create", title: "Kinetic Engineering", icon: "⚙️", mod: "Create Suite", bg: "stone" });
  advancements.push(
    { id: "c_1", tab: "tab_create", title: "1. Rotation", frame: "task", icon: "water_wheel", x: 0, y: 0, parent: null, mod: "create", modName: "Create", tagline: "Kinetic power", description: "Craft a Water Wheel or Hand Crank for rotational force.", guide: ["• Place Water Wheel in water flow."], reward: "4x Shaft" },
    { id: "c_2", tab: "tab_create", title: "2. Pressing", frame: "task", icon: "mechanical_press", x: 1, y: 0, parent: "c_1", mod: "create", modName: "Create", tagline: "Sheet metal", description: "Stamp iron ingots into sheets using a Mechanical Press.", guide: ["• Mount Press above a Depot."], reward: "1x Mechanical Press" },
    { id: "c_3", tab: "tab_create", title: "3. Mixer", frame: "goal", icon: "mechanical_mixer", x: 2, y: 0, parent: "c_2", mod: "create", modName: "Create", tagline: "Alloy brass", description: "Mix copper and zinc in a heated Basin for Brass.", guide: ["• Heat Basin with Blaze Burner."], reward: "8x Brass Ingot" },
    { id: "c_4", tab: "tab_create", title: "4. Automation", frame: "challenge", icon: "crown", x: 3, y: 0, parent: "c_3", mod: "create", modName: "Create Suite", tagline: "Factory master", description: "Automate all kinetic production lines!", guide: ["• Complete full factory loop."], reward: "1x Master Engineer Crown" }
  );

  // Tab 2: Advanced Tech & AE2
  if (techMods.length > 0) {
    tabs.push({ id: "tab_tech", title: "Digital & Energy", icon: "⚡", mod: techMods[0].name, bg: "darkstone" });
    advancements.push(
      { id: "t_1", tab: "tab_tech", title: "1. Circuits", frame: "task", icon: "electron_tube", x: 0, y: 0, parent: null, mod: techMods[0].id, modName: techMods[0].name, tagline: "Digital age", description: `Construct starter components for ${techMods[0].name}.`, guide: ["• Craft initial processors."], reward: "8x Silicon" },
      { id: "t_2", tab: "tab_tech", title: "2. Power Grid", frame: "goal", icon: "alternator", x: 1, y: 0, parent: "t_1", mod: techMods[0].id, modName: techMods[0].name, tagline: "FE energy storage", description: "Build high-capacity power cells and wiring.", guide: ["• Wire energy network."], reward: "1x Energy Cell" },
      { id: "t_3", tab: "tab_tech", title: "3. Quantum ME", frame: "challenge", icon: "crown", x: 2, y: 0, parent: "t_2", mod: techMods[0].id, modName: techMods[0].name, tagline: "Infinite storage", description: "Establish a fully automated digital storage network!", guide: ["• Assemble ME Controller."], reward: "1x Quantum Link" }
    );
  }

  // Tab 3: Logistics & Storage
  tabs.push({ id: "tab_util", title: "Storage & Logistics", icon: "📦", mod: "Modpack Utilities", bg: "cobble" });
  advancements.push(
    { id: "u_1", tab: "tab_util", title: "1. Backpacks", frame: "task", icon: "mechanical_belt", x: 0, y: 0, parent: null, mod: "sophisticated", modName: "Sophisticated Storage", tagline: "Portable storage", description: "Craft upgraded backpacks and storage chests.", guide: ["• Craft Leather Backpack."], reward: "1x Backpack Upgrade" },
    { id: "u_2", tab: "tab_util", title: "2. Quarries", frame: "goal", icon: "drilling_rig", x: 1, y: 0, parent: "u_1", mod: "quarry", modName: "Mining Systems", tagline: "Automated mining", description: "Deploy automated quarry diggers for bulk ore extractions.", guide: ["• Power subterranean quarry."], reward: "1x Diamond Drill" }
  );

  return {
    modpackTitle: "Recognized Modpack (Analyzed Tree)",
    recognizedMods: recognizedMods,
    tabs: tabs,
    advancements: advancements
  };
}
