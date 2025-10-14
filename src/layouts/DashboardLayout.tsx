import React, { useState, createContext } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Notifications as NotificationsIcon,
  Dashboard,
  Token,
  Security,
  Assessment,
  People,
  Settings,
  ExitToApp,
  ExpandLess,
  ExpandMore,
  AccountCircle,
  VpnKey,
  Gavel,
  AdminPanelSettings,
  Timeline,
  Storage,
  Lock,
  Business,
  Shield,
  Fingerprint,
  CloudSync,
  Store,
  BusinessCenter,
  AttachMoney,
  Refresh,
  CreditCard,
  Hub,
  Assignment,
  Receipt,
  FactCheck,
  History,
  VerifiedUser,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectCurrentUser, selectUserRole, logout } from '../store/slices/authSlice';
import SecurityIndicator from '../components/common/SecurityIndicator';
import BackendHealthCheck from '../components/common/BackendHealthCheck';
import LanguageSelector from '../components/common/LanguageSelector';
import ThemeSelector from '../components/common/ThemeSelector';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const drawerWidth = 260;
const collapsedDrawerWidth = 60;

// Context to detect nested DashboardLayout
const DashboardLayoutContext = createContext(false);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItemType {
  title: string;
  path: string;
  icon: React.ReactElement;
  role?: string[];
  children?: MenuItemType[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { currentTheme, onThemeChange } = useAppTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = useAppSelector(selectUserRole);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [openMenuItems, setOpenMenuItems] = useState<{ [key: string]: boolean }>({});
  
  // Check if we're already inside a DashboardLayout
  const isNested = React.useContext(DashboardLayoutContext);
  
  // If nested, just return children with proper padding
  if (isNested) {
    return <Box sx={{ p: 3 }}>{children}</Box>;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenuItem = (title: string) => {
    setOpenMenuItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menuItems: MenuItemType[] = [
    {
      title: t('navigation.dashboard'),
      path: '/dashboard',
      icon: <Dashboard />,
    },
    {
      title: 'Merchant Management',
      path: '/merchants',
      icon: <Business />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
      children: [
        { title: 'All Merchants', path: '/merchants', icon: <Business /> },
        { title: 'My Profile', path: '/merchants/profile', icon: <Store /> },
        { title: 'API Configuration', path: '/merchants/api-config', icon: <VpnKey /> },
        { title: 'Platforms', path: '/merchants/platforms', icon: <BusinessCenter /> },
        { title: 'KYC & Verification', path: '/merchants/kyc', icon: <VerifiedUser /> },
        { title: 'Settings', path: '/merchants/settings', icon: <Settings /> },
      ],
    },
    {
      title: 'Tokens',
      path: '/tokens',
      icon: <Token />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
      children: [
        { title: 'Generate Token', path: '/tokens/generate', icon: <VpnKey /> },
        { title: 'Active Tokens', path: '/tokens/active', icon: <Token /> },
        { title: 'Token History', path: '/tokens/history', icon: <History /> },
        { title: 'Unified Tokenization', path: '/tokens/unified', icon: <Hub /> },
        { title: 'Platform Tokens', path: '/tokens/platform', icon: <Business /> },
        { title: 'Bulk Operations', path: '/tokens/bulk', icon: <Refresh /> },
        { title: 'Card View', path: '/tokens/card-view', icon: <CreditCard /> },
      ],
    },
    {
      title: 'Security',
      path: '/security',
      icon: <Security />,
      role: ['SECURITY_OFFICER', 'SYSTEM_ADMIN', 'MERCHANT'],
      children: [
        { title: 'Security Dashboard', path: '/security/dashboard', icon: <Shield /> },
        { title: 'Threat Monitor', path: '/security/threats', icon: <Warning /> },
        { title: 'Fraud Detection', path: '/security/fraud', icon: <Security /> },
        { title: 'Biometric Auth', path: '/security/biometric', icon: <Fingerprint /> },
        { title: 'Quantum Security', path: '/security/quantum', icon: <Shield /> },
        { title: 'Incident Response', path: '/security/incidents', icon: <Lock /> },
      ],
    },
    {
      title: 'Compliance',
      path: '/compliance',
      icon: <Gavel />,
      role: ['COMPLIANCE_OFFICER', 'SYSTEM_ADMIN', 'MERCHANT'],
      children: [
        { title: 'Compliance Dashboard', path: '/compliance/dashboard', icon: <CheckCircle /> },
        { title: 'PCI DSS Status', path: '/compliance/pci-dss', icon: <VerifiedUser /> },
        { title: 'RBI Reports', path: '/compliance/rbi', icon: <Assignment /> },
        { title: 'Regulatory Updates', path: '/compliance/regulations', icon: <Gavel /> },
        { title: 'Certifications', path: '/compliance/certifications', icon: <FactCheck /> },
      ],
    },
    {
      title: 'Audit',
      path: '/audit',
      icon: <Assignment />,
      role: ['COMPLIANCE_OFFICER', 'SYSTEM_ADMIN', 'MERCHANT'],
      children: [
        { title: 'Audit Dashboard', path: '/audit/dashboard', icon: <Assessment /> },
        { title: 'Audit Trails', path: '/audit/trails', icon: <Timeline /> },
        { title: 'Activity Logs', path: '/audit/logs', icon: <History /> },
        { title: 'Reports', path: '/audit/reports', icon: <Assignment /> },
        { title: 'Scheduled Audits', path: '/audit/scheduled', icon: <FactCheck /> },
      ],
    },
    {
      title: 'Billings',
      path: '/billings',
      icon: <Receipt />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
      children: [
        { title: 'Billing Dashboard', path: '/billings/dashboard', icon: <AttachMoney /> },
        { title: 'Invoices', path: '/billings/invoices', icon: <Receipt /> },
        { title: 'Payment History', path: '/billings/payments', icon: <History /> },
        { title: 'Pricing Plans', path: '/billings/plans', icon: <BusinessCenter /> },
        { title: 'Usage Analytics', path: '/billings/usage', icon: <Assessment /> },
      ],
    },
    {
      title: t('navigation.administration'),
      path: '/admin',
      icon: <AdminPanelSettings />,
      role: ['SYSTEM_ADMIN'],
      children: [
        { title: 'User Management', path: '/admin/users', icon: <People /> },
        { title: 'System Config', path: '/admin/config', icon: <Settings /> },
        { title: 'Infrastructure', path: '/admin/infrastructure', icon: <Storage /> },
        { title: 'Cloud Replication', path: '/admin/cloud-replication', icon: <CloudSync /> },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (currentUser?.email === 'superuser@sabpaisa.com') {
      return true;
    }
    return !item.role || item.role.includes(userRole || '');
  });

  const isPathActive = (path: string) => location.pathname.startsWith(path);

  const drawer = (
    <div>
      
      <Box sx={{ p: drawerOpen ? 2 : 1, backgroundColor: 'background.paper' }}>
        <Box display="flex" alignItems="center" justifyContent={drawerOpen ? 'flex-start' : 'center'} mb={1}>
          <Avatar sx={{ mr: drawerOpen ? 1 : 0, width: drawerOpen ? 32 : 28, height: drawerOpen ? 32 : 28 }}>
            {currentUser?.name.charAt(0)}
          </Avatar>
          {drawerOpen && (
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {currentUser?.name}
              </Typography>
              <Chip 
                label={userRole?.replace('_', ' ')} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </Box>
      
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.children) {
                    toggleMenuItem(item.title);
                  } else {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }
                }}
                selected={isPathActive(item.path)}
              >
                <ListItemIcon sx={{ minWidth: drawerOpen ? 56 : 'auto' }}>
                  {item.icon}
                </ListItemIcon>
                {drawerOpen && <ListItemText primary={item.title} />}
                {item.children && (
                  openMenuItems[item.title] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {item.children && (
              <Collapse in={openMenuItems[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        navigate(child.path);
                        if (isMobile) setMobileOpen(false);
                      }}
                      selected={isPathActive(child.path)}
                    >
                      <ListItemIcon sx={{ minWidth: drawerOpen ? 56 : 'auto' }}>
                        {child.icon}
                      </ListItemIcon>
                      {drawerOpen && <ListItemText primary={child.title} />}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <SecurityIndicator />
      </Box>
    </div>
  );

  return (
    <DashboardLayoutContext.Provider value={true}>
      <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={() => isMobile ? handleDrawerToggle() : setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            
            <Lock sx={{ mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ mr: 4 }}>
              {t('app.title')}
            </Typography>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {location.pathname === '/dashboard' ? t('navigation.dashboard') : 
               location.pathname.split('/').filter(Boolean).map(s => 
                 s.charAt(0).toUpperCase() + s.slice(1)
               ).join(' > ')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageSelector />
              <ThemeSelector 
                currentTheme={currentTheme} 
                onThemeChange={onThemeChange} 
              />
              <BackendHealthCheck />
              
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                size="large"
                edge="end"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
      
      {/* Left Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="left"
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(isMobile ? {} : {
              marginTop: '64px', // Height of AppBar
              height: 'calc(100% - 64px)',
            }),
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar /> {/* This adds space for the fixed AppBar */}
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        
        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}{new Date().getFullYear()} SabPaisa Tokenization Platform. All rights reserved.
          </Typography>
        </Box>
      </Box>
      
      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <MenuItem>
          <Typography variant="body2">
            <strong>Security Alert:</strong> Unusual login pattern detected
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="body2">
            <strong>System:</strong> Maintenance scheduled for Sunday
          </Typography>
        </MenuItem>
      </Menu>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
          {t('app.profile')}
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          {t('app.settings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><ExitToApp fontSize="small" /></ListItemIcon>
          {t('app.logout')}
        </MenuItem>
      </Menu>
    </Box>
    </DashboardLayoutContext.Provider>
  );
};

export default DashboardLayout;