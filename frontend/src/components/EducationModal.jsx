import { useState, useEffect } from 'react';

export const EducationModal = ({ isOpen, onClose, eduToEdit, onSave, saving, apiError }) => {
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isOngoing, setIsOngoing] = useState(false);
  const [localError, setLocalError] = useState('');

  const isEditing = Boolean(eduToEdit);

  useEffect(() => {
    if (isOpen) {
      if (eduToEdit) {
        setDegree(eduToEdit.degree || '');
        setInstitution(eduToEdit.institution || '');
        setStartYear(eduToEdit.startYear !== undefined && eduToEdit.startYear !== null ? String(eduToEdit.startYear) : '');
        if (eduToEdit.endYear === null || eduToEdit.endYear === undefined || eduToEdit.endYear === '') {
          setEndYear('');
          setIsOngoing(true);
        } else {
          setEndYear(String(eduToEdit.endYear));
          setIsOngoing(false);
        }
      } else {
        setDegree('');
        setInstitution('');
        setStartYear(String(new Date().getFullYear() - 4));
        setEndYear(String(new Date().getFullYear()));
        setIsOngoing(false);
      }
      setLocalError('');
    }
  }, [isOpen, eduToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!degree.trim()) {
      setLocalError('Degree/Program title is required.');
      return;
    }
    if (!institution.trim()) {
      setLocalError('Institution/School name is required.');
      return;
    }

    const start = Number(startYear);
    if (!startYear || !Number.isInteger(start) || start < 1900 || start > 2100) {
      setLocalError('Start year must be a valid 4-digit year (between 1900 and 2100).');
      return;
    }

    let end = null;
    if (!isOngoing && endYear.trim() !== '') {
      end = Number(endYear);
      if (!Number.isInteger(end) || end < 1900 || end > 2100) {
        setLocalError('End year must be a valid 4-digit year (between 1900 and 2100).');
        return;
      }
      if (end < start) {
        setLocalError('End year cannot be earlier than start year.');
        return;
      }
    }

    onSave({
      degree: degree.trim(),
      institution: institution.trim(),
      startYear: start,
      endYear: end,
    });
  };

  const errorMessage = localError || apiError;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{isEditing ? 'Edit Education Entry' : 'Add Education Entry'}</h3>
            <p className="modal-subtitle">Document your degrees, certificates, and academic milestones</p>
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
            <label htmlFor="edu-degree">Degree or Certification *</label>
            <input
              id="edu-degree"
              type="text"
              className="form-control"
              value={degree}
              onChange={(e) => {
                setDegree(e.target.value);
                if (localError) setLocalError('');
              }}
              placeholder="e.g. B.S. in Computer Science & Engineering"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edu-institution">Institution or University *</label>
            <input
              id="edu-institution"
              type="text"
              className="form-control"
              value={institution}
              onChange={(e) => {
                setInstitution(e.target.value);
                if (localError) setLocalError('');
              }}
              placeholder="e.g. Stanford University"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edu-startYear">Start Year *</label>
              <input
                id="edu-startYear"
                type="number"
                min="1900"
                max="2100"
                className="form-control"
                value={startYear}
                onChange={(e) => {
                  setStartYear(e.target.value);
                  if (localError) setLocalError('');
                }}
                placeholder="2019"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edu-endYear">End Year</label>
              <input
                id="edu-endYear"
                type="number"
                min="1900"
                max="2100"
                className="form-control"
                value={isOngoing ? '' : endYear}
                onChange={(e) => {
                  setEndYear(e.target.value);
                  if (localError) setLocalError('');
                }}
                placeholder={isOngoing ? 'Present (Ongoing)' : '2023'}
                disabled={isOngoing}
              />
            </div>
          </div>

          <div className="form-checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={(e) => {
                  setIsOngoing(e.target.checked);
                  if (e.target.checked) setEndYear('');
                  if (localError) setLocalError('');
                }}
              />
              <span>I am currently pursuing this education (ongoing / present)</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Education' : 'Add Education'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationModal;
