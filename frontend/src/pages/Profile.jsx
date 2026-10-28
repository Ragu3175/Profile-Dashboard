import { useState, useEffect } from 'react';
import { profileApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const Profile = () => {
  const { user: authUser, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load profile data using GET /profile
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setInitialLoading(true);
        setErrorMessage('');
        const res = await profileApi.getProfile();
        if (isMounted && res && res.data && res.data.user) {
          const u = res.data.user;
          setFormData({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            bio: u.bio || '',
            avatar: u.avatar || '',
          });
          updateUser(u);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to load profile details.');
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setSaving(true);

    try {
      const res = await profileApi.updateProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
      });

      if (res && res.data && res.data.user) {
        updateUser(res.data.user);
        setSuccessMessage('Profile updated successfully!');
      } else {
        setSuccessMessage('Profile saved.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="page-container">
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading your profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-layout">
        <div className="profile-sidebar card">
          <div className="avatar-section">
            <div className="avatar-circle-large">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name || 'User Avatar'}
                  className="avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="avatar-initials-large">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <h3>{formData.name || 'Your Name'}</h3>
            <p className="text-muted">{formData.email}</p>
          </div>
          {formData.bio && (
            <div className="sidebar-bio">
              <p>{formData.bio}</p>
            </div>
          )}
        </div>

        <div className="profile-main card">
          <div className="card-header">
            <h2>Edit Profile</h2>
            <p className="card-subtitle">Update your personal account details below</p>
          </div>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              <span className="alert-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 555-0123"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar Image URL</label>
                <input
                  id="avatar"
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself (up to 250 characters)"
                maxLength={250}
                className="form-control"
              />
              <small className="form-text text-muted">
                {formData.bio.length}/250 characters
              </small>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                id="save-profile-btn"
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
