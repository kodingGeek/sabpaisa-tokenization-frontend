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
  Store,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectCurrentUser, selectUserRole, logout } from '../store/slices/authSlice';
import SecurityIndicator from '../components/common/SecurityIndicator';
import BackendHealthCheck from '../components/common/BackendHealthCheck';

const drawerWidth = 280;

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const currentUser = useAppSelector(selectCurrentUser);
  const userRole = useAppSelector(selectUserRole);
  
  const [mobileOpen, setMobileOpen] = useState(false);
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
      title: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    },
    {
      title: 'Token Management',
      path: '/merchant/tokens',
      icon: <Token />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
      children: [
        { title: 'Generate Token', path: '/merchant/tokens/generate', icon: <VpnKey /> },
        { title: 'Active Tokens', path: '/merchant/tokens/active', icon: <Token /> },
        { title: 'Token History', path: '/merchant/tokens/history', icon: <Timeline /> },
      ],
    },
    {
      title: 'Merchant Management',
      path: '/merchant/management',
      icon: <Store />,
      role: ['MERCHANT', 'SYSTEM_ADMIN'],
    },
    {
      title: 'Security Center',
      path: '/security',
      icon: <Security />,
      role: ['SECURITY_OFFICER', 'SYSTEM_ADMIN'],
      children: [
        { title: 'Threat Monitor', path: '/security/threats', icon: <Security /> },
        { title: 'Incident Response', path: '/security/incidents', icon: <Lock /> },
        { title: 'Security Analytics', path: '/security/analytics', icon: <Assessment /> },
      ],
    },
    {
      title: 'Compliance',
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
      title: 'Administration',
      path: '/admin',
      icon: <AdminPanelSettings />,
      role: ['SYSTEM_ADMIN'],
      children: [
        { title: 'User Management', path: '/admin/users', icon: <People /> },
        { title: 'Merchant Management', path: '/admin/merchants', icon: <Business /> },
        { title: 'System Config', path: '/admin/config', icon: <Settings /> },
        { title: 'Infrastructure', path: '/admin/infrastructure', icon: <Storage /> },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.role || item.role.includes(userRole || '')
  );

  const isPathActive = (path: string) => location.pathname.startsWith(path);

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Lock sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          SabPaisa Tokenization
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
                  if (item.children) {
                    toggleMenuItem(item.title);
                  } else {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }
                }}
                selected={isPathActive(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
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
                      <ListItemIcon>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.title} />
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
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname === '/dashboard' ? 'Dashboard' : 
             location.pathname.split('/').filter(Boolean).map(s => 
               s.charAt(0).toUpperCase() + s.slice(1)
             ).join(' > ')}
          </Typography>

          {/* Backend Health Check */}
          <Box sx={{ mr: 2 }}>
            <BackendHealthCheck />
          </Box>

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
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><ExitToApp fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;