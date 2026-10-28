import { Navigate } from 'react-router-dom';

/**
 * The Profile view is now integrated into the single-page Professional Profile Dashboard.
 * Redirects to /dashboard to preserve direct bookmark/link compatibility.
 */
export const Profile = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Profile;
