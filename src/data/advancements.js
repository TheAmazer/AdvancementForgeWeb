export const RECOGNIZED_CREATE_MODS = [
  {
    id: "create_base",
    name: "Create (Base Mod)",
    version: "6.0.9",
    filename: "create-1.21.1-6.0.9.jar",
    color: "#e67e22",
    icon: "Cog",
    description: "Core kinetic energy, mechanical logistics, brass machinery, and train automation system."
  },
  {
    id: "create_connected",
    name: "Create: Connected",
    version: "1.1.13",
    filename: "create_connected-1.1.13-mc1.21.1.jar",
    color: "#3498db",
    icon: "GitFork",
    description: "Expands Create with inverted gearboxes, centrifugal clutches, parallel gearboxes, and brass switches."
  },
  {
    id: "create_addition",
    name: "Create Crafts & Additions",
    version: "1.5.10",
    filename: "createaddition-1.5.10.jar",
    color: "#f1c40f",
    icon: "Zap",
    description: "Bridges kinetic rotation with electrical energy (Forge Energy/FE), accumulators, rolling mills, and electric motors."
  },
  {
    id: "create_diesel",
    name: "Create Diesel Generators",
    version: "1.3.11",
    filename: "createdieselgenerators-1.21.1-1.3.11.jar",
    color: "#16a085",
    icon: "Fuel",
    description: "Adds crude oil pumpjacks, distillation towers, modular diesel engines, biodiesel, and turbochargers."
  },
  {
    id: "create_enchantment",
    name: "Create: Enchantment Industry",
    version: "2.3.0",
    filename: "create-enchantment-industry-2.3.0.jar",
    color: "#9b59b6",
    icon: "BookOpen",
    description: "Liquid experience piping, auto-disenchanting, printers for copying enchanted books, and hyper-enchanting."
  },
  {
    id: "create_nuclear",
    name: "Create Nuclear",
    version: "1.3.2-beta.3",
    filename: "createnuclear-1.3.2-beta.3-neoforge.jar",
    color: "#e74c3c",
    icon: "Radioactive",
    description: "Uranium processing, nuclear fuel rods, multi-block reactor cores, cooling loops, and high-output steam turbines."
  },
  {
    id: "create_ore_excavation",
    name: "Create Ore Excavation",
    version: "1.6.8",
    filename: "createoreexcavation-1.21.1-1.6.8.jar",
    color: "#8e44ad",
    icon: "Pickaxe",
    description: "Bedrock mineral vein scanning, heavy drilling rigs, drilling mud injection, and automated infinite raw ore extraction."
  },
  {
    id: "create_stuff",
    name: "Create Stuff & Additions",
    version: "2.1.0e",
    filename: "create-stuff-additions1.21.1_v2.1.0e.jar",
    color: "#2ecc71",
    icon: "Shield",
    description: "Brass exosuits, portable mechanical drills, grappling whisks, shadow steel gear, and utility exoskeletons."
  },
  {
    id: "create_dragons",
    name: "Create: Dragons Plus",
    version: "1.8.7",
    filename: "create-dragons-plus-1.8.7.jar",
    color: "#d35400",
    icon: "Flame",
    description: "Integrates dragon scale mechanics, dragon blood kinetic transmutation, and mythical high-rpm power generation."
  }
];

