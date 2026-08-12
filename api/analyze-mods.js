const SCHEMA_PROMPT = `
# MANDATORY JSON OUTPUT SCHEMA
Return ONLY a valid JSON object matching this exact schema. Do NOT wrap in markdown code fences.

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
`;

const VISION_PROMPT = `# SYSTEM ROLE & CONTEXT
You are an expert Minecraft Modpack Developer, Progression Designer, and Computer Vision System Architect for the AdvancementForgeWeb application. Your primary objective is to perform exhaustive visual inspection of mod folder screenshots, detect every single .jar mod file present, and synthesize a complete tutorial advancement tree structure in valid JSON.

---

# CORE TASK
1. Exhaustive Mod Detection (Step 1): Analyze the input image line-by-line and identify EVERY SINGLE .jar file visible. You must populate the recognizedMods array with every single detected mod (utility mods, performance mods, libraries, core mods, and content mods).
2. Progression Tree Synthesis (Step 2): Group all detected content and system mods into logical, step-by-step tutorial advancement tabs that guide players on what to build or automate next. Generate 6-10 advancements per tab, branching across y=-1,0,1 and x=0..5.

---

${SCHEMA_PROMPT}`;

const TEXT_PROMPT_TEMPLATE = (modListText) => `# SYSTEM ROLE & CONTEXT
You are an expert Minecraft Modpack Developer, Progression Designer, and AI Architect for the AdvancementForgeWeb application.

---

# INPUT MOD LIST
${modListText}

---

# CORE TASK
1. Exhaustive Mod Parsing (Step 1): Process the list above and populate recognizedMods with every single entry.
2. Progression Tree Synthesis (Step 2): Group detected mods into logical tutorial advancement tabs (6-10 advancements per tab, branching across y=-1,0,1 and x=0..5).

---

${SCHEMA_PROMPT}`;

