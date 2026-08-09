import React, { useState, useRef } from 'react';
import AdvancementNode from './AdvancementNode';
import { ZoomIn, ZoomOut, Maximize2, Move, Sparkles, Upload, FileText, Play } from 'lucide-react';

const GRID_SPACING_X = 160;
const GRID_SPACING_Y = 105;
const OFFSET_X = 80;
const OFFSET_Y = 100;
const NODE_SIZE = 48; // Node box width/height in px

export default function AdvancementTree({
  advancements = [],
  completedMap = {},
  selectedAdvancement,
  onSelectAdvancement,
  onToggleComplete,
  bgType = "stone",
  isCanvasBlank = false,
  onOpenUploadScreenshot,
  onOpenInputText,
  onLoadCreateDemo
}) {
  const containerRef = useRef(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map nodes to pixel coordinates
  const nodeCoords = {};
  advancements.forEach((node) => {
    nodeCoords[node.id] = {
      x: OFFSET_X + node.x * GRID_SPACING_X,
      y: OFFSET_Y + node.y * GRID_SPACING_Y,
    };
  });

  const isUnlocked = (node) => {
    if (!node.parent) return true;
    return !!completedMap[node.parent];
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.mc-node-wrapper') || e.target.closest('.mc-hud-controls') || e.target.closest('.blank-hero-card')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll wheel directly zooms in and out
  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const zoomFactor = 1.1;
    let newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    newScale = Math.min(Math.max(0.5, newScale), 2.2);
    setScale(newScale);
  };

  const resetView = () => {
    setPan({ x: 40, y: 40 });
    setScale(1);
  };

  return (
    <div
      ref={containerRef}
      className={`mc-gui-viewport bg-texture-${bgType} ${isDragging ? 'is-panning' : ''}`}
      style={{
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Floating Canvas Controls HUD */}
      {!isCanvasBlank && (
        <div className="mc-hud-controls">
          <button onClick={() => setScale((s) => Math.min(s + 0.15, 2.2))} title="Zoom In (+)">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setScale((s) => Math.max(s - 0.15, 0.5))} title="Zoom Out (-)">
            <ZoomOut size={16} />
          </button>
          <button onClick={resetView} title="Reset Center View">
            <Maximize2 size={16} />
          </button>
          <div className="hud-pan-hint">
            <Move size={14} /> <span>Drag to Pan • Scroll Wheel to Zoom</span>
          </div>
        </div>
      )}

      {/* Blank Canvas In-Game Minecraft Welcome Hero */}
      {isCanvasBlank ? (
        <div className="blank-hero-overlay">
          <div className="blank-hero-card">
            <div className="blank-hero-badge">
              <Sparkles size={28} color="#ffff55" />
            </div>
            <h2 className="pixel-title blank-hero-title">ADVANCEMENTFORGE • MINECRAFT 1.21.1</h2>
            <p className="blank-hero-sub">
              Start by uploading your Minecraft <strong>mods folder screenshot</strong> or pasting your <strong>mod list text</strong> to generate custom advancement trees with AI!
            </p>

            <div className="blank-hero-actions">
              <button className="mc-btn ai-upload-btn hero-btn" onClick={onOpenUploadScreenshot}>
                <Upload size={18} color="#ffff55" />
                <span>📷 Upload Mods Screenshot</span>
              </button>

              <button className="mc-btn hero-btn" onClick={onOpenInputText}>
                <FileText size={18} color="#55ffff" />
                <span>📝 Input Mod List Text</span>
              </button>

              <button className="mc-btn primary-action-btn hero-btn" onClick={onLoadCreateDemo}>
                <Play size={18} color="#55ff55" />
                <span>⚙️ Try Create Mod 1.21.1 Demo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Pannable & Zoomable World Space */
        <div
          className="mc-gui-canvas"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* In-game Style Orthogonal Lines */}
          <svg className="mc-gui-lines-svg">
            {advancements.map((node) => {
              if (!node.parent || !nodeCoords[node.parent] || !nodeCoords[node.id]) return null;

              const start = nodeCoords[node.parent];
              const end = nodeCoords[node.id];

              const x1_R = start.x + NODE_SIZE;
              const y1_C = start.y + NODE_SIZE / 2;

              const x2_L = end.x;
              const y2_C = end.y + NODE_SIZE / 2;

              let pathData;
              if (y1_C === y2_C) {
                pathData = `M ${x1_R} ${y1_C} L ${x2_L} ${y2_C}`;
              } else {
                const midX = (x1_R + x2_L) / 2;
                pathData = `M ${x1_R} ${y1_C} L ${midX} ${y1_C} L ${midX} ${y2_C} L ${x2_L} ${y2_C}`;
              }

              const childDone = !!completedMap[node.id];
              let strokeColor = childDone ? '#55ff55' : '#ffffff';

              return (
                <g key={`line-${node.parent}-${node.id}`}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="7"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <div className="mc-gui-nodes-layer">
            {advancements.map((node) => {
              const coords = nodeCoords[node.id] || { x: 0, y: 0 };
              const completed = !!completedMap[node.id];
              const unlocked = isUnlocked(node);
              const selected = selectedAdvancement && selectedAdvancement.id === node.id;

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${coords.x}px`,
                    top: `${coords.y}px`
                  }}
                >
                  <AdvancementNode
                    advancement={node}
                    isCompleted={completed}
                    isUnlocked={unlocked}
                    isSelected={selected}
                    onSelect={onSelectAdvancement}
                    onToggleComplete={onToggleComplete}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