export const ALL_INSTALLED_MODS = [
  ...RECOGNIZED_CREATE_MODS,
  { name: "Applied Energistics 2", filename: "appliedenergistics2-19.2.17.jar", category: "Tech / Storage" },
  { name: "Architectury API", filename: "architectury-13.0.8-neoforge.jar", category: "Library" },
  { name: "Coal Quarry", filename: "coalquarry-1.21.1-1.4.0.jar", category: "Mining" },
  { name: "Effortless Building", filename: "effortlessbuilding-1.21.1-3.10-all.jar", category: "Building" },
  { name: "FerriteCore", filename: "ferritecore-7.0.3-neoforge.jar", category: "Optimization" },
  { name: "FTB Library", filename: "ftb-library-neoforge-2101.1.31.jar", category: "Library" },
  { name: "FTB Ultimine", filename: "ftb-ultimine-neoforge-2101.1.13.jar", category: "Utility" },
  { name: "GeckoLib", filename: "geckolib-neoforge-1.21.1-4.8.4.jar", category: "Library" },
  { name: "GuideMe", filename: "guideme-21.1.15.jar", category: "Documentation" },
  { name: "Industrial Foregoing", filename: "industrialforegoing-1.21-3.6.38.jar", category: "Tech" },
  { name: "Inventory Management Deluxe", filename: "Inventory Management Deluxe-1.21.1-Neo...", category: "QoL" },
  { name: "Iris Shaders", filename: "iris-neoforge-1.8.12+mc1.21.1.jar", category: "Graphics" },
  { name: "Just Enough Items (JEI)", filename: "jei-1.21.1-neoforge-19.27.0.340.jar", category: "Recipe Viewer" },
  { name: "JustZoom", filename: "justzoom_neoforge_2.1.0_MC_1.21.1.jar", category: "Utility" },
  { name: "Konkrete", filename: "konkrete_neoforge_1.9.9_MC_1.21.jar", category: "Library" },
  { name: "ModernFix", filename: "modernfix-neoforge-5.26.1+mc1.21.1.jar", category: "Optimization" },
  { name: "Quarry Digger", filename: "quarrydigger-1.21.1-1.0.5.jar", category: "Mining" },
  { name: "Simple Quarries", filename: "simplequarries-1.0.4-neoforge-1.21.1-21....", category: "Mining" },
  { name: "Sodium", filename: "sodium-neoforge-0.6.13+mc1.21.1.jar", category: "Performance" },
  { name: "Sophisticated Backpacks", filename: "sophisticatedbackpacks-1.21-3.20.26.115...", category: "Storage" },
  { name: "Sophisticated Core", filename: "sophisticatedcore-1.21-0.7.13.797.jar", category: "Library" },
  { name: "Sophisticated Storage", filename: "sophisticatedstorage-1.21-0.10.55.953.jar", category: "Storage" },
  { name: "Titanium", filename: "titanium-1.21-4.0.42.jar", category: "Library" },
  { name: "Xaero's World Map", filename: "xaeroworldmap-neoforge-1.21.1-40.11.j...", category: "Map / Navigation" }
];

export const ADVANCEMENT_TABS = [
  { id: "kinetics", title: "Kinetic Foundation", icon: "⚙️", mod: "Create Base & Connected", bg: "stone" },
  { id: "logistics", title: "Locomotion & Steam", icon: "🚂", mod: "Create Base", bg: "cobble" },
  { id: "electrification", title: "Electrification", icon: "⚡", mod: "Create Crafts & Additions", bg: "darkstone" },
  { id: "diesel", title: "Petroleum & Diesel", icon: "🛢️", mod: "Create Diesel Generators", bg: "coal" },
  { id: "enchanting", title: "Arcane Industry", icon: "✨", mod: "Create Enchantment Industry", bg: "amethyst" },
  { id: "nuclear", title: "Atomic Power", icon: "☢️", mod: "Create Nuclear", bg: "deepslate" },
  { id: "excavation", title: "Deep Earth Mining", icon: "⛏️", mod: "Create Ore Excavation", bg: "bedrock" },
  { id: "dragons_stuff", title: "Gadgets & Dragons", icon: "🐉", mod: "Stuff & Additions + Dragons", bg: "dragon" }
];

