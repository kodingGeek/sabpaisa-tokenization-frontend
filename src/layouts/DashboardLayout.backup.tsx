import React, { useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
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
  ChevronLeft,
  ChevronRight,
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
  const [miniDrawer, setMiniDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [openMenuItems, setOpenMenuItems] = useState<{ [key: string]: boolean }>({});

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
      title: t('navigation.tokenManagement'),
      path: '/merchant/tokens',
      icon: <Token />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
      children: [
        { title: t('navigation.generateToken'), path: '/merchant/tokens/generate', icon: <VpnKey /> },
        { title: t('navigation.activeTokens'), path: '/merchant/tokens/active', icon: <Token /> },
        { title: t('navigation.tokenHistory'), path: '/merchant/tokens/history', icon: <Timeline /> },
      ],
    },
    {
      title: t('navigation.merchantManagement'),
      path: '/merchant/management',
      icon: <Store />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
    },
    {
      title: t('navigation.securityCenter'),
      path: '/security',
      icon: <Security />,
      role: ['SECURITY_OFFICER', 'SYSTEM_ADMIN'],
      children: [
        { title: 'Threat Monitor', path: '/security/threats', icon: <Security /> },
        { title: 'Incident Response', path: '/security/incidents', icon: <Lock /> },
        { title: 'Security Analytics', path: '/security/analytics', icon: <Assessment /> },
        { title: 'Fraud Detection', path: '/security/fraud-detection', icon: <Security /> },
        { title: 'Quantum Security', path: '/security/quantum-security', icon: <Shield /> },
        { title: 'Biometric Auth', path: '/security/biometric-auth', icon: <Fingerprint /> },
      ],
    },
    {
      title: t('navigation.compliance'),
      path: '/compliance',
      icon: <Gavel />,
      role: ['COMPLIANCE_OFFICER', 'SYSTEM_ADMIN'],
      children: [
        { title: 'RBI Reports', path: '/compliance/rbi', icon: <Assessment /> },
        { title: 'PCI DSS Status', path: '/compliance/pci', icon: <Security /> },
        { title: 'Audit Trails', path: '/compliance/audit', icon: <Timeline /> },
      ],
    },
    {
      title: t('navigation.administration'),
      path: '/admin',
      icon: <AdminPanelSettings />,
      role: ['SYSTEM_ADMIN'],
      children: [
        { title: 'User Management', path: '/admin/users', icon: <People /> },
        { title: 'Merchant Management', path: '/admin/merchants', icon: <Business /> },
        { title: 'System Config', path: '/admin/config', icon: <Settings /> },
        { title: 'Infrastructure', path: '/admin/infrastructure', icon: <Storage /> },
        { title: 'Cloud Replication', path: '/admin/cloud-replication', icon: <CloudSync /> },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    // Super user can see all menu items
    if (currentUser?.email === 'superuser@sabpaisa.com') {
      return true;
    }
    // Other users see items based on their role
    return !item.role || item.role.includes(userRole || '');
  });

  const isPathActive = (path: string) => location.pathname.startsWith(path);

  const drawer = (
    <div>
      <Toolbar sx={{ 
        backgroundColor: 'primary.main', 
        color: 'white',
        minHeight: { xs: 56, sm: 64 },
        px: { xs: 2, sm: 3 }
      }}>
        <Lock sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap fontWeight="bold">
          {t('app.title')}
        </Typography>
      </Toolbar>
      <Divider />
      
      {/* User Info */}
      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
            {currentUser?.name.charAt(0)}
          </Avatar>
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
        </Box>
      </Box>
      
      <Divider />
      
      {/* Menu Items */}
      <List>
        {filteredMenuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.children && !(miniDrawer && !isMobile)) {
                    toggleMenuItem(item.title);
                  } else {
                    navigate(item.path);
                    // Don't close drawer for desktop users
                    if (isMobile) setMobileOpen(false);
                  }
                }}
                selected={isPathActive(item.path)}
              >
                <ListItemIcon>
                  <Tooltip title={miniDrawer && !isMobile ? item.title : ''} placement="right">
                    <span>{item.icon}</span>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  sx={{ 
                    opacity: miniDrawer && !isMobile ? 0 : 1,
                    transition: theme.transitions.create('opacity'),
                  }}
                />
                {item.children && !(miniDrawer && !isMobile) && (
                  openMenuItems[item.title] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {item.children && !(miniDrawer && !isMobile) && (
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
                      <ListItemIcon>
                        <Tooltip title={miniDrawer && !isMobile ? child.title : ''} placement="right">
                          <span>{child.icon}</span>
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText 
                        primary={child.title}
                        sx={{ 
                          opacity: miniDrawer && !isMobile ? 0 : 1,
                          transition: theme.transitions.create('opacity'),
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider />
      
      {/* Security Indicator */}
      <Box sx={{ p: 2 }}>
        <SecurityIndicator />
      </Box>
      
      {/* Mini Drawer Toggle */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        <Tooltip title={miniDrawer ? "Expand menu" : "Collapse menu"} placement="top">
          <IconButton 
            size="small"
            onClick={() => setMiniDrawer(!miniDrawer)}
            sx={{ 
              backgroundColor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            {miniDrawer ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: '100%', md: `calc(100% - ${drawerWidth}px)` },
          left: 0,
          right: { md: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname === '/dashboard' ? t('navigation.dashboard') : 
             location.pathname.split('/').filter(Boolean).map(s => 
               s.charAt(0).toUpperCase() + s.slice(1)
             ).join(' > ')}
          </Typography>
          
          {/* Mobile Menu Button - moved to the end */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Right side toolbar items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Selector */}
            <ThemeSelector 
              currentTheme={currentTheme} 
              onThemeChange={onThemeChange} 
            />
            
            {/* Backend Health Check */}
            <BackendHealthCheck />

          {/* Notifications */}
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          
            {/* Profile Menu */}
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
      
      {/* Drawer - Right Side */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor="right"
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            borderLeft: 1,
            borderColor: 'divider',
            boxShadow: theme.shadows[3],
            width: miniDrawer && !isMobile ? 70 : drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
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
          p: { xs: 2, sm: 3 },
          width: '100%',
          marginRight: { md: miniDrawer ? 70 : drawerWidth },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Container maxWidth={false} sx={{ maxWidth: '1600px', ml: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;