import { useState, useEffect } from 'react';

export const ProfileEditModal = ({ isOpen, onClose, user, onSave, saving, apiError }) => {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
  });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        headline: user.headline || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      });
      setLocalError('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (localError) setLocalError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setLocalError('Name must be at least 2 characters long.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (formData.bio.length > 250) {
      setLocalError('Bio cannot exceed 250 characters.');
      return;
    }

    onSave({
      name: formData.name.trim(),
      headline: formData.headline.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      avatar: formData.avatar.trim(),
      bio: formData.bio.trim(),
    });
  };

  const errorMessage = localError || apiError;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Edit Profile Details</h3>
            <p className="modal-subtitle">Update your personal and contact information</p>
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-name">Full Name *</label>
              <input
                id="edit-name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email">Email Address *</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-headline">Professional Headline</label>
            <input
              id="edit-headline"
              name="headline"
              type="text"
              className="form-control"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Senior Full Stack Engineer | React & Node.js"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-phone">Phone Number</label>
              <input
                id="edit-phone"
                name="phone"
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-avatar">Avatar Image URL</label>
              <input
                id="edit-avatar"
                name="avatar"
                type="url"
                className="form-control"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-counter">
              <label htmlFor="edit-bio">Personal Bio</label>
              <span className={`char-counter ${formData.bio.length > 240 ? 'warning' : ''}`}>
                {formData.bio.length}/250
              </span>
            </div>
            <textarea
              id="edit-bio"
              name="bio"
              rows={3}
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a concise overview of your background, passions, and expertise..."
              maxLength={250}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
