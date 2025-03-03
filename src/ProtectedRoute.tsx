import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import { getCookie } from './utils/cookieHelper';

function ProtectedRoute() {
  const {
    user: { id, token },
  } = useAppSelector((state) => state.user);

  if (!token && !id && !getCookie('authToken') && !getCookie('id')) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