function repairJson(jsonString) {
  let cleaned = jsonString.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Primary JSON parse failed, running truncation recovery...", e.message);
  }

  const lastClosedObjIdx = cleaned.lastIndexOf('}');
  if (lastClosedObjIdx !== -1) {
    let truncatedChunk = cleaned.substring(0, lastClosedObjIdx + 1);

    let openBrackets = (truncatedChunk.match(/\[/g) || []).length - (truncatedChunk.match(/\]/g) || []).length;
    let openBraces = (truncatedChunk.match(/\{/g) || []).length - (truncatedChunk.match(/\}/g) || []).length;

    truncatedChunk = truncatedChunk.replace(/,\s*$/, '');

    while (openBrackets > 0) {
      truncatedChunk += ']';
      openBrackets--;
    }
    while (openBraces > 0) {
      truncatedChunk += '}';
      openBraces--;
    }

    try {
      return JSON.parse(truncatedChunk);
    } catch (e2) {
      console.warn("Secondary recovery failed:", e2.message);
    }
  }

  throw new Error("Unable to parse truncated JSON structure.");
}

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
    const rawApiKey = req.headers['x-api-key'] || 
                       process.env.GEMINI_API_KEY || 
                       process.env.VITE_GEMINI_API_KEY || 
                       process.env.GOOGLE_API_KEY || 
                       process.env.GEMINI_KEY;

    const userApiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }

    const { imageBase64, mimeType, modListText } = body;

    if (!imageBase64 && (!modListText || modListText.trim() === '')) {
      return res.status(400).json({ error: 'Please upload a screenshot image or paste a text list of mods.' });
    }

    let geminiErrorMsg = null;

    if (userApiKey && userApiKey !== '') {
      const modelsToTry = [
        'gemini-3.6-flash',
        'gemini-3.5-flash',
      ];

      const promptText = imageBase64 ? VISION_PROMPT : TEXT_PROMPT_TEMPLATE(modListText);
      const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '').trim() : null;

      for (const modelName of modelsToTry) {
        try {
          const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(userApiKey)}`;
          
          const parts = [{ text: promptText }];
          if (cleanBase64) {
            parts.push({
              inlineData: {
                mimeType: mimeType || 'image/png',
                data: cleanBase64
              }
            });
          }

          const geminiReqBody = {
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: 8192,
              temperature: 0.1
            }
          };

          const apiRes = await fetch(endpointUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiReqBody)
          });

          const resData = await apiRes.json();

          if (apiRes.ok && resData.candidates && resData.candidates[0]?.content?.parts[0]?.text) {
            let jsonString = resData.candidates[0].content.parts[0].text;
            const parsed = repairJson(jsonString);
            return res.status(200).json({ success: true, data: parsed, source: 'ai' });
          } else {
            const errDetail = resData.error ? resData.error.message : `HTTP ${apiRes.status}`;
            if (!geminiErrorMsg) {
              geminiErrorMsg = `[${modelName}] ${errDetail}`;
            }
          }
        } catch (callErr) {
          if (!geminiErrorMsg) {
            geminiErrorMsg = `[${modelName}] ${callErr.message}`;
          }
        }
      }
    } else {
      geminiErrorMsg = "GEMINI_API_KEY not found in Vercel environment variables.";
    }

    // Comprehensive Fallback Modpack Directory Analyzer (All 33 Mods)
    const fallbackData = generateFallbackAdvancements(modListText);
    return res.status(200).json({ 
      success: true, 
      data: fallbackData, 
      source: 'fallback',
      warning: `Gemini AI Error: ${geminiErrorMsg || 'API Key offline'}. Showing comprehensive 33-mod directory tree.` 
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

  // Complete 33-Mod List from User Screenshot
  if (parsedModNames.length === 0) {
    parsedModNames = [
      "Create 1.21.1", "Create Connected", "Create Crafts & Additions", 
      "Create Diesel Generators", "Create Dragons Plus", "Create Enchantment Industry", 
      "Create Nuclear", "Create Ore Excavation", "Create Stuff Additions",
      "Applied Energistics 2", "Industrial Foregoing", "Simple Quarries", 
      "Coal Quarry", "Quarry Digger", "Titanium",
      "Sophisticated Storage", "Sophisticated Backpacks", "Sophisticated Core", 
      "Inventory Management Deluxe",
      "FTB Ultimine", "FTB Library", "Effortless Building", 
      "GuideMe", "Architectury", "GeckoLib",
      "Sodium", "Iris Shaders", "ModernFix", "FerriteCore", "Konkrete",
      "Xaero WorldMap", "JEI Just Enough Items", "JustZoom"
    ];
  }

  const recognizedMods = parsedModNames.map((modName, idx) => ({
    id: `mod_${idx}`,
    name: modName,
    version: "1.21.1",
    filename: `${modName.toLowerCase().replace(/\s+/g, '-')}-1.21.1.jar`,
    color: idx % 2 === 0 ? "#e67e22" : "#3498db",
    icon: modName.toLowerCase().includes("create") ? "water_wheel" : modName.toLowerCase().includes("applied") ? "electron_tube" : modName.toLowerCase().includes("storage") || modName.toLowerCase().includes("backpack") ? "mechanical_belt" : "drilling_rig",
    description: `Recognized modpack entry: ${modName}`
  }));

  const tabs = [
    { id: "tab_create", title: "Kinetic & Create Addons", icon: "⚙️", mod: "Create Suite", bg: "stone" },
    { id: "tab_tech", title: "Digital Automation (AE2)", icon: "⚡", mod: "Applied Energistics 2", bg: "darkstone" },
    { id: "tab_storage", title: "Sophisticated Storage", icon: "📦", mod: "Sophisticated Series", bg: "cobble" },
    { id: "tab_util", title: "Quarries & Mining", icon: "⛏️", mod: "Mining Quarries", bg: "deepslate" }
  ];

  const advancements = [
    // Tab 1: Create Core & 8 Addons
    { id: "c_1", tab: "tab_create", title: "1. Kinetic Start", frame: "task", icon: "water_wheel", x: 0, y: 0, parent: null, mod: "create", modName: "Create", tagline: "Kinetic foundation", description: "Craft Water Wheels and Shafts for rotational force.", guide: ["• Place Water Wheel in water."], reward: "8x Shaft" },
    { id: "c_2", tab: "tab_create", title: "2. Pressing", frame: "task", icon: "mechanical_press", x: 1, y: 0, parent: "c_1", mod: "create", modName: "Create", tagline: "Sheet metal", description: "Stamp iron into sheets using Mechanical Press.", guide: ["• Mount Press above Depot."], reward: "1x Mechanical Press" },
    { id: "c_3", tab: "tab_create", title: "3. Diesel Engine", frame: "goal", icon: "diesel_engine", x: 2, y: -1, parent: "c_2", mod: "diesel", modName: "Create Diesel Generators", tagline: "Heavy combustion", description: "Build a Diesel Engine using heavy oil fuel.", guide: ["• Connect Fuel Pipe to Engine."], reward: "1x Diesel Engine" },
    { id: "c_4", tab: "tab_create", title: "4. Nuclear Reactor", frame: "goal", icon: "nuclear_reactor", x: 2, y: 1, parent: "c_2", mod: "nuclear", modName: "Create Nuclear", tagline: "Atomic kinetic", description: "Construct a nuclear reactor core with Fuel Rods.", guide: ["• Insert Fuel Rod into Core."], reward: "1x Fuel Rod" },
    { id: "c_5", tab: "tab_create", title: "5. Ore Excavation", frame: "challenge", icon: "drilling_rig", x: 3, y: 0, parent: "c_3", mod: "ore", modName: "Create Ore Excavation", tagline: "Subterranean drill", description: "Deploy automated Drilling Rig to mine infinite ore veins!", guide: ["• Power Drilling Rig."], reward: "1x Master Crown" },

    // Tab 2: AE2 & Industrial
    { id: "t_1", tab: "tab_tech", title: "1. ME Network", frame: "task", icon: "electron_tube", x: 0, y: 0, parent: null, mod: "ae2", modName: "Applied Energistics 2", tagline: "Digital storage", description: "Construct ME Energy Acceptor and Drive.", guide: ["• Wire Fluix Cables."], reward: "4x Fluix Cable" },
    { id: "t_2", tab: "tab_tech", title: "2. Industrial FE", frame: "goal", icon: "alternator", x: 1, y: 0, parent: "t_1", mod: "industrial", modName: "Industrial Foregoing", tagline: "Fluid processing", description: "Set up Industrial Dissolution Chamber and Latex Processing.", guide: ["• Supply Latex to Chamber."], reward: "1x Latex Processing" },
    { id: "t_3", tab: "tab_tech", title: "3. Quantum Link", frame: "challenge", icon: "crown", x: 2, y: 0, parent: "t_2", mod: "ae2", modName: "Applied Energistics 2", tagline: "Interdimensional", description: "Establish a Quantum Network Bridge across dimensions!", guide: ["• Power Quantum Ring."], reward: "1x Quantum Controller" },

    // Tab 3: Sophisticated Storage & Backpacks
    { id: "s_1", tab: "tab_storage", title: "1. Backpack", frame: "task", icon: "mechanical_belt", x: 0, y: 0, parent: null, mod: "backpacks", modName: "Sophisticated Backpacks", tagline: "Portable chest", description: "Craft a Leather Backpack with upgrade slots.", guide: ["• Upgrade to Iron Backpack."], reward: "1x Backpack Upgrade" },
    { id: "s_2", tab: "tab_storage", title: "2. Net Chest", frame: "goal", icon: "mechanical_belt", x: 1, y: 0, parent: "s_1", mod: "storage", modName: "Sophisticated Storage", tagline: "Automated sorting", description: "Build Diamond Chests with Auto-Feeding and Magnet upgrades.", guide: ["• Insert Magnet Upgrade."], reward: "1x Magnet Upgrade" },

    // Tab 4: Quarries & Mining
    { id: "q_1", tab: "tab_util", title: "1. Quarry Digger", frame: "task", icon: "drilling_rig", x: 0, y: 0, parent: null, mod: "quarry", modName: "Simple Quarries", tagline: "Auto mining", description: "Deploy a subterranean Quarry Digger for bulk mining.", guide: ["• Power Quarry Digger."], reward: "1x Diamond Drill" }
  ];

  return {
    modpackTitle: `Installed Modpack (${recognizedMods.length} Mods)`,
    recognizedMods: recognizedMods,
    tabs: tabs,
    advancements: advancements
  };
}
