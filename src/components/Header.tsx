import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { Logo } from './Logo';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutRequest } from '../features/slices/auth-slice';
import LogoutIcon from '@mui/icons-material/Logout';

function ResponsiveAppBar() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.currentTarget) {
      dispatch(logoutRequest());
    }
  };

  return (
    <AppBar position="fixed" sx={{ background: '#cf2623' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo />
          <div className="account">
            <Typography variant="h5">Welcome, {user.name}!</Typography>
            <Tooltip title="Logout" placement="top-start">
              <LogoutIcon onClick={handleLogout} />
            </Tooltip>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
