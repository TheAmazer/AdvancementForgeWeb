import React, { useState } from 'react';
import { X, Box, CheckCircle, Search } from 'lucide-react';
import MinecraftIcon from './MinecraftIcon';

export default function InstalledModsModal({ onClose, mods = [] }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredMods = mods.filter((mod) => {
    if (filter === 'create' && !mod.name?.toLowerCase().includes('create')) return false;
    if (filter === 'general' && mod.name?.toLowerCase().includes('create')) return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchName = (mod.name || '').toLowerCase().includes(q);
      const matchFile = (mod.filename || '').toLowerCase().includes(q);
      return matchName || matchFile;
    }
    return true;
  });

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div className="mc-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mc-modal-header">
          <div className="modal-title-box">
            <Box size={22} color="#ffa800" />
            <div>
              <h2 className="pixel-title modal-title">
                INSTALLED MINECRAFT MODS ({mods.length})
              </h2>
              <p className="modal-tagline">NeoForge 1.21.1 Modpack Directory</p>
            </div>
          </div>
          <button className="mc-btn close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ padding: '12px 16px 0 16px', background: '#1e1e24', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div className="mc-search-input" style={{ flex: 1, minWidth: '200px' }}>
            <Search size={14} color="#aaa" />
            <input
              type="text"
              placeholder="Filter installed mods by name or filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="mc-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Mods ({mods.length})</option>
            <option value="create">Create Addons</option>
            <option value="general">General Mods</option>
          </select>
        </div>

        {/* Body */}
        <div className="mc-modal-body" style={{ minHeight: '340px' }}>
          <div className="mods-grid">
            {filteredMods.map((mod, idx) => (
              <div key={mod.id || `mod-${idx}`} className="mod-card">
                <div className="mod-card-header">
                  <div className="mod-icon-wrapper" style={{ borderColor: mod.color || '#e67e22' }}>
                    <MinecraftIcon iconName={mod.icon || mod.name} size={28} />
                  </div>
                  <div className="mod-info">
                    <h3 className="mod-name-title">{mod.name || "Minecraft Mod"}</h3>
                    {mod.filename && (
                      <span className="mod-filename-code">{mod.filename}</span>
                    )}
                    <span className="mod-category-tag">
                      {mod.name?.toLowerCase().includes('create') ? 'Create Addon' : 'Gameplay Mod'}
                    </span>
                  </div>
                </div>
                {mod.description && <p className="mod-desc">{mod.description}</p>}
              </div>
            ))}

            {filteredMods.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                No installed mods match your filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mc-modal-footer">
          <span style={{ fontSize: '13px', color: '#aaa' }}>
            Showing {filteredMods.length} of {mods.length} mods
          </span>
          <button className="mc-btn primary-action-btn" onClick={onClose}>
            <CheckCircle size={16} />
            <span>Close Directory</span>
          </button>
        </div>
      </div>
    </div>
  );
}
