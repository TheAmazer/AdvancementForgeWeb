import React, { useState } from 'react';
import { X, Search, CheckCircle, Package } from 'lucide-react';
import MinecraftIcon from './MinecraftIcon';

export default function InstalledModsModal({ mods, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(mods.map((m) => m.category || (m.name.includes("Create") ? "Create Addon" : "General")))];

  const filteredMods = mods.filter((mod) => {
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mod.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const modCat = mod.category || (mod.name.includes("Create") ? "Create Addon" : "General");
    const matchesCategory = selectedCategory === 'All' || modCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div className="mc-modal-content mods-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mc-modal-header">
          <div className="modal-title-box">
            <Package size={22} color="#ffa800" />
            <div>
              <h2 className="pixel-title modal-title">INSTALLED MINECRAFT MODS ({mods.length})</h2>
              <p className="modal-tagline">NeoForge 1.21.1 Modpack Directory</p>
            </div>
          </div>
          <button className="mc-btn close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="mods-filter-bar">
          <div className="mc-search-input modal-search">
            <Search size={14} color="#aaa" />
            <input
              type="text"
              placeholder="Filter installed mods by name or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mods Grid */}
        <div className="mc-modal-body mods-grid-container">
          <div className="mods-list">
            {filteredMods.map((mod, idx) => {
              const isCreate = mod.name.toLowerCase().includes('create');
              return (
                <div key={idx} className={`mod-card ${isCreate ? 'create-addon-card' : ''}`}>
                  <div className="mod-card-header">
                    <div className="mod-card-icon">
                      <MinecraftIcon icon={mod.icon || (isCreate ? "cog" : "package")} id={mod.id || mod.name} size={24} />
                    </div>
                    <div className="mod-info">
                      <span className="mod-name">{mod.name}</span>
                      <span className="mod-filename">{mod.filename}</span>
                    </div>
                    {isCreate && <span className="create-badge">Create Addon</span>}
                  </div>
                  {mod.description && <p className="mod-desc">{mod.description}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mc-modal-footer">
          <span className="mods-count-hint">Showing {filteredMods.length} of {mods.length} mods</span>
          <button className="mc-btn primary-action-btn" onClick={onClose}>
            <CheckCircle size={16} />
            <span>Close Directory</span>
          </button>
        </div>
      </div>
    </div>
  );
}
