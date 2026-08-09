import React from 'react';
import { X, CheckCircle, Circle, Award, BookOpen, Layers, Gift, ChevronRight, Lock } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import MinecraftIcon from './MinecraftIcon';

export default function AdvancementModal({
  advancement,
  isCompleted,
  isUnlocked,
  allAdvancements,
  completedMap,
  onClose,
  onToggleComplete
}) {
  if (!advancement) return null;

  const parentAdvancement = advancement.parent
    ? allAdvancements.find((a) => a.id === advancement.parent)
    : null;

  const handleToggle = () => {
    onToggleComplete(advancement.id);
  };

  const getFrameColor = (frame) => {
    switch (frame) {
      case 'challenge': return '#ff55ff';
      case 'goal': return '#ffff55';
      default: return '#55ffff';
    }
  };

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div 
        className={`mc-modal-content frame-border-${advancement.frame}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mc-modal-header">
          <div className="modal-title-box">
            <div className={`modal-icon-badge frame-${advancement.frame}`}>
              <MinecraftIcon icon={advancement.icon} id={advancement.id} size={32} />
            </div>
            <div>
              <div className="type-pills">
                <span className="frame-pill" style={{ backgroundColor: getFrameColor(advancement.frame) }}>
                  {advancement.frame.toUpperCase()}
                </span>
                <span className="mod-pill">
                  {advancement.modName}
                </span>
                {isCompleted ? (
                  <span className="status-pill done">✓ COMPLETED</span>
                ) : isUnlocked ? (
                  <span className="status-pill unlocked">UNLOCKED</span>
                ) : (
                  <span className="status-pill locked">🔒 LOCKED</span>
                )}
              </div>
              <h2 className="pixel-title modal-title">{advancement.title}</h2>
              <p className="modal-tagline">"{advancement.tagline}"</p>
            </div>
          </div>

          <button className="mc-btn close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mc-modal-body">
          {/* Prerequisite Lock Warning */}
          {!isUnlocked && !isCompleted && (
            <div className="error-banner" style={{ background: '#4a0000', borderColor: '#ff0000' }}>
              <Lock size={16} color="#ff5555" />
              <span>
                <strong>PREREQUISITE REQUIRED:</strong> Complete "{parentAdvancement ? parentAdvancement.title : 'Prerequisite'}" first to unlock!
              </span>
            </div>
          )}

          {/* Description */}
          <div className="section-box">
            <h4 className="section-title">
              <BookOpen size={16} /> Objective Description
            </h4>
            <p className="desc-text">{advancement.description}</p>
          </div>

          {/* Parent Requirement */}
          {parentAdvancement && (
            <div className="section-box requirement-box">
              <h4 className="section-title">
                <Layers size={16} /> Prerequisite Requirement
              </h4>
              <div className="parent-link">
                <MinecraftIcon icon={parentAdvancement.icon} id={parentAdvancement.id} size={24} />
                <span className="parent-title">{parentAdvancement.title}</span>
                <ChevronRight size={16} />
                <span className={`parent-status ${completedMap[parentAdvancement.id] ? 'done' : 'pending'}`}>
                  {completedMap[parentAdvancement.id] ? '✓ Completed' : '🔒 Incomplete (Required)'}
                </span>
              </div>
            </div>
          )}

          {/* Step-by-Step Progression Guide */}
          <div className="section-box guide-box">
            <h4 className="section-title">
              <Award size={16} /> Step-by-Step Progression Guide
            </h4>
            <div className="guide-steps">
              {advancement.guide ? (
                advancement.guide.map((step, idx) => (
                  <div key={idx} className="step-item">
                    <p>{step}</p>
                  </div>
                ))
              ) : (
                <p>Follow standard Create mod crafting and placement recipes.</p>
              )}
            </div>
          </div>

          {/* Reward & Unlocks */}
          {advancement.reward && (
            <div className="section-box reward-box">
              <h4 className="section-title">
                <Gift size={16} color="#ffff55" /> Progression Reward / Unlocks
              </h4>
              <p className="reward-text">{advancement.reward}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mc-modal-footer">
          <button className="mc-btn" onClick={onClose}>
            Close Window
          </button>
          <button
            className={`mc-btn ${isCompleted ? 'btn-complete-toggle' : !isUnlocked ? 'btn-locked-action' : 'primary-action-btn'}`}
            onClick={handleToggle}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={16} />
                <span>Mark as Incomplete</span>
              </>
            ) : !isUnlocked ? (
              <>
                <Lock size={16} color="#ffaa00" />
                <span>Locked (Requires Prerequisite)</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
