import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { getCookie } from './utils/cookieHelper';

function ProtectedRoute() {
  const authToken = getCookie('accessToken');
  useEffect(() => {
    if (!authToken) {
      handleRoute();
    }
  }, [authToken]);

  const handleRoute = () => <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
