import React from 'react';
import { Award, Star, Flame, Lock } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const isLocked = toast.isLockedAlert;
  const isChallenge = toast.frame === 'challenge';
  const isGoal = toast.frame === 'goal';

  return (
    <div className={`mc-toast-popup ${isLocked ? 'toast-locked' : toast.frame}`} onClick={onClose}>
      <div className="toast-icon-box">
        <span className="icon">{toast.icon || '🔒'}</span>
      </div>
      <div className="toast-details">
        <div className="toast-header-text">
          {isLocked ? (
            <span className="locked-title" style={{ color: '#ff5555' }}><Lock size={12} /> PREREQUISITE REQUIRED!</span>
          ) : isChallenge ? (
            <span className="challenge-title"><Flame size={12} /> CHALLENGE COMPLETED!</span>
          ) : isGoal ? (
            <span className="goal-title"><Star size={12} /> GOAL REACHED!</span>
          ) : (
            <span className="task-title"><Award size={12} /> ADVANCEMENT MADE!</span>
          )}
        </div>
        <div className="toast-adv-name">{toast.title}</div>
        <div className="toast-tagline">{toast.tagline}</div>
      </div>
    </div>
  );
}
