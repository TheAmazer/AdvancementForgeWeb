import React, { useState } from 'react';
import { X, Upload, Sparkles, AlertCircle, Loader2, Image as ImageIcon, FileText, Key } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function UploadModsModal({ onClose, onApplyGeneratedAdvancements }) {
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'text'
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [modListText, setModListText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [warningMsg, setWarningMsg] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setError(null);
      setWarningMsg(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
      setError(null);
      setWarningMsg(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePresetSample = (sampleType) => {
    soundEngine.playClick();
    if (sampleType === 'create') {
      setModListText(`create-1.21.1-6.0.9.jar\ncreate_connected-1.1.13.jar\ncreateaddition-1.5.10.jar\ncreatedieselgenerators-1.3.11.jar\ncreate-enchantment-industry-2.3.0.jar\ncreatenuclear-1.3.2.jar\ncreateoreexcavation-1.6.8.jar\ncreate-stuff-additions-2.1.0e.jar\ncreate-dragons-plus-1.8.7.jar`);
    } else if (sampleType === 'tech') {
      setModListText(`appliedenergistics2-19.2.17.jar\nindustrialforegoing-1.21-3.6.38.jar\nmekanism-1.21.1-10.7.5.jar\npowah-neoforge-1.21.1-5.0.8.jar\nenderio-neoforge-7.0.0.jar`);
    } else if (sampleType === 'magic') {
      setModListText(`ars_nouveau-1.21.1-5.1.2.jar\nbotania-1.21.1-447.jar\noccultism-1.21.1-1.135.0.jar\nbloodmagic-1.21.1-3.3.3.jar`);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'image' && !file) {
      setError('Please select or drop a screenshot image of your mods folder first.');
      return;
    }
    if (activeTab === 'text' && !modListText.trim()) {
      setError('Please paste a list of mods or jar filenames in the text box.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarningMsg(null);
    setLoadingStep('Reading input data...');
    soundEngine.playClick();

    try {
      let payload = {};

      if (activeTab === 'image' && file) {
        setLoadingStep('Encoding screenshot image...');
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        payload = {
          imageBase64: base64,
          mimeType: file.type || 'image/png'
        };
      } else {
        payload = {
          modListText: modListText
        };
      }

      setLoadingStep('Gemini Vision AI is analyzing mods & constructing progression tree...');

      const headers = { 'Content-Type': 'application/json' };
      if (apiKey.trim()) {
        headers['x-api-key'] = apiKey.trim();
      }

      const response = await fetch('/api/analyze-mods', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to analyze mods list.');
      }

      if (result.warning) {
        setWarningMsg(result.warning);
      }

      soundEngine.playAdvancement();
      onApplyGeneratedAdvancements(result.data);
      if (!result.warning) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error communicating with AI server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div className="mc-modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mc-modal-header">
          <div className="modal-title-box">
            <Sparkles size={22} color="#ffff55" />
            <div>
              <h2 className="pixel-title modal-title">AI MODPACK ADVANCEMENT GENERATOR</h2>
              <p className="modal-tagline">Upload Screenshot OR Paste Text List to Build Progression Trees</p>
            </div>
          </div>
          <button className="mc-btn close-btn" onClick={onClose} disabled={isLoading}>
            <X size={18} />
          </button>
        </div>

        {/* Input Mode Tabs */}
        <div className="input-mode-tabs">
          <button 
            className={`mode-tab-btn ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => { setActiveTab('image'); setError(null); setWarningMsg(null); }}
            disabled={isLoading}
          >
            <ImageIcon size={16} /> 📷 Screenshot Upload
          </button>
          <button 
            className={`mode-tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => { setActiveTab('text'); setError(null); setWarningMsg(null); }}
            disabled={isLoading}
          >
            <FileText size={16} /> 📝 Mod List Text Input
          </button>
        </div>

        {/* Modal Body */}
        <div className="mc-modal-body">
          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {warningMsg && (
            <div className="error-banner" style={{ background: '#7e5109', borderColor: '#f39c12' }}>
              <AlertCircle size={16} color="#ffff55" />
              <span>{warningMsg}</span>
            </div>
          )}

          {activeTab === 'image' ? (
            /* Mode 1: Screenshot Dropzone */
            <div
              className="mc-dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="dropzone-preview">
                  <img src={previewUrl} alt="Mods Folder Screenshot" className="screenshot-preview" />
                  <span className="file-name-label">{file?.name}</span>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <Upload size={36} color="#888888" />
                  <p className="drop-title">Drag & Drop your Mods Folder Screenshot here</p>
                  <p className="drop-sub">Supports PNG, JPG, WEBP (Max 15MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="dropzone-file-input"
                disabled={isLoading}
              />
            </div>
          ) : (
            /* Mode 2: Text List Input */
            <div className="text-mode-container">
              <label className="input-label">
                <FileText size={14} /> Paste Mod Names or .jar Filenames:
              </label>
              <textarea
                className="mc-textarea-text"
                rows={7}
                placeholder="Example:&#10;create-1.21.1-6.0.9.jar&#10;mekanism-10.7.5.jar&#10;appliedenergistics2-19.2.17.jar&#10;botania-447.jar"
                value={modListText}
                onChange={(e) => setModListText(e.target.value)}
                disabled={isLoading}
              />

              <div className="sample-presets">
                <span className="preset-label">Quick Sample Presets:</span>
                <button className="preset-btn" onClick={() => handlePresetSample('create')}>
                  ⚙️ Create Modpack
                </button>
                <button className="preset-btn" onClick={() => handlePresetSample('tech')}>
                  ⚡ Tech Suite
                </button>
                <button className="preset-btn" onClick={() => handlePresetSample('magic')}>
                  ✨ Magic Pack
                </button>
              </div>
            </div>
          )}

          {/* Optional Gemini API Key Box */}
          <div className="api-key-box">
            <label className="input-label">
              <Key size={14} /> <span>Optional Custom Gemini API Key (Bypasses Vercel env key if empty):</span>
            </label>
            <input
              type="password"
              className="mc-input-text"
              placeholder="AIzaSy... (Paste key if server key is not configured)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="ai-loading-status">
              <Loader2 size={24} className="spinning-icon" color="#55ff55" />
              <span className="loading-step-text">{loadingStep}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mc-modal-footer">
          <button className="mc-btn" onClick={onClose} disabled={isLoading}>
            Close
          </button>
          <button
            className="mc-btn primary-action-btn"
            onClick={handleAnalyze}
            disabled={isLoading}
          >
            <Sparkles size={16} color="#ffff55" />
            <span>Generate Advancements</span>
          </button>
        </div>
      </div>
    </div>
  );
}
