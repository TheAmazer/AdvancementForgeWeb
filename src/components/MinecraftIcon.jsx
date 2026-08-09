import React from 'react';

// Crisp pixel art SVGs for Minecraft & Create Mod items
const ICON_SPRITES = {
  // --- Create Base & Machinery ---
  water_wheel: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="5" y="1" width="6" height="14" fill="#6d4c41" />
      <rect x="1" y="5" width="14" height="6" fill="#6d4c41" />
      <rect x="6" y="2" width="4" height="12" fill="#8d6e63" />
      <rect x="2" y="6" width="12" height="4" fill="#8d6e63" />
      <rect x="6" y="6" width="4" height="4" fill="#d7ccc8" />
      <rect x="7" y="7" width="2" height="2" fill="#4e342e" />
    </svg>
  ),
  shaft_cog: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#8d6e63" />
      <rect x="6" y="0" width="4" height="16" fill="#5d4037" />
      <rect x="0" y="6" width="16" height="4" fill="#5d4037" />
      <rect x="4" y="4" width="8" height="8" fill="#d7ccc8" />
      <rect x="6" y="6" width="4" height="4" fill="#757575" />
      <rect x="7" y="7" width="2" height="2" fill="#424242" />
    </svg>
  ),
  gearbox: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="1" y="1" width="14" height="14" fill="#616161" />
      <rect x="2" y="2" width="12" height="12" fill="#8d6e63" />
      <rect x="4" y="4" width="8" height="8" fill="#424242" />
      <rect x="6" y="6" width="4" height="4" fill="#ffb74d" />
    </svg>
  ),
  andesite_alloy: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="3" y="4" width="10" height="8" fill="#757575" />
      <rect x="4" y="5" width="8" height="6" fill="#9e9e9e" />
      <rect x="5" y="6" width="3" height="3" fill="#eeeeee" />
      <rect x="9" y="7" width="2" height="2" fill="#424242" />
    </svg>
  ),
  andesite_casing: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="1" y="1" width="14" height="14" fill="#757575" />
      <rect x="3" y="3" width="10" height="10" fill="#5d4037" />
      <rect x="5" y="5" width="6" height="6" fill="#8d6e63" />
      <rect x="7" y="7" width="2" height="2" fill="#424242" />
    </svg>
  ),
  mechanical_press: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="3" y="0" width="10" height="4" fill="#757575" />
      <rect x="6" y="4" width="4" height="6" fill="#424242" />
      <rect x="2" y="10" width="12" height="5" fill="#e67e22" />
      <rect x="4" y="11" width="8" height="3" fill="#ffb74d" />
    </svg>
  ),
  mechanical_belt: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="1" y="6" width="14" height="4" fill="#212121" />
      <rect x="2" y="7" width="12" height="2" fill="#424242" />
      <rect x="2" y="5" width="3" height="6" fill="#616161" />
      <rect x="11" y="5" width="3" height="6" fill="#616161" />
    </svg>
  ),
  rose_quartz: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <polygon points="8,1 14,7 8,15 2,7" fill="#ec407a" />
      <polygon points="8,3 12,7 8,13 4,7" fill="#f48fb1" />
      <rect x="7" y="5" width="2" height="4" fill="#ffffff" />
    </svg>
  ),
  blaze_burner: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="4" width="12" height="11" fill="#424242" />
      <rect x="4" y="6" width="8" height="7" fill="#ff6f00" />
      <rect x="6" y="7" width="4" height="5" fill="#ffca28" />
      <rect x="7" y="8" width="2" height="2" fill="#ffffff" />
      <rect x="3" y="1" width="10" height="3" fill="#616161" />
    </svg>
  ),
  mechanical_mixer: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="4" y="1" width="8" height="4" fill="#ffb74d" />
      <rect x="7" y="5" width="2" height="7" fill="#757575" />
      <polygon points="5,12 11,12 13,15 3,15" fill="#e67e22" />
    </svg>
  ),
  electron_tube: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="5" y="2" width="6" height="9" fill="#e0f7fa" opacity="0.8" />
      <rect x="7" y="4" width="2" height="5" fill="#ff1744" />
      <rect x="4" y="11" width="8" height="3" fill="#ffb74d" />
    </svg>
  ),
  brass_casing: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="1" y="1" width="14" height="14" fill="#ffb74d" />
      <rect x="3" y="3" width="10" height="10" fill="#5d4037" />
      <rect x="5" y="5" width="6" height="6" fill="#ffe082" />
      <rect x="7" y="7" width="2" height="2" fill="#e67e22" />
    </svg>
  ),
  speed_controller: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#ffb74d" />
      <circle cx="8" cy="8" r="4" fill="#212121" />
      <line x1="8" y1="8" x2="10" y2="6" stroke="#00e676" strokeWidth="2" />
    </svg>
  ),
  mechanical_arm: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="4" y="12" width="8" height="3" fill="#ffb74d" />
      <rect x="7" y="5" width="2" height="7" fill="#757575" />
      <rect x="4" y="3" width="7" height="2" fill="#ffb74d" />
      <rect x="2" y="1" width="3" height="3" fill="#e67e22" />
    </svg>
  ),

  // --- Locomotion & Steam ---
  steam_engine: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="4" y="2" width="8" height="12" fill="#d35400" />
      <rect x="6" y="0" width="4" height="3" fill="#757575" />
      <rect x="2" y="11" width="12" height="4" fill="#ffb74d" />
    </svg>
  ),
  train_station: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="1" y="8" width="14" height="2" fill="#757575" />
      <rect x="3" y="6" width="2" height="6" fill="#5d4037" />
      <rect x="11" y="6" width="2" height="6" fill="#5d4037" />
      <rect x="4" y="2" width="8" height="6" fill="#c0392b" />
    </svg>
  ),

  // --- Electrification ---
  rolling_mill: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#424242" />
      <circle cx="8" cy="5" r="3" fill="#b0bec5" />
      <circle cx="8" cy="11" r="3" fill="#b0bec5" />
    </svg>
  ),
  alternator: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="3" width="12" height="10" fill="#f1c40f" />
      <rect x="4" y="1" width="8" height="2" fill="#e67e22" />
      <polygon points="8,4 5,9 8,9 7,12 11,7 8,7" fill="#212121" />
    </svg>
  ),
  electric_motor: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="4" width="12" height="8" fill="#3498db" />
      <rect x="6" y="1" width="4" height="3" fill="#757575" />
      <polygon points="8,5 6,9 8,9 8,11" fill="#f1c40f" />
    </svg>
  ),

  // --- Petroleum & Diesel ---
  pumpjack: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <polygon points="8,1 14,14 2,14" fill="#37474f" />
      <rect x="6" y="4" width="4" height="2" fill="#16a085" />
      <line x1="2" y1="6" x2="14" y2="4" stroke="#e67e22" strokeWidth="2" />
    </svg>
  ),
  distillation: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="4" y="1" width="8" height="14" fill="#78909c" />
      <rect x="5" y="3" width="6" height="2" fill="#37474f" />
      <rect x="5" y="7" width="6" height="2" fill="#37474f" />
      <rect x="5" y="11" width="6" height="2" fill="#37474f" />
    </svg>
  ),
  diesel_engine: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="3" width="12" height="10" fill="#263238" />
      <rect x="4" y="5" width="8" height="6" fill="#16a085" />
      <rect x="6" y="1" width="4" height="3" fill="#cfd8dc" />
    </svg>
  ),

  // --- Arcane Industry ---
  xp_drain: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#8e44ad" />
      <rect x="4" y="4" width="8" height="8" fill="#111116" />
      <circle cx="8" cy="8" r="3" fill="#00e676" />
    </svg>
  ),
  enchanted_book: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="3" y="2" width="10" height="12" fill="#9c27b0" />
      <rect x="2" y="3" width="2" height="10" fill="#e040fb" />
      <rect x="6" y="5" width="4" height="6" fill="#ffd54f" />
    </svg>
  ),

  // --- Atomic Power ---
  fuel_rod: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="5" y="1" width="6" height="14" fill="#76ff03" />
      <rect x="4" y="0" width="8" height="2" fill="#37474f" />
      <rect x="4" y="14" width="8" height="2" fill="#37474f" />
    </svg>
  ),
  reactor: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#37474f" />
      <circle cx="8" cy="8" r="4" fill="#76ff03" />
      <polygon points="8,5 6,10 10,10" fill="#212121" />
    </svg>
  ),

  // --- Deep Earth Mining ---
  drilling_rig: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="3" y="1" width="10" height="8" fill="#5e35b1" />
      <polygon points="8,15 4,9 12,9" fill="#00e5ff" />
    </svg>
  ),

  // --- Gadgets & Dragons ---
  jetpack: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <rect x="2" y="3" width="4" height="9" fill="#ffb74d" />
      <rect x="10" y="3" width="4" height="9" fill="#ffb74d" />
      <rect x="5" y="5" width="6" height="5" fill="#424242" />
      <polygon points="4,12 2,15 5,12" fill="#ff3d00" />
      <polygon points="12,12 10,15 13,12" fill="#ff3d00" />
    </svg>
  ),
  dragon_core: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <polygon points="8,1 15,8 8,15 1,8" fill="#d35400" />
      <polygon points="8,4 12,8 8,12 4,8" fill="#ff9100" />
      <circle cx="8" cy="8" r="2" fill="#ffffff" />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 16 16" width="100%" height="100%" shapeRendering="crispEdges">
      <polygon points="2,4 5,8 8,2 11,8 14,4 13,13 3,13" fill="#ffd54f" />
      <circle cx="8" cy="4" r="1" fill="#e91e63" />
      <circle cx="3" cy="5" r="1" fill="#00e676" />
      <circle cx="13" cy="5" r="1" fill="#29b6f6" />
    </svg>
  )
};

