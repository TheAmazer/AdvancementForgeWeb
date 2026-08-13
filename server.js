import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Shared Constants ──

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
2. Progression Tree Synthesis (Step 2): Group all detected content and system mods into logical, step-by-step tutorial advancement tabs that guide players on what to build or automate next.

---

# MANDATORY QUANTITY REQUIREMENTS
- Create MINIMUM 5 tabs and up to 8 tabs. Each major mod or mod group gets its own tab.
- Each tab MUST have MINIMUM 8 advancements, ideally 10. No tab should have fewer than 8.
- Branch advancements across multiple rows (y=-1, 0, 1) and columns (x=0, 1, 2, 3, 4, 5).
- You MUST generate at least 40 total advancements across all tabs. Target 50-60.
- Keep titles SHORT (MAX 2 words). Keep descriptions SHORT (MAX 8 words).

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
2. Progression Tree Synthesis (Step 2): Group detected mods into logical tutorial advancement tabs.

---

# MANDATORY QUANTITY REQUIREMENTS
- Create MINIMUM 5 tabs and up to 8 tabs. Each major mod or mod group gets its own tab.
- Each tab MUST have MINIMUM 8 advancements, ideally 10. No tab should have fewer than 8.
- Branch advancements across multiple rows (y=-1, 0, 1) and columns (x=0, 1, 2, 3, 4, 5).
- You MUST generate at least 40 total advancements across all tabs. Target 50-60.
- Keep titles SHORT (MAX 2 words). Keep descriptions SHORT (MAX 8 words).

---

