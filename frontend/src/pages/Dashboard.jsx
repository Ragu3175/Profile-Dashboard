import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Dashboard = () => {
  const { user } = useAuth();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
          <p className="hero-subtitle">
            This is your personal dashboard overview. You can manage your account and update your profile details anytime.
          </p>
          <div className="hero-actions">
            <Link to="/profile" className="btn btn-primary" id="view-profile-btn">
              View & Edit Profile →
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="card-header">
            <h3>Profile Summary</h3>
          </div>
          <div className="card-body">
            <div className="profile-preview">
              <div className="avatar-circle">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar-img" />
                ) : (
                  <span className="avatar-initials">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <h4>{user?.name}</h4>
                <p className="text-muted">{user?.email}</p>
                {user?.phone && <p className="text-muted">📞 {user.phone}</p>}
              </div>
            </div>

            {user?.bio && (
              <div className="bio-snippet">
                <strong>Bio:</strong>
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card stat-card">
          <div className="card-header">
            <h3>Account Details</h3>
          </div>
          <div className="card-body">
            <ul className="details-list">
              <li>
                <span className="detail-label">Status</span>
                <span className="badge badge-success">Active</span>
              </li>
              <li>
                <span className="detail-label">Member Since</span>
                <span className="detail-value">{formattedDate}</span>
              </li>
              <li>
                <span className="detail-label">User ID</span>
                <span className="detail-value text-monospace">{user?.id || '—'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
