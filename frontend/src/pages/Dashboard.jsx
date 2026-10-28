import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { profileApi } from '../services/api.js';
import ProfileEditModal from '../components/ProfileEditModal.jsx';
import SkillModal from '../components/SkillModal.jsx';
import EducationModal from '../components/EducationModal.jsx';

export const Dashboard = () => {
  const { user, updateUser, logout } = useAuth();

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null); // { skill, index }
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [eduToEdit, setEduToEdit] = useState(null); // { edu, index }

  // Action status
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showCompletionDetails, setShowCompletionDetails] = useState(false);

  // Helper to flash notification message
  const triggerFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  // Safe arrays
  const skills = useMemo(() => (Array.isArray(user?.skills) ? user.skills : []), [user?.skills]);
  const education = useMemo(() => (Array.isArray(user?.education) ? user.education : []), [user?.education]);

  // Profile completion calculation
  const completionReport = useMemo(() => {
    const rules = [
      { id: 'name', label: 'Full Name', weight: 10, completed: Boolean(user?.name?.trim()) },
      { id: 'email', label: 'Verified Email', weight: 10, completed: Boolean(user?.email?.trim()) },
      { id: 'headline', label: 'Professional Headline', weight: 15, completed: Boolean(user?.headline?.trim()) },
      { id: 'bio', label: 'Personal Bio', weight: 15, completed: Boolean(user?.bio?.trim()) },
      { id: 'phone', label: 'Phone Number', weight: 10, completed: Boolean(user?.phone?.trim()) },
      { id: 'avatar', label: 'Profile Avatar', weight: 10, completed: Boolean(user?.avatar?.trim()) },
      { id: 'skills', label: 'At least one Skill', weight: 15, completed: skills.length > 0 },
      { id: 'education', label: 'At least one Education record', weight: 15, completed: education.length > 0 },
    ];

    const score = rules.reduce((acc, rule) => (rule.completed ? acc + rule.weight : acc), 0);
    const missing = rules.filter((r) => !r.completed);

    return { score, rules, missing };
  }, [user, skills, education]);

  // Skill stats
  const skillStats = useMemo(() => {
    if (skills.length === 0) return { count: 0, average: 0, highest: null };
    const highest = [...skills].sort((a, b) => b.proficiency - a.proficiency)[0];
    const total = skills.reduce((sum, s) => sum + s.proficiency, 0);
    return {
      count: skills.length,
      average: Math.round(total / skills.length),
      highest,
    };
  }, [skills]);

  // Education stats
  const latestEducation = useMemo(() => {
    if (education.length === 0) return null;
    return [...education].sort((a, b) => b.startYear - a.startYear)[0];
  }, [education]);

  // 1. Profile Update
  const handleSaveProfile = async (profileData) => {
    setSaving(true);
    try {
      const res = await profileApi.updateProfile(profileData);
      if (res?.data?.user) {
        updateUser(res.data.user);
        setIsProfileModalOpen(false);
        triggerFeedback('success', 'Profile details updated successfully!');
      }
    } catch (err) {
      triggerFeedback('error', err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // 2. Skills Handlers
  const handleOpenAddSkill = () => {
    setSkillToEdit(null);
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill, index) => {
    setSkillToEdit({ ...skill, index });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (skillData) => {
    setSaving(true);
    try {
      let updatedSkills;
      if (skillToEdit !== null && skillToEdit.index !== undefined) {
        // Edit existing skill
        updatedSkills = skills.map((s, idx) => (idx === skillToEdit.index ? skillData : s));
      } else {
        // Add new skill
        updatedSkills = [...skills, skillData];
      }

      const res = await profileApi.updateProfile({ skills: updatedSkills });
      if (res?.data?.user) {
        updateUser(res.data.user);
        setIsSkillModalOpen(false);
        setSkillToEdit(null);
        triggerFeedback('success', skillToEdit ? 'Skill updated successfully!' : 'New skill added successfully!');
      }
    } catch (err) {
      triggerFeedback('error', err.message || 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (indexToDelete) => {
    const target = skills[indexToDelete];
    const confirmDelete = window.confirm(`Are you sure you want to remove '${target.name}' from your skills?`);
    if (!confirmDelete) return;

    setSaving(true);
    try {
      const updatedSkills = skills.filter((_, idx) => idx !== indexToDelete);
      const res = await profileApi.updateProfile({ skills: updatedSkills });
      if (res?.data?.user) {
        updateUser(res.data.user);
        triggerFeedback('success', `Removed skill '${target.name}'.`);
      }
    } catch (err) {
      triggerFeedback('error', err.message || 'Failed to remove skill.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Education Handlers
  const handleOpenAddEdu = () => {
    setEduToEdit(null);
    setIsEduModalOpen(true);
  };

  const handleOpenEditEdu = (edu, index) => {
    setEduToEdit({ ...edu, index });
    setIsEduModalOpen(true);
  };

  const handleSaveEducation = async (eduData) => {
    setSaving(true);
    try {
      let updatedEducation;
      if (eduToEdit !== null && eduToEdit.index !== undefined) {
        // Edit existing education
        updatedEducation = education.map((e, idx) => (idx === eduToEdit.index ? eduData : e));
      } else {
        // Add new education
        updatedEducation = [...education, eduData];
      }

      const res = await profileApi.updateProfile({ education: updatedEducation });
      if (res?.data?.user) {
        updateUser(res.data.user);
        setIsEduModalOpen(false);
        setEduToEdit(null);
        triggerFeedback('success', eduToEdit ? 'Education entry updated!' : 'Education milestone added!');
      }
    } catch (err) {
      triggerFeedback('error', err.message || 'Failed to save education.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (indexToDelete) => {
    const target = education[indexToDelete];
    const confirmDelete = window.confirm(`Are you sure you want to delete '${target.degree}' at ${target.institution}?`);
    if (!confirmDelete) return;

    setSaving(true);
    try {
      const updatedEducation = education.filter((_, idx) => idx !== indexToDelete);
      const res = await profileApi.updateProfile({ education: updatedEducation });
      if (res?.data?.user) {
        updateUser(res.data.user);
        triggerFeedback('success', 'Education record removed.');
      }
    } catch (err) {
      triggerFeedback('error', err.message || 'Failed to remove education.');
    } finally {
      setSaving(false);
    }
  };

  const getTierBadge = (proficiency) => {
    if (proficiency >= 85) return { label: 'Expert', class: 'tier-expert' };
    if (proficiency >= 70) return { label: 'Advanced', class: 'tier-advanced' };
    if (proficiency >= 50) return { label: 'Intermediate', class: 'tier-intermediate' };
    return { label: 'Beginner', class: 'tier-beginner' };
  };

  return (
    <div className="single-dashboard-container">
      {/* Toast Notification */}
      {feedback.message && (
        <div className={`toast-notification toast-${feedback.type}`}>
          <span className="toast-icon">{feedback.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="dashboard-layout">
        {/* ========================================================
            LEFT COLUMN: PROFILE SIDEBAR (Fixed/Sticky on Desktop)
           ======================================================== */}
        <aside className="profile-sidebar-card">
          <div className="sidebar-avatar-wrapper">
            <div className="sidebar-avatar">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'Profile'}
                  className="sidebar-avatar-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="sidebar-avatar-fallback">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <h2 className="sidebar-name">{user?.name || 'User Profile'}</h2>
            <p className="sidebar-headline">
              {user?.headline || <span className="text-muted-italic">No professional headline added</span>}
            </p>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-contact-info">
            <div className="contact-item">
              <span className="contact-icon" title="Email Address">✉️</span>
              <div className="contact-details">
                <span className="contact-label">Email</span>
                <span className="contact-value" title={user?.email}>{user?.email || '—'}</span>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon" title="Phone Number">📞</span>
              <div className="contact-details">
                <span className="contact-label">Phone</span>
                <span className="contact-value">{user?.phone || <span className="text-muted-italic">Not specified</span>}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-bio-section">
            <h4 className="sidebar-section-title">About & Summary</h4>
            <p className="sidebar-bio-text">
              {user?.bio || <span className="text-muted-italic">No personal bio provided yet. Add a short bio to highlight your background and passions.</span>}
            </p>
          </div>

          <div className="sidebar-actions">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsProfileModalOpen(true)}
              id="sidebar-edit-profile-btn"
            >
              <span>✏️</span> Edit Profile
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-block"
              onClick={logout}
              id="sidebar-logout-btn"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* ========================================================
            RIGHT COLUMN: MAIN CONTENT AREA
           ======================================================== */}
        <main className="dashboard-main-content">
          {/* Header Banner */}
          <section className="main-header-banner">
            <div className="header-greeting">
              <h1>Welcome back, {user?.name || 'Professional'}! 👋</h1>
              <p className="header-tagline">
                Manage your credentials, showcase your proficiencies, and track your career milestones.
              </p>
            </div>
            <div className="header-status-badge">
              <span className="status-dot"></span>
              <span>Profile Active</span>
            </div>
          </section>

          {/* KPI Summary Cards */}
          <section className="summary-cards-row">
            {/* 1. Skill Count */}
            <div className="metric-card">
              <div className="metric-icon-box skill-accent">⚡</div>
              <div className="metric-content">
                <span className="metric-label">Technical Skills</span>
                <div className="metric-value">{skillStats.count}</div>
                <span className="metric-subtext">
                  {skillStats.highest ? (
                    <>Top: <strong>{skillStats.highest.name}</strong> ({skillStats.highest.proficiency}%)</>
                  ) : (
                    'No skills recorded'
                  )}
                </span>
              </div>
            </div>

            {/* 2. Education Count */}
            <div className="metric-card">
              <div className="metric-icon-box edu-accent">🎓</div>
              <div className="metric-content">
                <span className="metric-label">Education Milestones</span>
                <div className="metric-value">{education.length}</div>
                <span className="metric-subtext">
                  {latestEducation ? (
                    <>Latest: <strong>{latestEducation.institution}</strong></>
                  ) : (
                    'No education added'
                  )}
                </span>
              </div>
            </div>

            {/* 3. Profile Completion */}
            <div className="metric-card">
              <div className="metric-icon-box completion-accent">📈</div>
              <div className="metric-content">
                <div className="metric-completion-header">
                  <span className="metric-label">Profile Strength</span>
                  <button
                    type="button"
                    className="completion-toggle-btn"
                    onClick={() => setShowCompletionDetails(!showCompletionDetails)}
                    title="View completion breakdown"
                  >
                    {showCompletionDetails ? 'Hide' : 'Breakdown'}
                  </button>
                </div>
                <div className="metric-value">{completionReport.score}%</div>
                <div className="metric-progress-track">
                  <div
                    className="metric-progress-fill"
                    style={{ width: `${completionReport.score}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Expandable Completion Checklist */}
          {showCompletionDetails && (
            <section className="completion-breakdown-card">
              <div className="breakdown-header">
                <h4>Profile Completion Breakdown</h4>
                <span className="text-muted-sm">{completionReport.score}% of 100% completed</span>
              </div>
              <div className="breakdown-grid">
                {completionReport.rules.map((rule) => (
                  <div key={rule.id} className={`breakdown-item ${rule.completed ? 'is-complete' : 'is-missing'}`}>
                    <span className="breakdown-status-icon">{rule.completed ? '✓' : '○'}</span>
                    <span className="breakdown-rule-label">{rule.label}</span>
                    <span className="breakdown-rule-weight">+{rule.weight}%</span>
                  </div>
                ))}
              </div>
              {completionReport.missing.length > 0 && (
                <div className="breakdown-tip">
                  💡 <strong>Suggested Next Step:</strong> Add your {completionReport.missing[0].label.toLowerCase()} to boost your profile strength!
                </div>
              )}
            </section>
          )}

          {/* ========================================================
              SECTION: SKILLS & PROFICIENCY
             ======================================================== */}
          <section className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h2>Skills & Proficiencies</h2>
                <p className="section-card-subtitle">
                  Visual rating of your core technical skills and competencies
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleOpenAddSkill}
                id="add-skill-button"
              >
                + Add Skill
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-state-icon">⚡</div>
                <h3>No Skills Added Yet</h3>
                <p>Highlight your technical toolkit, tools, or domain knowledge with proficiency ratings.</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenAddSkill}>
                  Add Your First Skill
                </button>
              </div>
            ) : (
              <div className="skills-container">
                <div className="skills-chart-list">
                  {skills.map((skill, index) => {
                    const tier = getTierBadge(skill.proficiency);
                    return (
                      <div key={index} className="skill-chart-item">
                        <div className="skill-item-header">
                          <div className="skill-title-group">
                            <span className="skill-name">{skill.name}</span>
                            <span className={`skill-tier-badge ${tier.class}`}>{tier.label}</span>
                          </div>
                          <div className="skill-item-actions">
                            <span className="skill-percentage-text">{skill.proficiency}%</span>
                            <button
                              type="button"
                              className="action-icon-btn"
                              onClick={() => handleOpenEditSkill(skill, index)}
                              title="Edit skill"
                              aria-label={`Edit ${skill.name}`}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn delete-btn"
                              onClick={() => handleDeleteSkill(index)}
                              title="Delete skill"
                              aria-label={`Delete ${skill.name}`}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="skill-bar-track">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${Math.max(4, skill.proficiency)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              SECTION: EDUCATION & QUALIFICATIONS
             ======================================================== */}
          <section className="dashboard-section-card">
            <div className="section-card-header">
              <div>
                <h2>Education & Qualifications</h2>
                <p className="section-card-subtitle">
                  Academic credentials, degrees, and certified programs
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleOpenAddEdu}
                id="add-education-button"
              >
                + Add Education
              </button>
            </div>

            {education.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-state-icon">🎓</div>
                <h3>No Education Records Found</h3>
                <p>Add your degrees, certifications, and educational milestones to complete your profile.</p>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleOpenAddEdu}>
                  Add Education Record
                </button>
              </div>
            ) : (
              <div className="education-timeline">
                {education.map((item, index) => (
                  <div key={index} className="education-timeline-card">
                    <div className="timeline-marker">🎓</div>
                    <div className="timeline-content">
                      <div className="timeline-header-row">
                        <div className="timeline-title-wrap">
                          <h4 className="education-degree">{item.degree}</h4>
                          <h5 className="education-institution">{item.institution}</h5>
                        </div>
                        <div className="timeline-actions">
                          <span className="education-years-badge">
                            {item.startYear} — {item.endYear ? item.endYear : 'Present (Ongoing)'}
                          </span>
                          <button
                            type="button"
                            className="action-icon-btn"
                            onClick={() => handleOpenEditEdu(item, index)}
                            title="Edit education"
                            aria-label={`Edit ${item.degree}`}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn delete-btn"
                            onClick={() => handleDeleteEducation(index)}
                            title="Delete education"
                            aria-label={`Delete ${item.degree}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ========================================================
          MODALS
         ======================================================== */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
        saving={saving}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => {
          setIsSkillModalOpen(false);
          setSkillToEdit(null);
        }}
        skillToEdit={skillToEdit}
        onSave={handleSaveSkill}
        saving={saving}
      />

      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => {
          setIsEduModalOpen(false);
          setEduToEdit(null);
        }}
        eduToEdit={eduToEdit}
        onSave={handleSaveEducation}
        saving={saving}
      />
    </div>
  );
};

export default Dashboard;
