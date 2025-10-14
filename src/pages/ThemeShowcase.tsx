import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Tooltip,
  Fade,
  Zoom,
  LinearProgress,
  Tab,
  Tabs,
  useTheme,
  alpha
} from '@mui/material';
import {
  Palette as PaletteIcon,
  AutoAwesome as AutoIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Security as SecurityIcon,
  Accessibility as AccessibilityIcon,
  Schedule as TimeIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useAdaptiveTheme, useThemeColors, useThemeTransition } from '../hooks/useAdaptiveTheme';
import AdaptiveThemeSelector from '../components/common/AdaptiveThemeSelector';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const ThemeShowcase: React.FC = () => {
  const theme = useTheme();
  const adaptiveTheme = useAdaptiveTheme();
  const themeColors = useThemeColors();
  const { isTransitioning } = useThemeTransition();
  const [currentTab, setCurrentTab] = useState(0);
  const [demoNotifications, setDemoNotifications] = useState(3);
  
  // Simulate activity data
  const activityData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Tokenization Activity',
        data: [12, 8, 35, 78, 95, 62, 28],
        borderColor: themeColors.primary,
        backgroundColor: alpha(themeColors.primary, 0.1),
        fill: true,
        tension: 0.4
      },
      {
        label: 'Security Events',
        data: [2, 1, 5, 12, 8, 15, 4],
        borderColor: themeColors.secondary,
        backgroundColor: alpha(themeColors.secondary, 0.1),
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  const performanceData = {
    labels: ['Standard', 'Biometric', 'Quantum', 'Cloud', 'Hybrid'],
    datasets: [
      {
        label: 'Success Rate (%)',
        data: [98.5, 97.2, 99.1, 96.8, 99.5],
        backgroundColor: alpha(themeColors.primary, 0.8),
        borderColor: themeColors.primary,
        borderWidth: 2
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary
        }
      }
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: alpha(theme.palette.text.secondary, 0.1) }
      },
      y: {
        ticks: { color: theme.palette.text.secondary },
        grid: { color: alpha(theme.palette.text.secondary, 0.1) }
      }
    }
  };
  
  // Simulate theme recommendation
  useEffect(() => {
    if (adaptiveTheme.shouldSuggestThemeChange && adaptiveTheme.recommendedTheme) {
      // Could show a notification here
      console.log('Theme suggestion:', adaptiveTheme.recommendedTheme);
    }
  }, [adaptiveTheme.shouldSuggestThemeChange, adaptiveTheme.recommendedTheme]);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={!isTransitioning}>
        <Box>
          {/* Header */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 4,
              background: themeColors.gradient || 
                `linear-gradient(135deg, ${alpha(themeColors.primary, 0.1)} 0%, ${alpha(themeColors.secondary, 0.1)} 100%)`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PaletteIcon sx={{ fontSize: 48 }} />
                  Adaptive Theme Showcase
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Experience intelligent theme adaptation based on context, time, and activity
                </Typography>
              </Box>
              <AdaptiveThemeSelector />
            </Box>
            
            {/* Theme Status */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Current Theme</Typography>
                    <Typography variant="h6">{adaptiveTheme.themeName}</Typography>
                    <Chip 
                      size="small" 
                      icon={adaptiveTheme.themeMode === 'dark' ? <DarkIcon /> : <LightIcon />}
                      label={adaptiveTheme.themeMode}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Mode</Typography>
                    <Typography variant="h6">
                      {adaptiveTheme.isAutoMode ? 'Automatic' : 'Manual'}
                    </Typography>
                    <Chip 
                      size="small" 
                      icon={<AutoIcon />} 
                      label={adaptiveTheme.isAutoMode ? 'Active' : 'Inactive'}
                      color={adaptiveTheme.isAutoMode ? 'primary' : 'default'}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Match Score</Typography>
                    <Typography variant="h6">{adaptiveTheme.matchScore}%</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={adaptiveTheme.matchScore} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Special Mode</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {adaptiveTheme.isSecurityElevated && (
                        <Chip size="small" icon={<SecurityIcon />} label="Security" color="warning" />
                      )}
                      {adaptiveTheme.isHighContrast && (
                        <Chip size="small" icon={<AccessibilityIcon />} label="High Contrast" color="info" />
                      )}
                      {!adaptiveTheme.isSecurityElevated && !adaptiveTheme.isHighContrast && (
                        <Typography variant="h6">None</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Tabs */}
          <Paper sx={{ mb: 4 }}>
            <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
              <Tab label="Dashboard" icon={<DashboardIcon />} iconPosition="start" />
              <Tab label="Components" icon={<PaletteIcon />} iconPosition="start" />
              <Tab label="Analytics" icon={<TrendingIcon />} iconPosition="start" />
              <Tab label="Settings" icon={<SecurityIcon />} iconPosition="start" />
            </Tabs>
            
            <TabPanel value={currentTab} index={0}>
              {/* Dashboard Tab */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Quick Stats */}
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4">2,543</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Tokens
                            </Typography>
                          </Box>
                          <CheckIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4">{demoNotifications}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Notifications
                            </Typography>
                          </Box>
                          <NotificationIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="h4">99.8%</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Success Rate
                            </Typography>
                          </Box>
                          <TrendingIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Activity Chart */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Daily Activity</Typography>
                        <Box sx={{ height: 300 }}>
                          <Line data={activityData} options={chartOptions} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            <TabPanel value={currentTab} index={1}>
              {/* Components Tab */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>UI Components</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Buttons</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="contained">Primary</Button>
                        <Button variant="contained" color="secondary">Secondary</Button>
                        <Button variant="outlined">Outlined</Button>
                        <Button>Text</Button>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Alerts</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Alert severity="success" icon={<CheckIcon />}>Success message</Alert>
                        <Alert severity="warning" icon={<WarningIcon />}>Warning message</Alert>
                        <Alert severity="error" icon={<ErrorIcon />}>Error message</Alert>
                        <Alert severity="info" icon={<InfoIcon />}>Info message</Alert>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Interactive Controls</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Switch"
                        />
                        <Button 
                          variant="contained"
                          onClick={() => adaptiveTheme.toggleThemeMode()}
                        >
                          Toggle Theme Mode
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setDemoNotifications(n => n + 1)}
                        >
                          Add Notification
                        </Button>
                        <Button 
                          variant="text"
                          color="error"
                          onClick={() => setDemoNotifications(0)}
                        >
                          Clear Notifications
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            <TabPanel value={currentTab} index={2}>
              {/* Analytics Tab */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Performance Analytics</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Tokenization Success Rate by Type
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <Bar data={performanceData} options={chartOptions} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>Theme Usage</Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon><TimeIcon /></ListItemIcon>
                            <ListItemText 
                              primary="Time-based" 
                              secondary="45% of users"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText 
                              primary="Role-based" 
                              secondary="30% of users"
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                            <ListItemText 
                              primary="Activity-based" 
                              secondary="25% of users"
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            <TabPanel value={currentTab} index={3}>
              {/* Settings Tab */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Theme Settings Demo</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>Quick Actions</Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="Enable Auto Mode" />
                          <Switch 
                            checked={adaptiveTheme.isAutoMode}
                            onChange={() => adaptiveTheme.toggleThemeMode()}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="High Contrast" />
                          <Switch 
                            checked={adaptiveTheme.isHighContrast}
                            onChange={() => adaptiveTheme.isHighContrast 
                              ? adaptiveTheme.disableHighContrast() 
                              : adaptiveTheme.enableHighContrast()
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Force Dark Mode" />
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => adaptiveTheme.enableDarkMode()}
                          >
                            Enable
                          </Button>
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Theme Recommendation
                      </Typography>
                      {adaptiveTheme.recommendedTheme ? (
                        <Alert 
                          severity="info"
                          action={
                            <Button 
                              size="small"
                              onClick={() => adaptiveTheme.selectTheme(adaptiveTheme.recommendedTheme!)}
                            >
                              Apply
                            </Button>
                          }
                        >
                          Based on your current activity, we recommend switching to {adaptiveTheme.recommendedTheme}
                        </Alert>
                      ) : (
                        <Alert severity="success">
                          Your current theme is well-suited for your activity
                        </Alert>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
};

export default ThemeShowcase;