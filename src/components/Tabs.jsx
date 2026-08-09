import React from 'react';
import { soundEngine } from '../utils/audio';
import MinecraftIcon from './MinecraftIcon';

export default function Tabs({ tabs, activeTab, onSelectTab, advancements, completedMap }) {
  return (
    <div className="mc-gui-tabs-strip">
      {tabs.map((tab) => {
        const tabAdvancements = advancements.filter((a) => a.tab === tab.id);
        const completedCount = tabAdvancements.filter((a) => completedMap[a.id]).length;
        const totalCount = tabAdvancements.length;
        const isComplete = totalCount > 0 && completedCount === totalCount;
        const isActive = activeTab === tab.id;

        const handleClick = () => {
          soundEngine.playClick();
          onSelectTab(tab.id);
        };

        const progressPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
        const tooltipText = `${tab.title} (${tab.mod || ''})\nProgress: ${completedCount}/${totalCount} (${progressPercent}%)`;

        return (
          <button
            key={tab.id}
            className={`mc-gui-tab ${isActive ? 'tab-active' : 'tab-inactive'} ${isComplete ? 'tab-all-done' : ''}`}
            onClick={handleClick}
            title={tooltipText}
          >
            {/* Minecraft Pixel Icon */}
            <span className="mc-tab-icon">
              <MinecraftIcon icon={tab.icon} id={tab.id} size={28} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