export const ADVANCEMENTS = [
  // ================= TAB 1: KINETIC FOUNDATION =================
  {
    id: "rotation_era",
    tab: "kinetics",
    title: "1. Turning",
    frame: "task",
    icon: "⚙️",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_base",
    modName: "Create Base",
    tagline: "Harness rotational force",
    description: "Craft a Water Wheel, Large Water Wheel, or Hand Crank to generate Rotational Units (SU).",
    guide: [
      "• Place a Water Wheel in open water or flow water against its paddles.",
      "• Attach Shafts to transmit rotation forward."
    ],
    reward: "4x Shaft & 1x Water Wheel"
  },
  {
    id: "shafts_cogs",
    tab: "kinetics",
    title: "2. Shafts & Cogs",
    frame: "task",
    icon: "🔩",
    x: 1,
    y: 0,
    parent: "rotation_era",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Connect transmission lines",
    description: "Craft Shafts and Cogwheels to extend and step up rotational speed.",
    guide: [
      "• Connect a Large Cogwheel to a Small Cogwheel to double output RPM!"
    ],
    reward: "8x Shaft & 4x Small Cogwheel"
  },
  {
    id: "gearboxes",
    tab: "kinetics",
    title: "3. Gearbox",
    frame: "task",
    icon: "📦",
    x: 2,
    y: -1,
    parent: "shafts_cogs",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Turn shaft angles 90°",
    description: "Craft a Gearbox to turn shaft angles 90 degrees around walls and floors.",
    guide: [
      "• Place a Gearbox where two perpendicular shafts meet."
    ],
    reward: "2x Gearbox & 2x Vertical Gearbox"
  },
  {
    id: "andesite_alloy",
    tab: "kinetics",
    title: "4. Andesite Alloy",
    frame: "task",
    icon: "🪨",
    x: 2,
    y: 1,
    parent: "shafts_cogs",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Stone and metal alloy",
    description: "Combine Andesite with Iron or Zinc Nuggets to craft Andesite Alloy.",
    guide: [
      "• Combine 2x Andesite + 2x Nuggets to craft 2x Andesite Alloy."
    ],
    reward: "16x Andesite Alloy"
  },
  {
    id: "andesite_casing",
    tab: "kinetics",
    title: "5. Andesite Casing",
    frame: "task",
    icon: "🔲",
    x: 3,
    y: 1,
    parent: "andesite_alloy",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Encase machinery",
    description: "Right-click Stripped Wood with Andesite Alloy to make Andesite Casings.",
    guide: [
      "• Strip a Log with an Axe, then right-click with Andesite Alloy!"
    ],
    reward: "8x Andesite Casing"
  },
  {
    id: "mechanical_press",
    tab: "kinetics",
    title: "6. Pressing",
    frame: "task",
    icon: "🔨",
    x: 4,
    y: 0,
    parent: "andesite_casing",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Stamp metal sheets",
    description: "Craft a Mechanical Press, mount it above a Depot, and press ingots into sheets.",
    guide: [
      "• Mount a Mechanical Press 1 block above a Depot and supply rotation."
    ],
    reward: "1x Mechanical Press & 1x Depot"
  },
  {
    id: "chute_belts",
    tab: "kinetics",
    title: "7. Belts",
    frame: "task",
    icon: "🎞️",
    x: 5,
    y: -1,
    parent: "mechanical_press",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Conveyor transport",
    description: "Craft Mechanical Belts from Dried Kelp Sheets to transport items horizontally.",
    guide: [
      "• Right-click two parallel Shafts with a Mechanical Belt to connect them!"
    ],
    reward: "16x Mechanical Belt & 4x Chute"
  },
  {
    id: "rose_quartz",
    tab: "kinetics",
    title: "8. Rose Quartz",
    frame: "task",
    icon: "💎",
    x: 5,
    y: 0,
    parent: "mechanical_press",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Polish with sandpaper",
    description: "Craft Rose Quartz and scrub it clean with Sandpaper.",
    guide: [
      "• Hold Sandpaper in main hand and Rose Quartz in off-hand to polish!"
    ],
    reward: "4x Polished Rose Quartz & 1x Sandpaper"
  },
  {
    id: "blaze_burner",
    tab: "kinetics",
    title: "9. Blaze Burner",
    frame: "goal",
    icon: "🔥",
    x: 5,
    y: 1,
    parent: "mechanical_press",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Capture Blaze heat",
    description: "Craft an Empty Blaze Burner and capture a Nether Blaze inside.",
    guide: [
      "• Right-click a Blaze in the Nether with an Empty Blaze Burner!"
    ],
    reward: "1x Blaze Burner & 16x Coal"
  },
  {
    id: "mechanical_mixer",
    tab: "kinetics",
    title: "10. Mixer",
    frame: "task",
    icon: "🥣",
    x: 6,
    y: 1,
    parent: "blaze_burner",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Alloy Brass in Basin",
    description: "Mount a Mechanical Mixer above a Basin over a heated Blaze Burner.",
    guide: [
      "• Drop 1x Copper + 1x Zinc into a heated Basin to mix 2x Brass!"
    ],
    reward: "8x Brass Ingot & 1x Basin"
  },
  {
    id: "electron_tube",
    tab: "kinetics",
    title: "11. Electron Tube",
    frame: "goal",
    icon: "🎙️",
    x: 6,
    y: 0,
    parent: "rose_quartz",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Assemble electronic tubes",
    description: "Combine Polished Rose Quartz with Redstone Torches.",
    guide: [
      "• Combine 1x Polished Rose Quartz + 1x Redstone Torch."
    ],
    reward: "8x Electron Tube"
  },
  {
    id: "brass_casing",
    tab: "kinetics",
    title: "12. Brass Casing",
    frame: "goal",
    icon: "⚙️",
    x: 7,
    y: 0,
    parent: "electron_tube",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Precision Brass Age",
    description: "Right-click Stripped Logs with Brass Ingots to form Brass Casings.",
    guide: [
      "• Right-click Stripped Logs with Brass Ingots!"
    ],
    reward: "8x Brass Casing"
  },
  {
    id: "speed_controller",
    tab: "kinetics",
    title: "13. Speed Control",
    frame: "goal",
    icon: "🏎️",
    x: 8,
    y: -1,
    parent: "brass_casing",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Dial RPM from 1 to 256",
    description: "Place a Rotation Speed Controller on a Large Cogwheel to dial output RPM.",
    guide: [
      "• Scroll mouse wheel on Speed Controller to set exact RPM!"
    ],
    reward: "1x Rotation Speed Controller"
  },
  {
    id: "mechanical_arm",
    tab: "kinetics",
    title: "14. Mechanical Arm",
    frame: "goal",
    icon: "🦾",
    x: 8,
    y: 1,
    parent: "brass_casing",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Robotic item transfer",
    description: "Build a Mechanical Arm and select input/output depots with right-click.",
    guide: [
      "• Select input and output targets, then supply rotational power!"
    ],
    reward: "2x Mechanical Arm & 4x Depot"
  },
  {
    id: "connected_utilities",
    tab: "kinetics",
    title: "15. Connected",
    frame: "task",
    icon: "🔀",
    x: 9,
    y: 0,
    parent: "brass_casing",
    mod: "create_connected",
    modName: "Create: Connected",
    tagline: "Compact utility gearboxes",
    description: "Craft Inverted Gearboxes and Centrifugal Clutches to manage stress networks.",
    guide: [
      "• Install Centrifugal Clutches to automatically disconnect stress!"
    ],
    reward: "2x Inverted Gearbox & 2x Centrifugal Clutch"
  },
  {
    id: "brass_switch_master",
    tab: "kinetics",
    title: "16. Logic Master",
    frame: "challenge",
    icon: "🎛️",
    x: 10,
    y: 0,
    parent: "connected_utilities",
    mod: "create_connected",
    modName: "Create: Connected",
    tagline: "Master kinetic circuits",
    description: "Wire Brass Switches and Shearers for automated factory circuit toggles.",
    guide: [
      "• Wire Brass Switches to Redstone Links for master control levers!"
    ],
    reward: "4x Brass Switch & 1x Netherite Ingot"
  },

  // ================= TAB 2: LOCOMOTION & STEAM =================
  {
    id: "boiler_builder",
    tab: "logistics",
    title: "1. Steam Boiler",
    frame: "task",
    icon: "♨️",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_base",
    modName: "Create Base",
    tagline: "Build Fluid Tank Boiler",
    description: "Stack copper Fluid Tanks vertically and attach Steam Engines.",
    guide: [
      "• Attach Steam Engines to Fluid Tanks and pipe water into the base!"
    ],
    reward: "1x Steam Engine & 4x Fluid Pipe"
  },
  {
    id: "water_pump",
    tab: "logistics",
    title: "2. Water Pump",
    frame: "task",
    icon: "💧",
    x: 1,
    y: 0,
    parent: "boiler_builder",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Hydraulic water supply",
    description: "Craft a Mechanical Pump and pipe continuous water into your boiler.",
    guide: [
      "• Submerge pipe intake in water and pump into boiler!"
    ],
    reward: "1x Mechanical Pump & 8x Fluid Pipe"
  },
  {
    id: "level9_boiler",
    tab: "logistics",
    title: "3. Max Boiler",
    frame: "goal",
    icon: "🏭",
    x: 2,
    y: 0,
    parent: "water_pump",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Level 18 Steam Boiler",
    description: "Heat a 3x3x5 Steam Boiler with 9 Superheated Blaze Burners for 294,912 SU!",
    guide: [
      "• Superheat 9 Blaze Burners with Blaze Cakes under a 3x3x5 tank!"
    ],
    reward: "4x Blaze Cake & 1x Nether Star"
  },
  {
    id: "railway_casing",
    tab: "logistics",
    title: "4. Track Casing",
    frame: "task",
    icon: "🛤️",
    x: 3,
    y: 0,
    parent: "level9_boiler",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Press track beds",
    description: "Press Smooth Stone Slabs with Iron Sheets to craft Railway Casings.",
    guide: [
      "• Press Smooth Stone Slabs + Iron Sheets on a Depot!"
    ],
    reward: "16x Railway Casing"
  },
  {
    id: "railway_tracks",
    tab: "logistics",
    title: "5. Railway Tracks",
    frame: "task",
    icon: "🛣️",
    x: 4,
    y: 0,
    parent: "railway_casing",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Smooth track laying",
    description: "Combine Railway Casings with Iron Sleeper Grids to craft Railway Tracks.",
    guide: [
      "• Right-click track placements to form smooth curves and slopes!"
    ],
    reward: "64x Railway Track"
  },
  {
    id: "train_station",
    tab: "logistics",
    title: "6. Train Station",
    frame: "task",
    icon: "🚉",
    x: 5,
    y: 0,
    parent: "railway_tracks",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Station marker",
    description: "Place a Train Station block directly beside Railway Tracks.",
    guide: [
      "• Right-click track edge to establish a Train Station!"
    ],
    reward: "1x Train Station"
  },
  {
    id: "locomotive_assembly",
    tab: "logistics",
    title: "7. Locomotive",
    frame: "goal",
    icon: "🚂",
    x: 6,
    y: 0,
    parent: "train_station",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Assemble train entity",
    description: "Build train cars with Bogeys, Controls, and Super Glue, then assemble!",
    guide: [
      "• Right-click Train Station and click 'Assemble Train'!"
    ],
    reward: "1x Train Controls & 1x Super Glue"
  },
  {
    id: "conductor_schedule",
    tab: "logistics",
    title: "8. Auto Train",
    frame: "challenge",
    icon: "🎩",
    x: 7,
    y: 0,
    parent: "locomotive_assembly",
    mod: "create_base",
    modName: "Create Base",
    tagline: "Automated routing",
    description: "Create a Train Schedule and give it to a driver to automate cargo routes!",
    guide: [
      "• Program station stop conditions inside a Train Schedule!"
    ],
    reward: "1x Brass Train Cap & 16x Railway Signal"
  },

  // ================= TAB 3: ELECTRIFICATION =================
  {
    id: "rolling_mill",
    tab: "electrification",
    title: "1. Rolling Mill",
    frame: "task",
    icon: "⚡",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Draw copper wire rods",
    description: "Roll Copper Ingots into Wire Rods in a Rolling Mill.",
    guide: [
      "• Drop Copper Ingots into a powered Rolling Mill!"
    ],
    reward: "1x Rolling Mill & 16x Copper Wire"
  },
  {
    id: "spool_cables",
    tab: "electrification",
    title: "2. Wire Cables",
    frame: "task",
    icon: "🧵",
    x: 1,
    y: 0,
    parent: "rolling_mill",
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Electrical cabling",
    description: "Craft Wire Connectors and Wire Spools to transmit FE energy.",
    guide: [
      "• Connect machines with Wire Connectors and Copper Spools!"
    ],
    reward: "4x Wire Connector & 1x Copper Wire Spool"
  },
  {
    id: "kinetic_dynamo",
    tab: "electrification",
    title: "3. Alternator",
    frame: "goal",
    icon: "🔌",
    x: 2,
    y: 0,
    parent: "spool_cables",
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Convert rotation to FE",
    description: "Spin an Alternator at high RPM to generate Forge Energy (FE).",
    guide: [
      "• Spin Alternator at high RPM to output FE electric power!"
    ],
    reward: "1x Alternator & 4x Energy Connector"
  },
  {
    id: "accumulator",
    tab: "electrification",
    title: "4. Accumulator",
    frame: "task",
    icon: "🔋",
    x: 3,
    y: 0,
    parent: "kinetic_dynamo",
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Grid energy storage",
    description: "Build Accumulator storage banks to buffer electrical power.",
    guide: [
      "• Stack Accumulator blocks into energy storage banks!"
    ],
    reward: "2x Accumulator"
  },
  {
    id: "electric_motor",
    tab: "electrification",
    title: "5. Electric Motor",
    frame: "goal",
    icon: "⚙️",
    x: 4,
    y: 0,
    parent: "accumulator",
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Electro-kinetic drive",
    description: "Wire FE power into an Electric Motor and set desired shaft output RPM.",
    guide: [
      "• Scroll-wheel motor dial to set output speed up to 256 RPM!"
    ],
    reward: "1x Electric Motor & 1x Energy Meter"
  },
  {
    id: "tesla_coil",
    tab: "electrification",
    title: "6. Tesla Coil",
    frame: "challenge",
    icon: "🌩️",
    x: 5,
    y: 0,
    parent: "electric_motor",
    mod: "create_addition",
    modName: "Create Crafts & Additions",
    tagline: "Wireless lightning arc",
    description: "Power a Tesla Coil with 10,000+ FE/t to electrocute hostiles wirelessly!",
    guide: [
      "• Power Tesla Coil with high voltage to zap hostile mobs!"
    ],
    reward: "1x Tesla Coil & 64x Gold Wire"
  },

  // ================= TAB 4: PETROLEUM & DIESEL =================
  {
    id: "oil_scanner",
    tab: "diesel",
    title: "1. Oil Scanner",
    frame: "task",
    icon: "🔍",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Scan underground oil",
    description: "Right-click across world chunks with Crude Oil Scanner to locate oil pockets.",
    guide: [
      "• Right-click with scanner to find crude oil reservoirs!"
    ],
    reward: "1x Crude Oil Scanner"
  },
  {
    id: "pumpjack_rig",
    tab: "diesel",
    title: "2. Pumpjack",
    frame: "task",
    icon: "🛢️",
    x: 1,
    y: 0,
    parent: "oil_scanner",
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Drill subterranean oil",
    description: "Construct a Pumpjack Derrick over an oil chunk and supply rotation.",
    guide: [
      "• Assemble Pumpjack over chunk center and input rotation!"
    ],
    reward: "1x Pumpjack Derrick & 8x Fluid Pipe"
  },
  {
    id: "distillation_tower",
    tab: "diesel",
    title: "3. Distillation",
    frame: "goal",
    icon: "🧪",
    x: 2,
    y: 0,
    parent: "pumpjack_rig",
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Fractional fuel refining",
    description: "Stack Distillation Controller and Tower blocks vertically over a Blaze Burner.",
    guide: [
      "• Heat tower base with Blaze Burner to separate fuel fractions!"
    ],
    reward: "1x Distillation Controller & 1x Bucket of Diesel"
  },
  {
    id: "biodiesel_basin",
    tab: "diesel",
    title: "4. Biodiesel",
    frame: "task",
    icon: "🌱",
    x: 3,
    y: 0,
    parent: "distillation_tower",
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Plant oil biofuel",
    description: "Mix Ethanol and Plant Oils in a Basin under a Mechanical Mixer.",
    guide: [
      "• Mix Ethanol + Plant Oil in Basin to craft Biodiesel!"
    ],
    reward: "1x Bucket of Biodiesel"
  },
  {
    id: "modular_diesel_engine",
    tab: "diesel",
    title: "5. Diesel Engine",
    frame: "goal",
    icon: "🏎️",
    x: 4,
    y: 0,
    parent: "biodiesel_basin",
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Heavy industrial torque",
    description: "Pipe Diesel or Biodiesel into Modular Diesel Engines for high torque output.",
    guide: [
      "• Pipe Diesel into engine blocks for high stress capacity!"
    ],
    reward: "2x Modular Diesel Engine"
  },
  {
    id: "turbocharged_beast",
    tab: "diesel",
    title: "6. Turbocharger",
    frame: "challenge",
    icon: "💨",
    x: 5,
    y: 0,
    parent: "modular_diesel_engine",
    mod: "create_diesel",
    modName: "Create Diesel Generators",
    tagline: "Supercharged maximum RPM",
    description: "Equip a Large Diesel Engine with Turbochargers and Gasoline fuel.",
    guide: [
      "• Supercharge diesel engines with turbochargers and gasoline!"
    ],
    reward: "2x Turbocharger & 16x Netherite Sheets"
  },

  // ================= TAB 5: ARCANE INDUSTRY =================
  {
    id: "xp_drain",
    tab: "enchanting",
    title: "1. XP Drain",
    frame: "task",
    icon: "✨",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_enchantment",
    modName: "Create: Enchantment Industry",
    tagline: "Drain player XP levels",
    description: "Stand on an Experience Drain to convert player XP levels into Liquid XP.",
    guide: [
      "• Stand on Experience Drain to fill fluid pipes with liquid XP!"
    ],
    reward: "1x Experience Drain & 1x Fluid Tank"
  },
  {
    id: "spout_collection",
    tab: "enchanting",
    title: "2. XP Spout",
    frame: "task",
    icon: "🩸",
    x: 1,
    y: 0,
    parent: "xp_drain",
    mod: "create_enchantment",
    modName: "Create: Enchantment Industry",
    tagline: "Mob XP harvesting",
    description: "Set up an Enchanted Spout above mob grinding zones to extract liquid XP.",
    guide: [
      "• Collect liquid XP from mob grinders automatically!"
    ],
    reward: "1x Enchanted Spout"
  },
  {
    id: "disenchanter",
    tab: "enchanting",
    title: "3. Disenchanter",
    frame: "task",
    icon: "📖",
    x: 2,
    y: 0,
    parent: "spout_collection",
    mod: "create_enchantment",
    modName: "Create: Enchantment Industry",
    tagline: "Strip enchants from loot",
    description: "Run enchanted armor, weapons, or books through a Disenchanter.",
    guide: [
      "• Pass enchanted gear through Disenchanter to reclaim liquid XP!"
    ],
    reward: "1x Disenchanter & 4x Belt Connector"
  },
  {
    id: "printer_press",
    tab: "enchanting",
    title: "4. Book Printer",
    frame: "goal",
    icon: "🖨️",
    x: 3,
    y: 0,
    parent: "disenchanter",
    mod: "create_enchantment",
    modName: "Create: Enchantment Industry",
    tagline: "Duplicate enchanted books",
    description: "Pipe Liquid Experience and Ink into a Mechanical Printer to copy books.",
    guide: [
      "• Supply Liquid XP + Ink to Mechanical Printer to copy books!"
    ],
    reward: "1x Mechanical Printer & 16x Book"
  },
  {
    id: "hyper_enchanting",
    tab: "enchanting",
    title: "5. Hyper-Enchant",
    frame: "challenge",
    icon: "🌌",
    x: 4,
    y: 0,
    parent: "printer_press",
    mod: "create_enchantment",
    modName: "Create: Enchantment Industry",
    tagline: "Fortune V & Sharpness VI",
    description: "Superheat a Blaze Burner with Hyper-Experience to print tier-beyond-max books!",
    guide: [
      "• Mix Liquid XP + Nether Star dust to print level VI books!"
    ],
    reward: "1x Hyper-Enchanted Book [Fortune V] & 1x Nether Star"
  },

  // ================= TAB 6: ATOMIC POWER =================
  {
    id: "uranium_mining",
    tab: "nuclear",
    title: "1. Uranium Mining",
    frame: "task",
    icon: "☢️",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_nuclear",
    modName: "Create Nuclear",
    tagline: "Mine fissile uranium ore",
    description: "Mine Uranium Ore in deep underground caves with a Diamond Pickaxe.",
    guide: [
      "• Mine Uranium Ore at deep Y levels underground."
    ],
    reward: "8x Raw Uranium"
  },
  {
    id: "crushing_wheels",
    tab: "nuclear",
    title: "2. Pellet Enrichment",
    frame: "task",
    icon: "⚙️",
    x: 1,
    y: 0,
    parent: "uranium_mining",
    mod: "create_nuclear",
    modName: "Create Nuclear",
    tagline: "Crush and wash uranium",
    description: "Crush Uranium Ore in Crushing Wheels and wash in a Basin to yield pellets.",
    guide: [
      "• Crush and wash uranium ore into U-235 pellets!"
    ],
    reward: "8x Uranium Pellet & 2x Lead Sheet"
  },
  {
    id: "reactor_fuel_rod",
    tab: "nuclear",
    title: "3. Fuel Rods",
    frame: "goal",
    icon: "🔋",
    x: 2,
    y: 0,
    parent: "crushing_wheels",
    mod: "create_nuclear",
    modName: "Create Nuclear",
    tagline: "Lead fuel assemblies",
    description: "Combine Uranium Pellets with Lead Casings to forge Reactor Fuel Rods.",
    guide: [
      "• Encase Uranium Pellets in Lead Casings!"
    ],
    reward: "4x Reactor Fuel Rod & 4x Lead Casing"
  },
  {
    id: "reactor_core",
    tab: "nuclear",
    title: "4. Reactor Core",
    frame: "goal",
    icon: "⚛️",
    x: 3,
    y: 0,
    parent: "reactor_fuel_rod",
    mod: "create_nuclear",
    modName: "Create Nuclear",
    tagline: "Critical mass vessel",
    description: "Construct a multi-block Reactor Chamber with coolant loops and control rods.",
    guide: [
      "• Build 3x3x3 Reactor Vessel and pipe water coolant!"
    ],
    reward: "1x Reactor Controller & 1x Radiation Suit Set"
  },
  {
    id: "zero_fallout",
    tab: "nuclear",
    title: "5. Zero Fallout",
    frame: "challenge",
    icon: "⚡",
    x: 4,
    y: 0,
    parent: "reactor_core",
    mod: "create_nuclear",
    modName: "Create Nuclear",
    tagline: "500,000+ SU safe power",
    description: "Feed superheated nuclear steam into Steam Turbines with 0% meltdown risk!",
    guide: [
      "• Direct nuclear steam into Steam Turbines safely!"
    ],
    reward: "1x Supercharged Atomic Turbine & 4x Netherite Ingot"
  },

  // ================= TAB 7: DEEP EARTH MINING =================
  {
    id: "vein_scanner",
    tab: "excavation",
    title: "1. Vein Scanner",
    frame: "task",
    icon: "🔍",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_ore_excavation",
    modName: "Create Ore Excavation",
    tagline: "Scan bedrock veins",
    description: "Craft an Ore Vein Scanner to discover hidden bedrock mineral veins.",
    guide: [
      "• Right-click to scan for infinite bedrock veins!"
    ],
    reward: "1x Ore Vein Scanner"
  },
  {
    id: "drilling_rig",
    tab: "excavation",
    title: "2. Drilling Rig",
    frame: "goal",
    icon: "⛏️",
    x: 1,
    y: 0,
    parent: "vein_scanner",
    mod: "create_ore_excavation",
    modName: "Create Ore Excavation",
    tagline: "Bore to bedrock",
    description: "Erect a Drilling Rig structure over an identified vein and attach a Drill Head.",
    guide: [
      "• Assemble Drilling Rig over bedrock vein and spin with rotation!"
    ],
    reward: "1x Diamond Drill Head & 1x Drilling Rig"
  },
  {
    id: "drilling_mud",
    tab: "excavation",
    title: "3. Mud Injection",
    frame: "task",
    icon: "💧",
    x: 2,
    y: 0,
    parent: "drilling_rig",
    mod: "create_ore_excavation",
    modName: "Create Ore Excavation",
    tagline: "Inject drilling mud",
    description: "Mix Clay, Water, and Lava into Heavy Drilling Mud and pipe into the rig.",
    guide: [
      "• Pipe Drilling Mud into rig to double ore extraction speed!"
    ],
    reward: "1x Bucket of Drilling Mud & 8x Fluid Pipe"
  },
  {
    id: "infinite_vein_master",
    tab: "excavation",
    title: "4. Infinite Vein",
    frame: "challenge",
    icon: "💎",
    x: 3,
    y: 0,
    parent: "drilling_mud",
    mod: "create_ore_excavation",
    modName: "Create Ore Excavation",
    tagline: "10,000+ bedrock ores",
    description: "Automate continuous bedrock extraction on a Diamond/Ancient Debris vein!",
    guide: [
      "• Connect Drilling Rig outputs directly into Crushing Wheels!"
    ],
    reward: "1x Bedrock Drill Bit & 8x Diamond Block"
  },

  // ================= TAB 8: GADGETS & DRAGONS =================
  {
    id: "andesite_armor",
    tab: "dragons_stuff",
    title: "1. Andesite Armor",
    frame: "task",
    icon: "🛡️",
    x: 0,
    y: 0,
    parent: null,
    mod: "create_stuff",
    modName: "Create Stuff & Additions",
    tagline: "Mechanical suit",
    description: "Combine Andesite Alloys with Leather to forge utility Andesite Armor.",
    guide: [
      "• Craft Andesite Armor for early damage reduction!"
    ],
    reward: "1x Andesite Chestplate"
  },
  {
    id: "brass_exosuit",
    tab: "dragons_stuff",
    title: "2. Brass Exosuit",
    frame: "goal",
    icon: "🦿",
    x: 1,
    y: 0,
    parent: "andesite_armor",
    mod: "create_stuff",
    modName: "Create Stuff & Additions",
    tagline: "Steam Jetpack suit",
    description: "Craft Brass Armor with Backtanks and Jetpack thrusters for flight mobility.",
    guide: [
      "• Press Brass Sheets into Exo-Suit pieces and charge your Backtank!"
    ],
    reward: "1x Brass Jetpack & 1x Backtank"
  },
  {
    id: "grappling_whisk",
    tab: "dragons_stuff",
    title: "3. Grapple Whisk",
    frame: "task",
    icon: "🪝",
    x: 2,
    y: 0,
    parent: "brass_exosuit",
    mod: "create_stuff",
    modName: "Create Stuff & Additions",
    tagline: "High speed grappling",
    description: "Craft a Grappling Whisk and Portable Brass Drill for rapid movement.",
    guide: [
      "• Right-click distant walls with Grappling Whisk to pull yourself!"
    ],
    reward: "1x Grappling Whisk & 1x Portable Brass Drill"
  },
  {
    id: "dragon_scale",
    tab: "dragons_stuff",
    title: "4. Dragon Scale",
    frame: "task",
    icon: "🐉",
    x: 3,
    y: 0,
    parent: "grappling_whisk",
    mod: "create_dragons",
    modName: "Create: Dragons Plus",
    tagline: "Scale transmutation",
    description: "Mix Dragon Scales with Liquid Nether Star to forge Draconic Components.",
    guide: [
      "• Mix Dragon Scales + Nether Star dust in a heated Basin!"
    ],
    reward: "4x Dragon Scale Casing"
  },
  {
    id: "dragon_dynamo",
    tab: "dragons_stuff",
    title: "5. Dragon Dynamo",
    frame: "goal",
    icon: "🐲",
    x: 4,
    y: 0,
    parent: "dragon_scale",
    mod: "create_dragons",
    modName: "Create: Dragons Plus",
    tagline: "Infinite 524,288 SU",
    description: "Construct a Dragon-powered Kinetic Generator yielding infinite un-stalling power!",
    guide: [
      "• Feed Dragon Essence fluid into Dragon Kinetic Core for infinite 256 RPM!"
    ],
    reward: "1x Dragon Kinetic Core"
  },
  {
    id: "apex_engineer",
    tab: "dragons_stuff",
    title: "6. Apex Architect",
    frame: "challenge",
    icon: "👑",
    x: 5,
    y: 0,
    parent: "dragon_dynamo",
    mod: "create_dragons",
    modName: "Create & Addons Master",
    tagline: "Master of all Create Addons",
    description: "Achieve total mastery across Create and all installed addons!",
    guide: [
      "• Complete all advancement goals across every single tab in this web app!"
    ],
    reward: "1x Golden Engineer Crown & Ultimate Glory!"
  }
];
