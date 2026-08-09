import React from 'react';
import { Volume2, VolumeX, RotateCcw, Box, Search, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function Header({
  completedCount,
  totalCount,
  onResetProgress,
  onOpenModsModal,
  onOpenUploadModal,
  searchQuery,
  setSearchQuery,
  filterMod,
  setFilterMod,
  filterFrame,
  setFilterFrame,
  isMuted,
  setIsMuted,
  recognizedMods = []
}) {
  const percent = Math.round((completedCount / totalCount) * 100) || 0;

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="mc-pause-menu-bar">
      <div className="mc-pause-left">
        <span className="pixel-title mc-title">ADVANCEMENTFORGE • MINECRAFT 1.21.1</span>
        <span className="mc-progress-badge">
          Progress: {completedCount}/{totalCount} ({percent}%)
        </span>
      </div>

      <div className="mc-pause-center">
        <div className="mc-search-input">
          <Search size={14} color="#aaa" />
          <input
            type="text"
            placeholder="Search advancements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select className="mc-select" value={filterMod} onChange={(e) => setFilterMod(e.target.value)}>
          <option value="all">All Mods ({recognizedMods.length})</option>
          {recognizedMods.map((mod, idx) => {
            const keyVal = mod.id || `mod-${idx}`;
            return (
              <option key={keyVal} value={keyVal}>{mod.name || mod.filename || `Mod ${idx+1}`}</option>
            );
          })}
        </select>

        <select className="mc-select" value={filterFrame} onChange={(e) => setFilterFrame(e.target.value)}>
          <option value="all">All Frames</option>
          <option value="task">Task</option>
          <option value="goal">Goal</option>
          <option value="challenge">Challenge</option>
        </select>
      </div>

      <div className="mc-pause-right">
        <button className="mc-btn ai-upload-btn" onClick={onOpenUploadModal} title="Upload Screenshot of Mods Folder to Generate Advancements with AI Agent">
          <Sparkles size={16} color="#ffff55" />
          <span>AI Screenshot Upload</span>
        </button>

        <button className="mc-btn" onClick={onOpenModsModal} title="View Installed Mods List">
          <Box size={16} color="#ffa800" />
          <span>Mods List ({recognizedMods.length})</span>
        </button>

        <button className="mc-btn" onClick={toggleSound} title="Toggle Audio">
          {isMuted ? <VolumeX size={16} color="#ff5555" /> : <Volume2 size={16} color="#55ff55" />}
        </button>

        <button className="mc-btn" onClick={onResetProgress} title="Reset Progress">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
