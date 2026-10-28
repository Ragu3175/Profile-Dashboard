import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand">
          <span className="brand-badge">PD</span>
          <span className="brand-text">Profile Dashboard</span>
        </Link>

        <nav className="navbar-links">
          {isAuthenticated ? (
            <div className="nav-user-meta">
              <span className="user-greeting">
                <span className="greeting-avatar">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'User'}
                      className="nav-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </span>
                <span className="greeting-name">{user?.name || 'User'}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm"
                id="logout-button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="nav-guest-actions">
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
