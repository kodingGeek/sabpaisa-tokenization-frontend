import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Card,
  CardContent,
  Chip,
  useScrollTrigger,
  Slide,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from '@mui/material';
import {
  Security,
  CloudDone,
  Fingerprint,
  Memory,
  Hub,
  Shield,
  Speed,
  CheckCircle,
  ArrowForward,
  Menu as MenuIcon,
  Close,
  Login as LoginIcon,
  Email,
  Phone,
  LocationOn,
  GitHub,
  LinkedIn,
  Twitter,
} from '@mui/icons-material';
import Login from './Login';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, delay }) => {
  const theme = useTheme();
  
  return (
    <Zoom in timeout={delay}>
      <Card
        sx={{
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color, 0.3)}`,
            borderColor: color,
          },
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.2)} 100%)`,
              color: color,
              fontSize: 40,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h5" gutterBottom fontWeight="600">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const HideOnScroll: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const trigger = useScrollTrigger();
  
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Landing: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const features = [
    {
      icon: <Security />,
      title: 'Standard Tokenization',
      description: 'PCI DSS Level 1 compliant tokenization with format-preserving encryption for seamless integration.',
      color: theme.palette.primary.main,
      delay: 1000,
    },
    {
      icon: <Fingerprint />,
      title: 'Biometric Security',
      description: 'Multi-modal biometric authentication including face, fingerprint, voice, and behavioral patterns.',
      color: theme.palette.success.main,
      delay: 1200,
    },
    {
      icon: <Memory />,
      title: 'Quantum-Resistant',
      description: 'Post-quantum cryptography algorithms providing 50+ years of protection against future threats.',
      color: theme.palette.warning.main,
      delay: 1400,
    },
    {
      icon: <CloudDone />,
      title: 'Multi-Cloud Replication',
      description: 'Automatic replication across AWS, Azure, and GCP for 99.999% availability.',
      color: theme.palette.info.main,
      delay: 1600,
    },
    {
      icon: <Shield />,
      title: 'AI Fraud Detection',
      description: 'Real-time threat analysis with machine learning, processing in under 50ms.',
      color: theme.palette.error.main,
      delay: 1800,
    },
    {
      icon: <Hub />,
      title: 'Unified API',
      description: 'Single integration point for all tokenization modes with seamless mode switching.',
      color: theme.palette.secondary.main,
      delay: 2000,
    },
  ];

  const stats = [
    { value: '10K+', label: 'TPS Capacity' },
    { value: '<100ms', label: 'Token Generation' },
    { value: '99.99%', label: 'Uptime SLA' },
    { value: '50+', label: 'Years Quantum Protection' },
  ];

  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Performance', href: '#performance' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      {/* Navigation */}
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            background: theme.palette.mode === 'dark'
              ? 'rgba(18, 18, 18, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'none',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              SabPaisa Tokenization
            </Typography>
            
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => scrollToSection(item.href)}
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => setLoginDialogOpen(true)}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Close /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Menu */}
      <Slide direction="right" in={mobileMenuOpen} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '80%',
            maxWidth: 300,
            height: '100%',
            zIndex: theme.zIndex.appBar + 1,
            pt: 8,
          }}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} onClick={() => scrollToSection(item.href)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <ListItem button onClick={() => { setMobileMenuOpen(false); setLoginDialogOpen(true); }}>
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          </List>
        </Paper>
      </Slide>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label="Next-Generation Security"
                    color="primary"
                    sx={{ mb: 3, fontWeight: 600 }}
                  />
                  <Typography variant="h2" component="h1" gutterBottom fontWeight="800">
                    Advanced Tokenization Platform
                  </Typography>
                  <Typography variant="h5" color="text.secondary" paragraph>
                    Quantum-ready payment security with biometric authentication and multi-cloud redundancy
                  </Typography>
                  <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 30px rgba(25, 118, 210, 0.4)',
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setLoginDialogOpen(true)}
                      sx={{ py: 1.5, px: 4 }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '400px',
                      height: '400px',
                      background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
                      filter: 'blur(60px)',
                    },
                  }}
                >
                  <Shield sx={{ fontSize: 300, color: alpha(theme.palette.primary.main, 0.8) }} />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, background: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="700" color="primary">
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Fade in timeout={800}>
              <div>
                <Typography variant="h3" component="h2" gutterBottom fontWeight="700">
                  Comprehensive Security Features
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  One platform, multiple layers of protection
                </Typography>
              </div>
            </Fade>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Security Section */}
      <Box id="security" sx={{ py: { xs: 8, md: 12 }, background: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="h3" gutterBottom fontWeight="700">
                    Enterprise-Grade Security
                  </Typography>
                  <List sx={{ mt: 4 }}>
                    {[
                      'PCI DSS Level 1 Certified',
                      'SOC 2 Type II Compliant',
                      'ISO 27001:2013 Certified',
                      'GDPR & RBI Guidelines Ready',
                      'Hardware Security Module (HSM) Integration',
                      'End-to-End Encryption',
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ pl: 0 }}>
                        <ListItemIcon>
                          <CheckCircle color="success" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                    border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography variant="h5" gutterBottom fontWeight="600" color="success.dark">
                    Quantum Readiness Score
                  </Typography>
                  <Typography variant="h2" fontWeight="800" color="success.main" gutterBottom>
                    95%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our platform is built with post-quantum cryptography, ensuring your data remains secure even against future quantum computing threats.
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Performance Section */}
      <Box id="performance" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" gutterBottom fontWeight="700">
              Built for Scale
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Handle millions of transactions with ease
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Speed sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="600">
                  High Performance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  10,000+ transactions per second with sub-100ms latency
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CloudDone sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Global Redundancy
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Multi-region deployment across 3 major cloud providers
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Shield sx={{ fontSize: 60, color: theme.palette.warning.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Always Available
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  99.99% uptime SLA with automatic failover
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: { xs: 8, md: 12 }, background: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom fontWeight="700">
              Get Started Today
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Join leading enterprises in securing their payment infrastructure
            </Typography>
            
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email color="primary" />
                <Typography>sales@sabpaisa.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone color="primary" />
                <Typography>+91-XXXX-XXXXX</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn color="primary" />
                <Typography>Mumbai, India</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <IconButton color="primary">
                <GitHub />
              </IconButton>
              <IconButton color="primary">
                <LinkedIn />
              </IconButton>
              <IconButton color="primary">
                <Twitter />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 SabPaisa Tokenization Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              background: alpha(theme.palette.background.paper, 0.9),
              '&:hover': {
                background: theme.palette.background.paper,
              },
            }}
            onClick={() => setLoginDialogOpen(false)}
          >
            <Close />
          </IconButton>
          <Login />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Landing;