${SCHEMA_PROMPT}`;

// ── JSON Repair Engine ──

function repairJson(raw) {
  let s = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

  // 1. Direct parse
  try { return JSON.parse(s); } catch (e) {
    console.warn("Direct parse failed:", e.message);
  }

  // 2. Find the outermost { ... } pair
  const firstBrace = s.indexOf('{');
  if (firstBrace === -1) throw new Error("No JSON object found in response");
  s = s.substring(firstBrace);

  // 3. Find the last complete array element: look for the pattern "}," or "}" followed by "]"
  //    This finds the last fully-closed advancement/mod object before truncation
  //    Strategy: walk backwards to find the last '}' that is followed by ',' or ']' or end-of-content
  
  // First, try to find if we have a complete response
  try { return JSON.parse(s); } catch (e) {
    console.warn("After brace extraction, parse failed:", e.message);
  }

  // 4. Aggressive truncation recovery
  //    Find the last '}' that could end a valid object in an array
  let lastGoodPos = -1;
  let braceDepth = 0;
  let inStr = false;
  let escaped = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (ch === '{') braceDepth++;
    if (ch === '}') {
      braceDepth--;
      if (braceDepth >= 0) lastGoodPos = i;
    }
  }

  if (lastGoodPos > 0) {
    let repaired = s.substring(0, lastGoodPos + 1);

    // Remove any trailing comma
    repaired = repaired.replace(/,\s*$/, '');

    // Count remaining open brackets/braces and close them
    let ob = 0, oc = 0;
    inStr = false;
    escaped = false;
    for (let i = 0; i < repaired.length; i++) {
      const ch = repaired[i];
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === '[') ob++;
      if (ch === ']') ob--;
      if (ch === '{') oc++;
      if (ch === '}') oc--;
    }

    // Close any remaining open structures
    // Remove trailing comma before closing
    repaired = repaired.replace(/,\s*$/, '');
    while (ob > 0) { repaired += ']'; ob--; }
    while (oc > 0) { repaired += '}'; oc--; }

    try {
      const result = JSON.parse(repaired);
      console.log("✅ JSON repair successful");
      return result;
    } catch (e3) {
      console.warn("Repair attempt failed:", e3.message);
    }
  }

  throw new Error("Unable to repair truncated JSON");
}

// ── API Route (no multer - frontend sends JSON) ──

app.post('/api/analyze-mods', async (req, res) => {
  try {
    const rawApiKey = req.headers['x-api-key'] || 
                       process.env.GEMINI_API_KEY || 
                       process.env.VITE_GEMINI_API_KEY || 
                       process.env.GOOGLE_API_KEY || 
                       process.env.GEMINI_KEY;

    const userApiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

    const { imageBase64, mimeType, modListText } = req.body || {};

    let cleanBase64 = null;
    let cleanMime = mimeType || 'image/png';

    if (imageBase64) {
      cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').trim();
    }

    if (!cleanBase64 && (!modListText || modListText.trim() === '')) {
      return res.status(400).json({ error: 'Please upload a screenshot image or paste a text list of mods.' });
    }

    let geminiErrorMsg = null;
    let responseData = null;

    if (userApiKey && userApiKey !== '') {
      // Try multiple API versions and models (gemini-3.6-flash is current GA)
      const attempts = [
        { ver: 'v1beta', model: 'gemini-3.6-flash' },
        { ver: 'v1',     model: 'gemini-3.6-flash' },
        { ver: 'v1beta', model: 'gemini-3.5-flash' },
        { ver: 'v1',     model: 'gemini-3.5-flash' },
      ];

      const promptText = cleanBase64 ? VISION_PROMPT : TEXT_PROMPT_TEMPLATE(modListText);

      for (const { ver, model } of attempts) {
        if (responseData) break;
        try {
          console.log(`Trying ${ver}/${model}...`);
          const endpointUrl = `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${encodeURIComponent(userApiKey)}`;
          
          const parts = [{ text: promptText }];
          if (cleanBase64) {
            parts.push({
              inlineData: {
                mimeType: cleanMime,
                data: cleanBase64
              }
            });
          }

          const geminiReqBody = {
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: "text/plain",
              maxOutputTokens: 65536,
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
            const jsonString = resData.candidates[0].content.parts[0].text;
            console.log(`✅ ${ver}/${model} returned ${jsonString.length} chars`);
            responseData = repairJson(jsonString);
            
            // Validate that we got meaningful data
            if (!responseData.advancements || responseData.advancements.length === 0) {
              console.warn("Parsed but no advancements found, trying next model...");
              geminiErrorMsg = `[${ver}/${model}] Response parsed but contained no advancements`;
              responseData = null;
              continue;
            }

            console.log(`✅ Success! ${responseData.recognizedMods?.length || 0} mods, ${responseData.tabs?.length || 0} tabs, ${responseData.advancements?.length || 0} advancements`);
            console.log(`   Mods found:`, responseData.recognizedMods?.map(m => m.name).join(', '));
            console.log(`   Tabs:`, responseData.tabs?.map(t => `${t.title} (${responseData.advancements?.filter(a => a.tab === t.id).length} advs)`).join(', '));
          } else {
            const errDetail = resData.error ? resData.error.message : `HTTP ${apiRes.status}`;
            console.warn(`❌ ${ver}/${model}: ${errDetail}`);
            if (!geminiErrorMsg) {
              geminiErrorMsg = `[${ver}/${model}] ${errDetail}`;
            }
          }
        } catch (callErr) {
          console.warn(`❌ ${ver}/${model} exception:`, callErr.message);
          if (!geminiErrorMsg) {
            geminiErrorMsg = `[${ver}/${model}] ${callErr.message}`;
          }
        }
      }

      if (responseData) {
        return res.json({ success: true, data: responseData, source: 'ai' });
      }
    } else {
      geminiErrorMsg = "No API key provided. Set GEMINI_API_KEY env var or paste one in the modal.";
    }

    // ── Fallback: generate from mod list text if AI failed ──
    const fallbackData = generateFallbackFromText(modListText || '');
    return res.json({ 
      success: true, 
      data: fallbackData, 
      source: 'fallback',
      warning: `Gemini AI Error: ${geminiErrorMsg}. Showing fallback tree.` 
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ── Fallback Tree Generator ──

function generateFallbackFromText(rawText) {
  let modNames = [];
  
  if (rawText && rawText.trim()) {
    modNames = rawText.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(l => {
        // Parse jar filenames like "create-1.21.1-6.0.9.jar" → "Create"
        let name = l.replace(/\.jar$/i, '');
        // Remove version suffixes like -1.21.1-6.0.9
        name = name.replace(/-[\d][\d.]*[-+].*$/, '');
        name = name.replace(/-[\d][\d.]*$/, '');
        // Replace separators with spaces and title-case
        name = name.replace(/[-_]/g, ' ');
        name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return { clean: name, raw: l };
      });
  }

  if (modNames.length === 0) {
    modNames = [
      { clean: "Create", raw: "create-1.21.1-6.0.9.jar" },
      { clean: "Create Connected", raw: "create_connected-1.1.13.jar" },
      { clean: "Create Diesel Generators", raw: "createdieselgenerators-1.3.11.jar" },
      { clean: "Create Nuclear", raw: "createnuclear-1.3.2.jar" },
      { clean: "Create Ore Excavation", raw: "createoreexcavation-1.6.8.jar" },
      { clean: "Applied Energistics 2", raw: "appliedenergistics2-19.2.17.jar" },
      { clean: "Industrial Foregoing", raw: "industrialforegoing-1.21-3.6.38.jar" },
      { clean: "Sophisticated Storage", raw: "sophisticatedstorage-1.21-0.10.55.953.jar" },
      { clean: "Sophisticated Backpacks", raw: "sophisticatedbackpacks-1.21-3.20.26.115.jar" },
      { clean: "Simple Quarries", raw: "simplequarries-1.0.4.jar" },
    ];
  }

  const recognizedMods = modNames.map((m, idx) => ({
    id: `mod_${idx}`,
    name: m.clean,
    filename: m.raw,
    color: ['#e67e22','#3498db','#9b59b6','#2ecc71','#e74c3c','#1abc9c'][idx % 6],
    icon: m.clean.toLowerCase().includes("create") ? "⚙️" : 
          m.clean.toLowerCase().includes("applied") || m.clean.toLowerCase().includes("ae2") ? "💎" :
          m.clean.toLowerCase().includes("storage") || m.clean.toLowerCase().includes("backpack") ? "📦" :
          m.clean.toLowerCase().includes("quarr") ? "⛏️" :
          m.clean.toLowerCase().includes("industrial") ? "🏭" : "📦"
  }));

  // Group mods into categories
  const createMods = recognizedMods.filter(m => m.name.toLowerCase().includes('create'));
  const techMods = recognizedMods.filter(m => 
    m.name.toLowerCase().includes('applied') || m.name.toLowerCase().includes('industrial') || 
    m.name.toLowerCase().includes('ae2') || m.name.toLowerCase().includes('mekanism'));
  const storageMods = recognizedMods.filter(m => 
    m.name.toLowerCase().includes('storage') || m.name.toLowerCase().includes('backpack') || 
    m.name.toLowerCase().includes('inventory'));
  const miningMods = recognizedMods.filter(m => 
    m.name.toLowerCase().includes('quarr') || m.name.toLowerCase().includes('excav') || 
    m.name.toLowerCase().includes('mining') || m.name.toLowerCase().includes('dig'));

  const tabs = [];
  const advancements = [];
  let advId = 0;

  const makeId = () => `adv_${advId++}`;

  // Tab 1: Create & Kinetics
  if (createMods.length > 0 || recognizedMods.length > 0) {
    const tabId = "tab_create";
    tabs.push({ id: tabId, title: "Kinetic Engineering", icon: "⚙️", mod: "Create Suite", bg: "stone" });
    
    const root = makeId();
    advancements.push({ id: root, tab: tabId, title: "1. Rotation", frame: "task", icon: "⚙️", x: 0, y: 0, parent: null, mod: "create", modName: "Create", description: "Craft a Water Wheel", guide: ["Place in water flow"], reward: "4x Shaft" });
    
    const press = makeId();
    advancements.push({ id: press, tab: tabId, title: "2. Pressing", frame: "task", icon: "🔨", x: 1, y: 0, parent: root, mod: "create", modName: "Create", description: "Use Mechanical Press", guide: ["Mount above Depot"], reward: "1x Press" });
    
    const mixer = makeId();
    advancements.push({ id: mixer, tab: tabId, title: "3. Mixing", frame: "goal", icon: "🧪", x: 2, y: -1, parent: press, mod: "create", modName: "Create", description: "Mix Brass alloy", guide: ["Heat Basin with Blaze Burner"], reward: "8x Brass" });
    
    const diesel = makeId();
    advancements.push({ id: diesel, tab: tabId, title: "4. Diesel", frame: "goal", icon: "⛽", x: 2, y: 1, parent: press, mod: "diesel", modName: "Create Diesel Gen", description: "Build Diesel Engine", guide: ["Connect fuel pipe"], reward: "1x Engine" });
    
    const nuke = makeId();
    advancements.push({ id: nuke, tab: tabId, title: "5. Nuclear", frame: "challenge", icon: "☢️", x: 3, y: -1, parent: mixer, mod: "nuclear", modName: "Create Nuclear", description: "Construct reactor core", guide: ["Insert Fuel Rods"], reward: "1x Reactor" });
    
    const excav = makeId();
    advancements.push({ id: excav, tab: tabId, title: "6. Excavation", frame: "challenge", icon: "🏗️", x: 3, y: 1, parent: diesel, mod: "ore", modName: "Create Ore Excavation", description: "Deploy drilling rig", guide: ["Power the drill"], reward: "1x Drill" });
    
    const master = makeId();
    advancements.push({ id: master, tab: tabId, title: "7. Mastery", frame: "challenge", icon: "👑", x: 4, y: 0, parent: nuke, mod: "create", modName: "Create Suite", description: "Automate full factory", guide: ["Complete all lines"], reward: "Factory Crown" });
  }

  // Tab 2: Digital & Tech
  if (techMods.length > 0) {
    const tabId = "tab_tech";
    tabs.push({ id: tabId, title: "Digital Systems", icon: "⚡", mod: techMods[0].name, bg: "darkstone" });
    
    const root = makeId();
    advancements.push({ id: root, tab: tabId, title: "1. Circuits", frame: "task", icon: "💎", x: 0, y: 0, parent: null, mod: techMods[0].id, modName: techMods[0].name, description: "Craft starter processors", guide: ["Press silicon wafers"], reward: "8x Silicon" });
    
    const me = makeId();
    advancements.push({ id: me, tab: tabId, title: "2. ME Drive", frame: "task", icon: "💿", x: 1, y: 0, parent: root, mod: techMods[0].id, modName: techMods[0].name, description: "Build ME storage drive", guide: ["Wire Fluix cables"], reward: "1x ME Drive" });
    
    const auto = makeId();
    advancements.push({ id: auto, tab: tabId, title: "3. Autocrafting", frame: "goal", icon: "🔄", x: 2, y: -1, parent: me, mod: techMods[0].id, modName: techMods[0].name, description: "Set up pattern providers", guide: ["Encode crafting patterns"], reward: "1x Crafter" });

    if (techMods.length > 1) {
      const ind = makeId();
      advancements.push({ id: ind, tab: tabId, title: "4. Industrial", frame: "goal", icon: "🏭", x: 2, y: 1, parent: me, mod: techMods[1].id, modName: techMods[1].name, description: "Set up processing", guide: ["Build Latex processor"], reward: "1x Processor" });
    }
    
    const quantum = makeId();
    advancements.push({ id: quantum, tab: tabId, title: "5. Quantum", frame: "challenge", icon: "🌀", x: 3, y: 0, parent: auto, mod: techMods[0].id, modName: techMods[0].name, description: "Build Quantum Link", guide: ["Power Quantum Ring"], reward: "1x QNB" });
  }

  // Tab 3: Storage & Logistics
  if (storageMods.length > 0) {
    const tabId = "tab_storage";
    tabs.push({ id: tabId, title: "Storage & Logistics", icon: "📦", mod: "Sophisticated Series", bg: "cobble" });
    
    const root = makeId();
    advancements.push({ id: root, tab: tabId, title: "1. Backpack", frame: "task", icon: "🎒", x: 0, y: 0, parent: null, mod: storageMods[0].id, modName: storageMods[0].name, description: "Craft Leather Backpack", guide: ["Add upgrade slots"], reward: "1x Backpack" });
    
    const chest = makeId();
    advancements.push({ id: chest, tab: tabId, title: "2. Smart Chest", frame: "goal", icon: "📦", x: 1, y: 0, parent: root, mod: storageMods[0].id, modName: storageMods[0].name, description: "Build Diamond Chest", guide: ["Insert sorting upgrade"], reward: "1x Upgrade" });
    
    const mega = makeId();
    advancements.push({ id: mega, tab: tabId, title: "3. Mega Storage", frame: "challenge", icon: "🏆", x: 2, y: 0, parent: chest, mod: storageMods[0].id, modName: storageMods[0].name, description: "Max all storage tiers", guide: ["Netherite tier chests"], reward: "Max Crown" });
  }

  // Tab 4: Mining & Quarries
  if (miningMods.length > 0) {
    const tabId = "tab_mining";
    tabs.push({ id: tabId, title: "Mining Operations", icon: "⛏️", mod: "Quarry Systems", bg: "deepslate" });
    
    const root = makeId();
    advancements.push({ id: root, tab: tabId, title: "1. Basic Mine", frame: "task", icon: "⛏️", x: 0, y: 0, parent: null, mod: miningMods[0].id, modName: miningMods[0].name, description: "Place Simple Quarry", guide: ["Power with RF/FE"], reward: "1x Quarry" });
    
    const deep = makeId();
    advancements.push({ id: deep, tab: tabId, title: "2. Deep Mining", frame: "goal", icon: "💎", x: 1, y: 0, parent: root, mod: miningMods[0].id, modName: miningMods[0].name, description: "Mine below Y=-32", guide: ["Upgrade drill head"], reward: "Diamond Drill" });
    
    const void_ = makeId();
    advancements.push({ id: void_, tab: tabId, title: "3. Void Mine", frame: "challenge", icon: "🕳️", x: 2, y: 0, parent: deep, mod: miningMods[0].id, modName: miningMods[0].name, description: "Automate void mining", guide: ["Max speed upgrades"], reward: "Void Crown" });
  }

  // Ensure at least one tab exists
  if (tabs.length === 0) {
    tabs.push({ id: "tab_general", title: "Modpack Progress", icon: "📋", mod: "General", bg: "stone" });
    const root = makeId();
    advancements.push({ id: root, tab: "tab_general", title: "1. Getting Started", frame: "task", icon: "📋", x: 0, y: 0, parent: null, mod: "general", modName: "Modpack", description: "Begin your adventure", guide: ["Explore your mods"], reward: "Welcome!" });
  }

  return {
    modpackTitle: `Modpack (${recognizedMods.length} Mods Detected)`,
    recognizedMods,
    tabs,
    advancements
  };
}

app.listen(PORT, () => {
  console.log(`AdvancementForge Backend running on http://localhost:${PORT}`);
});
