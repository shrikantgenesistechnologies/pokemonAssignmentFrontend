import React, { Fragment, useEffect, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Link,
  Autocomplete,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Logo } from '../components/Logo';
import { fetchOrganizations } from '../features/slices/organization-slice';
import { registerRequest } from '../features/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookieHelper';
import Loader from '../components/Loader';

const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = getCookie('id');
  const authToken = getCookie('accessToken');
  const { organizations } = useAppSelector((state) => state.organization);
  const [formData, setFormData] = useState({ organization: '', name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    organization: false,
    name: false,
    email: false,
    password: false,
  });

  useEffect(() => {
    if (authToken) {
      navigate('/dashboard', { replace: true });
      return;
    }
    navigate('/register', { replace: true });
  }, [userId, authToken, navigate]);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

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
      name: !formData.name || formData.name.trim() === '',
      organization: !formData.organization || formData.organization.trim() === '',
      email: !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
      password: !formData.password || formData.password.trim().length < 6,
    };

    setError(newErrors);
    if (!newErrors.organization && !newErrors.email && !newErrors.password) {
      const selectedOrganization = organizations?.find((x) => x.name === formData.organization);
      if (selectedOrganization) {
        dispatch(
          registerRequest({
            registerForm: {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            },
            organizationId: selectedOrganization.id,
            callback: handleNavigation,
          }),
        );
      }
    }
  };

  const handleNavigation = (type: string) => {
    if (type == 'Register Success') {
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
              Register
            </Typography>

            <form>
              <Autocomplete
                sx={{ mb: 4 }}
                disablePortal
                options={organizations?.map((x) => x.name) ?? []}
                value={formData.organization ?? ''}
                size="small"
                onChange={(_event, newValue) => {
                  setFormData((prev) => ({ ...prev, organization: newValue ?? '' }));
                  setError((prev) => ({ ...prev, organization: false }));
                }}
                onBlur={() => {
                  if (!formData.organization || formData.organization.trim() === '') {
                    setError((prev) => ({ ...prev, organization: true }));
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Organization" error={error.organization} />
                )}
              />

              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 4 }}
                error={error.name}
                onBlur={onBlur}
                size="small"
              />

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
                size="small"
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
                onBlur={onBlur}
                error={error.password}
                size="small"
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
                Add
              </Button>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link href="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default RegistrationForm;