// Fallback lookup by node ID or icon string
export function getMinecraftItemIcon(iconKey) {
  if (!iconKey) return null;
  const key = String(iconKey).toLowerCase();

  if (ICON_SPRITES[key]) return ICON_SPRITES[key];

  // Key phrase mapping
  if (key.includes("rotation") || key.includes("water")) return ICON_SPRITES.water_wheel;
  if (key.includes("shaft") || key.includes("cog")) return ICON_SPRITES.shaft_cog;
  if (key.includes("gearbox") || key.includes("connect")) return ICON_SPRITES.gearbox;
  if (key.includes("andesite") && key.includes("alloy")) return ICON_SPRITES.andesite_alloy;
  if (key.includes("casing") && key.includes("andesite")) return ICON_SPRITES.andesite_casing;
  if (key.includes("press")) return ICON_SPRITES.mechanical_press;
  if (key.includes("belt") || key.includes("chute")) return ICON_SPRITES.mechanical_belt;
  if (key.includes("blaze") || key.includes("fire")) return ICON_SPRITES.blaze_burner;
  if (key.includes("mixer") || key.includes("basin")) return ICON_SPRITES.mechanical_mixer;
  if (key.includes("rose") || key.includes("quartz")) return ICON_SPRITES.rose_quartz;
  if (key.includes("electron") || key.includes("tube")) return ICON_SPRITES.electron_tube;
  if (key.includes("brass") && key.includes("casing")) return ICON_SPRITES.brass_casing;
  if (key.includes("speed") || key.includes("controller")) return ICON_SPRITES.speed_controller;
  if (key.includes("arm")) return ICON_SPRITES.mechanical_arm;
  if (key.includes("boiler") || key.includes("steam")) return ICON_SPRITES.steam_engine;
  if (key.includes("station") || key.includes("train") || key.includes("track")) return ICON_SPRITES.train_station;
  if (key.includes("roll")) return ICON_SPRITES.rolling_mill;
  if (key.includes("dynamo") || key.includes("alternator")) return ICON_SPRITES.alternator;
  if (key.includes("motor")) return ICON_SPRITES.electric_motor;
  if (key.includes("pump") || key.includes("oil")) return ICON_SPRITES.pumpjack;
  if (key.includes("distill")) return ICON_SPRITES.distillation;
  if (key.includes("diesel") || key.includes("engine")) return ICON_SPRITES.diesel_engine;
  if (key.includes("drain") || key.includes("xp")) return ICON_SPRITES.xp_drain;
  if (key.includes("enchant") || key.includes("book")) return ICON_SPRITES.enchanted_book;
  if (key.includes("uranium") || key.includes("fuel")) return ICON_SPRITES.fuel_rod;
  if (key.includes("reactor")) return ICON_SPRITES.reactor;
  if (key.includes("drill") || key.includes("excavat")) return ICON_SPRITES.drilling_rig;
  if (key.includes("suit") || key.includes("jetpack") || key.includes("armor")) return ICON_SPRITES.jetpack;
  if (key.includes("dragon")) return ICON_SPRITES.dragon_core;
  if (key.includes("master") || key.includes("crown") || key.includes("apex")) return ICON_SPRITES.crown;

  return null;
}

export default function MinecraftIcon({ icon, id, size = 28, alt = "icon" }) {
  const sprite = getMinecraftItemIcon(id) || getMinecraftItemIcon(icon);

  if (sprite) {
    return (
      <div 
        className="mc-pixel-icon-box" 
        style={{ width: `${size}px`, height: `${size}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {sprite}
      </div>
    );
  }

  // Fallback to emoji / text icon
  return <span style={{ fontSize: `${size - 4}px` }}>{icon || "📦"}</span>;
}
