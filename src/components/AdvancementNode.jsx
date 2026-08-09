import React from 'react';
import { soundEngine } from '../utils/audio';
import MinecraftIcon from './MinecraftIcon';

export default function AdvancementNode({
  advancement,
  isCompleted,
  isUnlocked,
  isSelected,
  onSelect,
  onToggleComplete
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    soundEngine.playClick();
    onSelect(advancement);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onToggleComplete(advancement.id);
  };

  const frameType = advancement.frame || 'task';
  const statusState = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

  return (
    <div
      className={`mc-node-wrapper node-${frameType} state-${statusState} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="mc-node-box">
        <MinecraftIcon icon={advancement.icon} id={advancement.id} size={28} />
      </div>

      {/* Authentic Minecraft Advancement Hover Tooltip */}
      <div className="mc-tooltip-popup">
        <div className="mc-tooltip-header">
          <span className="mc-tooltip-title">{advancement.title}</span>
          <span className="mc-tooltip-frame">[{frameType.toUpperCase()}]</span>
        </div>
        <div className="mc-tooltip-desc">
          {advancement.description}
        </div>
        {advancement.tagline && (
          <div className="mc-tooltip-guide-hint">
            {advancement.tagline}
          </div>
        )}
        <div className="mc-tooltip-footer">
          <span className="mc-tooltip-mod">{advancement.modName}</span>
          <span className="mc-tooltip-status">
            {isCompleted ? '✓ Completed' : isUnlocked ? '▶ In Progress' : '🔒 Locked'}
          </span>
        </div>
        <div className="mc-tooltip-click-action">
          Click for full guide • Double-click to toggle
        </div>
      </div>
    </div>
  );
}
