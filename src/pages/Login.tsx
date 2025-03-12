import React, { Fragment, useEffect, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Link,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Logo } from '../components/Logo';
import { useAppDispatch } from '../store/hooks';
import { loginRequest } from '../features/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookieHelper';
import Loader from '../components/Loader';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = getCookie('id');
  const authToken = getCookie('accessToken');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (authToken) {
      navigate('/dashboard', { replace: true });
      return;
    }
    navigate('/login', { replace: true });
  }, [authToken, userId, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError((prev) => ({ ...prev, [name]: false }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    let newError = false;

    if (trimmedValue === '') {
      newError = true;
    } else {
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newError = !emailRegex.test(trimmedValue);
      } else if (name === 'password') {
        newError = trimmedValue.length < 6;
      }
    }
    setError((prev) => ({ ...prev, [name]: newError }));
    setFormData((prev) => ({ ...prev, [name]: trimmedValue }));
  };

  const onSubmit = () => {
    const newErrors = {
      email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
      password: !formData.password || formData.password.trim().length < 6,
    };

    setError(newErrors);
    if (!newErrors.email && !newErrors.password) {
      dispatch(
        loginRequest({
          loginForm: formData,
          callback: handleNavigation,
        }),
      );
    }
  };

  const handleNavigation = (type: string) => {
    if (type == 'Login Success') {
      navigate('/dashboard', { replace: true });
      return;
    }
  };

  return (
    <Fragment>
      {userId && <Loader />}
      {!userId && (
        <Box className="forms-wrapper">
          <Box
            sx={{
              width: 500,
              mx: 'auto',
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Logo />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Login
            </Typography>

            <form>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 4 }}
                error={error.email}
                onBlur={onBlur}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 4 }}
                error={error.password}
                onBlur={onBlur}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                onClick={onSubmit}
              >
                Login
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Please create a account?{' '}
              <Link href="/register" underline="hover">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default LoginForm;
