import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import Tabs from './components/Tabs';
import AdvancementTree from './components/AdvancementTree';
import AdvancementModal from './components/AdvancementModal';
import InstalledModsModal from './components/InstalledModsModal';
import UploadModsModal from './components/UploadModsModal';
import ToastNotification from './components/ToastNotification';
import { ADVANCEMENTS, ADVANCEMENT_TABS, ALL_INSTALLED_MODS } from './data/advancements';
import { soundEngine } from './utils/audio';
import './App.css';

const LOCAL_STORAGE_KEY = 'mc_create_advancements_v1';
const DATASET_STORAGE_KEY = 'mc_custom_advancements_dataset_v1';

export default function App() {
  // Blank canvas by default if no saved dataset exists
  const [tabsList, setTabsList] = useState(() => {
    try {
      const saved = localStorage.getItem(DATASET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tabs && parsed.tabs.length > 0) return parsed.tabs;
      }
    } catch {}
    return []; // Blank start
  });

  const [advancementsList, setAdvancementsList] = useState(() => {
    try {
      const saved = localStorage.getItem(DATASET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.advancements && parsed.advancements.length > 0) return parsed.advancements;
      }
    } catch {}
    return []; // Blank start
  });

  const [recognizedModsList, setRecognizedModsList] = useState(() => {
    try {
      const saved = localStorage.getItem(DATASET_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recognizedMods) return parsed.recognizedMods;
      }
    } catch {}
    return []; // Blank start
  });

  const [activeTab, setActiveTab] = useState(tabsList[0]?.id || '');
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedAdvancement, setSelectedAdvancement] = useState(null);
  const [showModsModal, setShowModsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMod, setFilterMod] = useState('all');
  const [filterFrame, setFilterFrame] = useState('all');
  const [isMuted, setIsMuted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedMap));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }, [completedMap]);

  // Load sample Create Mod dataset
  const handleLoadCreateDemo = () => {
    soundEngine.playAdvancement();
    setTabsList(ADVANCEMENT_TABS);
    setAdvancementsList(ADVANCEMENTS);
    setRecognizedModsList(ALL_INSTALLED_MODS);
    setActiveTab(ADVANCEMENT_TABS[0].id);
    setCompletedMap({ rotation_era: true });

    try {
      localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify({
        tabs: ADVANCEMENT_TABS,
        advancements: ADVANCEMENTS,
        recognizedMods: ALL_INSTALLED_MODS
      }));
    } catch (e) {
      console.warn("Dataset save error", e);
    }
  };

  // Handle newly generated AI dataset from uploaded mods screenshot or text list
  const handleApplyGeneratedAdvancements = (data) => {
    if (data.tabs && data.advancements) {
      setTabsList(data.tabs);
      setAdvancementsList(data.advancements);
      const mods = data.recognizedMods && data.recognizedMods.length > 0 ? data.recognizedMods : [];
      setRecognizedModsList(mods);

      setActiveTab(data.tabs[0]?.id || 'scanned_tech');
      setCompletedMap({ [data.advancements[0]?.id]: true });

      try {
        localStorage.setItem(DATASET_STORAGE_KEY, JSON.stringify({
          tabs: data.tabs,
          advancements: data.advancements,
          recognizedMods: mods
        }));
      } catch (e) {
        console.warn("Dataset save error", e);
      }
    }
  };

  const handleToggleComplete = (id) => {
    const isCurrentlyDone = !!completedMap[id];
    const targetAdv = advancementsList.find((a) => a.id === id);

    if (!targetAdv) return;

    // Enforce Prerequisite Validation
    if (!isCurrentlyDone && targetAdv.parent && !completedMap[targetAdv.parent]) {
      const parentAdv = advancementsList.find((a) => a.id === targetAdv.parent);
      soundEngine.playClick();
      setToast({
        isLockedAlert: true,
        icon: '🔒',
        title: targetAdv.title,
        tagline: `Complete "${parentAdv ? parentAdv.title : 'Prerequisite'}" first!`
      });
      setTimeout(() => setToast(null), 4500);
      return;
    }

    setCompletedMap((prev) => ({ ...prev, [id]: !isCurrentlyDone }));

    if (!isCurrentlyDone) {
      setToast(targetAdv);
      setTimeout(() => setToast(null), 4500);

      if (targetAdv.frame === 'challenge') {
        soundEngine.playChallenge();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else {
        soundEngine.playAdvancement();
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      }
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Clear all loaded advancements and start on a blank canvas?")) {
      setCompletedMap({});
      setTabsList([]);
      setAdvancementsList([]);
      setRecognizedModsList([]);
      setActiveTab('');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(DATASET_STORAGE_KEY);
    }
  };

  const openUploadModalWithTab = (tab = 'image') => {
    soundEngine.playClick();
    setUploadModalTab(tab);
    setShowUploadModal(true);
  };

  const filteredAdvancements = advancementsList.filter((adv) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchSearch = (adv.title || '').toLowerCase().includes(q) ||
                          (adv.description || '').toLowerCase().includes(q) ||
                          (adv.modName || '').toLowerCase().includes(q) ||
                          (adv.reward && adv.reward.toLowerCase().includes(q));
      if (!matchSearch) return false;
    } else {
      if (adv.tab !== activeTab) return false;
    }

    if (filterMod !== 'all' && adv.mod !== filterMod) return false;
    if (filterFrame !== 'all' && adv.frame !== filterFrame) return false;

    return true;
  });

  const activeTabMeta = tabsList.find((t) => t.id === activeTab) || tabsList[0];
  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const totalCount = advancementsList.length;

  return (
    <div className="mc-screen-wrapper">
      <Header
        completedCount={completedCount}
        totalCount={totalCount}
        onResetProgress={handleResetProgress}
        onOpenModsModal={() => setShowModsModal(true)}
        onOpenUploadModal={() => openUploadModalWithTab('image')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterMod={filterMod}
        setFilterMod={setFilterMod}
        filterFrame={filterFrame}
        setFilterFrame={setFilterFrame}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        recognizedMods={recognizedModsList}
      />

      {/* Main Authentic Minecraft Advancement GUI Window */}
      <div className="mc-advancement-gui-frame">
        {/* Top Tabs sticking out of window frame */}
        {tabsList.length > 0 && (
          <Tabs
            tabs={tabsList}
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              setActiveTab(tabId);
              setSearchQuery('');
            }}
            advancements={advancementsList}
            completedMap={completedMap}
          />
        )}

        {/* White Rounded GUI Container */}
        <div className="mc-gui-window">
          {/* Header Title inside GUI window ("Welcome to ...") */}
          <div className="mc-gui-header">
            <span className="pixel-title mc-gui-title">
              {activeTabMeta ? `Welcome to ${activeTabMeta.mod || activeTabMeta.title}` : "Minecraft Advancement Generator"}
            </span>
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mc-search-banner">
              Search results for "{searchQuery}" ({filteredAdvancements.length} items found)
            </div>
          )}

          {/* Viewport: Renders Tree or Blank Canvas Welcome Banner */}
          <AdvancementTree
            advancements={filteredAdvancements}
            completedMap={completedMap}
            selectedAdvancement={selectedAdvancement}
            onSelectAdvancement={(adv) => setSelectedAdvancement(adv)}
            onToggleComplete={handleToggleComplete}
            bgType={activeTabMeta?.bg || "stone"}
            isCanvasBlank={advancementsList.length === 0}
            onOpenUploadScreenshot={() => openUploadModalWithTab('image')}
            onOpenInputText={() => openUploadModalWithTab('text')}
            onLoadCreateDemo={handleLoadCreateDemo}
          />
        </div>
      </div>

      {selectedAdvancement && (
        <AdvancementModal
          advancement={selectedAdvancement}
          isCompleted={!!completedMap[selectedAdvancement.id]}
          isUnlocked={!selectedAdvancement.parent || !!completedMap[selectedAdvancement.parent]}
          allAdvancements={advancementsList}
          completedMap={completedMap}
          onClose={() => setSelectedAdvancement(null)}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {showModsModal && (
        <InstalledModsModal
          onClose={() => setShowModsModal(false)}
          mods={recognizedModsList}
        />
      )}

      {showUploadModal && (
        <UploadModsModal
          onClose={() => setShowUploadModal(false)}
          onApplyGeneratedAdvancements={handleApplyGeneratedAdvancements}
        />
      )}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
