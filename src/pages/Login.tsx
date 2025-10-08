import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
  Link,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Zoom,
  Slide,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Security,
  Fingerprint,
  CheckCircle,
  Shield,
  VpnKey,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCredentials, setError, setLoading } from '../store/slices/authSlice';
import { authApi } from '../services/api/auth';
import SecurityBadge from '../components/common/SecurityBadge';
import BackendHealthCheck from '../components/common/BackendHealthCheck';
import tokenizationService from '../services/tokenizationService';
import { toast } from 'react-toastify';

interface LoginForm {
  email: string;
  password: string;
  mfaCode?: string;
  rememberDevice: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  const features = [
    { icon: '🔐', title: 'Standard Tokenization', desc: 'PCI DSS Level 1 Compliant' },
    { icon: '🧬', title: 'Biometric Security', desc: 'Multi-modal Authentication' },
    { icon: '⚛️', title: 'Quantum-Resistant', desc: '50+ Years Protection' },
    { icon: '☁️', title: 'Multi-Cloud', desc: '99.999% Availability' },
    { icon: '🤖', title: 'AI Fraud Detection', desc: 'Real-time Analysis' },
    { icon: '🌐', title: 'Unified API', desc: 'Single Integration' },
  ];

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    watch,
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
      mfaCode: '',
      rememberDevice: false,
    },
  });

  // Security: Auto-focus email field on mount and check backend
  useEffect(() => {
    setFocus('email');
    
    // Check backend connection
    tokenizationService.checkHealth()
      .then(isHealthy => setBackendConnected(isHealthy))
      .catch(() => setBackendConnected(false));
  }, [setFocus]);

  // Security: Check for account lockout
  useEffect(() => {
    const lockedUntil = sessionStorage.getItem('accountLockedUntil');
    if (lockedUntil) {
      const lockTime = parseInt(lockedUntil, 10);
      if (Date.now() < lockTime) {
        setIsLocked(true);
        setLockoutTime(lockTime);
      } else {
        sessionStorage.removeItem('accountLockedUntil');
        sessionStorage.removeItem('loginAttempts');
      }
    }

    const attempts = sessionStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10));
    }
  }, []);

  // Security: Lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
          sessionStorage.removeItem('accountLockedUntil');
          sessionStorage.removeItem('loginAttempts');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || '');
  };

  const onSubmit = async (data: LoginForm) => {
    // Security: Check if account is locked
    if (isLocked) {
      dispatch(setError('Account is temporarily locked due to multiple failed attempts'));
      return;
    }

    // Security: Require CAPTCHA after 2 failed attempts
    if (loginAttempts >= 2 && !captchaToken) {
      dispatch(setError('Please complete the CAPTCHA verification'));
      return;
    }

    dispatch(setLoading(true));

    try {
      if (!mfaRequired) {
        // Step 1: Initial login
        const response = await authApi.login({
          email: data.email,
          password: data.password,
          captchaToken: loginAttempts >= 2 ? captchaToken : undefined,
        });

        if (response.mfaRequired) {
          setMfaRequired(true);
          setMfaToken(response.mfaToken || '');
          setActiveStep(1);
          dispatch(setLoading(false));
          return;
        }

        // Login successful
        setLoginSuccess(true);
        dispatch(setCredentials({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn
        }));
        
        // Reset login attempts
        sessionStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
        
        // Navigate after animation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        // Step 2: MFA verification
        const response = await authApi.verifyMFA({
          mfaToken,
          mfaCode: data.mfaCode!,
          rememberDevice: data.rememberDevice,
        });

        setLoginSuccess(true);
        dispatch(setCredentials({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn
        }));
        
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      }
    } catch (err: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      sessionStorage.setItem('loginAttempts', newAttempts.toString());

      // Security: Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        sessionStorage.setItem('accountLockedUntil', lockUntil.toString());
        setIsLocked(true);
        setLockoutTime(lockUntil);
        dispatch(setError('Account locked for 15 minutes due to multiple failed attempts'));
      } else {
        dispatch(setError(err.response?.data?.message || 'Invalid credentials'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getRemainingLockTime = () => {
    if (!lockoutTime) return '';
    const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const steps = ['Credentials', 'Verification'];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated Background with Features */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            animation: 'rotate 30s linear infinite',
          },
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        {/* Feature Cards Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.1,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${10 + (index % 3) * 35}%`,
                top: `${10 + Math.floor(index / 3) * 40}%`,
                transform: 'translate(-50%, -50%)',
                animation: `float${index % 3} ${15 + index}s ease-in-out infinite`,
                '@keyframes float0': {
                  '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                  '50%': { transform: 'translate(-50%, -50%) translateY(-20px)' },
                },
                '@keyframes float1': {
                  '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                  '50%': { transform: 'translate(-50%, -50%) translateY(-30px)' },
                },
                '@keyframes float2': {
                  '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0px)' },
                  '50%': { transform: 'translate(-50%, -50%) translateY(-25px)' },
                },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                  minWidth: 200,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h2" sx={{ mb: 1 }}>{feature.icon}</Typography>
                <Typography variant="h6" fontWeight="600">{feature.title}</Typography>
                <Typography variant="caption" color="text.secondary">{feature.desc}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
        <Fade in timeout={1000}>
          <Paper
            elevation={24}
            className="animate-fade-in-scale"
            sx={{
              padding: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 4,
              background: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s linear infinite',
              },
            }}
          >
            {/* Success Animation Overlay */}
            {loginSuccess && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  zIndex: 10,
                }}
              >
                <Zoom in={loginSuccess}>
                  <Box textAlign="center">
                    <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" color="success.main">
                      Login Successful!
                    </Typography>
                  </Box>
                </Zoom>
              </Box>
            )}

            {/* Security Badge with Animation */}
            <Zoom in timeout={1200}>
              <Box display="flex" justifyContent="center" mb={4}>
                <Box
                  className="security-glow"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
                    borderRadius: '30px',
                    border: '2px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  }}
                >
                  <Shield sx={{ color: 'primary.main' }} />
                  <Typography variant="body1" fontWeight="600" color="primary.main">
                    Secure Banking Login
                  </Typography>
                </Box>
              </Box>
            </Zoom>

            <Slide direction="up" in timeout={1400}>
              <Box>
                <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="600">
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" mb={4}>
                  SabPaisa Tokenization Platform
                </Typography>
              </Box>
            </Slide>

            {/* Stepper for MFA with Animation */}
            {mfaRequired && (
              <Fade in={mfaRequired}>
                <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Fade>
            )}

            {/* Security Warnings with Animation */}
            <Collapse in={!!error}>
              <Alert 
                severity="error" 
                sx={{ mb: 3 }} 
                onClose={() => dispatch(setError(''))}
                className="animate-bounce"
              >
                {error}
              </Alert>
            </Collapse>

            <Collapse in={isLocked}>
              <Alert severity="warning" sx={{ mb: 3 }} className="animate-pulse">
                Account locked. Try again in: <strong>{getRemainingLockTime()}</strong>
              </Alert>
            </Collapse>

            <Collapse in={loginAttempts > 0 && loginAttempts < 5 && !isLocked}>
              <Alert severity="info" sx={{ mb: 3 }}>
                {5 - loginAttempts} attempt(s) remaining before account lockout
              </Alert>
            </Collapse>

            {/* Backend Connection Status */}
            {backendConnected !== null && (
              <Collapse in={!backendConnected}>
                <Alert 
                  severity="warning" 
                  sx={{ mb: 3 }}
                  action={<BackendHealthCheck />}
                >
                  Backend API is not connected. Using mock authentication.
                </Alert>
              </Collapse>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {!mfaRequired ? (
                <Fade in={!mfaRequired}>
                  <Box>
                    {/* Email Field with Enhanced Styling */}
                    <TextField
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      fullWidth
                      label="Email Address"
                      type="email"
                      autoComplete="username"
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isLocked}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />

                    {/* Password Field with Enhanced Styling */}
                    <TextField
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={isLocked}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={isLocked}
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />

                    {/* CAPTCHA after failed attempts */}
                    {loginAttempts >= 2 && (
                      <Fade in>
                        <Box mt={3} display="flex" justifyContent="center">
                          <Alert severity="info" sx={{ width: '100%' }}>
                            CAPTCHA verification would appear here after 2 failed attempts
                          </Alert>
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Fade>
              ) : (
                <Fade in={mfaRequired}>
                  <Box>
                    {/* MFA Code Field with Animation */}
                    <Alert severity="info" sx={{ mb: 3 }} icon={<VpnKey />}>
                      <Typography variant="body2">
                        Enter the 6-digit code from your authenticator app
                      </Typography>
                    </Alert>

                    <TextField
                      {...register('mfaCode', {
                        required: 'MFA code is required',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: 'MFA code must be 6 digits',
                        },
                      })}
                      fullWidth
                      label="MFA Code"
                      type="text"
                      autoComplete="one-time-code"
                      margin="normal"
                      error={!!errors.mfaCode}
                      helperText={errors.mfaCode?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Fingerprint color="action" />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        maxLength: 6,
                        pattern: '[0-9]*',
                        style: { letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                          },
                        },
                      }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('rememberDevice')}
                          color="primary"
                        />
                      }
                      label="Remember this device for 30 days"
                      sx={{ mt: 2 }}
                    />
                  </Box>
                </Fade>
              )}

              {/* Submit Button with Enhanced Styling */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  }
                }}
                disabled={isLoading || isLocked}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Security />}
                className={!isLoading && !isLocked ? 'hover-lift' : ''}
              >
                {isLoading ? 'Authenticating...' : mfaRequired ? 'Verify' : 'Sign In Securely'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              {/* Links with Hover Effects */}
              <Box display="flex" justifyContent="space-between">
                <Link 
                  href="/forgot-password" 
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  Forgot password?
                </Link>
                <Link 
                  href="/register" 
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                      transform: 'translateX(-2px)',
                    },
                  }}
                >
                  Request access
                </Link>
              </Box>
            </form>

            {/* Security Notice with Enhanced Styling */}
            <Fade in timeout={2000}>
              <Box 
                mt={4} 
                p={2} 
                sx={{
                  background: alpha(theme.palette.warning.main, 0.08),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  <Security fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  This is a secure system. All login attempts are monitored and logged.
                  Unauthorized access attempts will be prosecuted.
                </Typography>
              </Box>
            </Fade>
          </Paper>
        </Fade>
      </Box>
    </Container>
    </Box>
  );
};

export default Login;