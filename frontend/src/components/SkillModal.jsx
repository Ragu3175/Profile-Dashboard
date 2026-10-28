import { useState, useEffect } from 'react';

export const SkillModal = ({ isOpen, onClose, skillToEdit, onSave, saving, apiError }) => {
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState(80);
  const [localError, setLocalError] = useState('');

  const isEditing = Boolean(skillToEdit);

  useEffect(() => {
    if (isOpen) {
      if (skillToEdit) {
        setName(skillToEdit.name || '');
        setProficiency(Number.isInteger(skillToEdit.proficiency) ? skillToEdit.proficiency : 80);
      } else {
        setName('');
        setProficiency(80);
      }
      setLocalError('');
    }
  }, [isOpen, skillToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('Skill name is required.');
      return;
    }

    const prof = Number(proficiency);
    if (!Number.isInteger(prof) || prof < 0 || prof > 100) {
      setLocalError('Proficiency must be an integer between 0 and 100.');
      return;
    }

    onSave({
      name: name.trim(),
      proficiency: prof,
    });
  };

  const errorMessage = localError || apiError;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isEditing ? 'Edit Skill' : 'Add New Skill'}</h3>
            <p className="modal-subtitle">Specify your skill name and proficiency level</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="skill-name">Skill Name *</label>
            <input
              id="skill-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (localError) setLocalError('');
              }}
              placeholder="e.g. React, TypeScript, Docker"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <div className="slider-label-row">
              <label htmlFor="skill-proficiency">Proficiency Level</label>
              <span className="proficiency-pill">{proficiency}%</span>
            </div>
            <div className="slider-control-group">
              <input
                id="skill-proficiency"
                type="range"
                min="0"
                max="100"
                step="1"
                className="proficiency-slider"
                value={proficiency}
                onChange={(e) => setProficiency(Number(e.target.value))}
              />
              <input
                type="number"
                min="0"
                max="100"
                className="form-control proficiency-number-input"
                value={proficiency}
                onChange={(e) => {
                  const val = Math.min(100, Math.max(0, Number(e.target.value)));
                  setProficiency(val);
                }}
              />
            </div>
            <div className="proficiency-scale-marks">
              <span>0% Beginner</span>
              <span>50% Intermediate</span>
              <span>100% Expert</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
