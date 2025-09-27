import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  Security,
  VpnKey,
  History,
  Fingerprint,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
} from '@mui/icons-material';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '../layouts/DashboardLayout';

const Profile: React.FC = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+91 9876543210',
    department: 'Information Technology',
    designation: 'Security Administrator',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    mfaEnabled: currentUser?.mfaEnabled || false,
    biometricEnabled: false,
    sessionTimeout: '15',
    ipWhitelisting: true,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setOpenPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const loginHistory = [
    { id: 1, device: 'Chrome on Windows', ip: '192.168.1.100', time: '2024-01-23 10:30 AM', location: 'Mumbai, India' },
    { id: 2, device: 'Safari on MacOS', ip: '192.168.1.101', time: '2024-01-22 03:45 PM', location: 'Mumbai, India' },
    { id: 3, device: 'Chrome on Android', ip: '192.168.1.102', time: '2024-01-21 09:15 AM', location: 'Mumbai, India' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">Profile Information</Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveProfile}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      disabled
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Designation"
                      value={profileData.designation}
                      onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Account Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">User ID</Typography>
                      <Typography variant="body1">{currentUser?.id}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Role</Typography>
                      <Chip label={currentUser?.role.replace('_', ' ')} size="small" color="primary" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Account Created</Typography>
                      <Typography variant="body1">January 1, 2024</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Last Login</Typography>
                      <Typography variant="body1">{new Date(currentUser?.lastLogin || '').toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Enhance security with 2FA"
                    />
                    <Switch
                      checked={securitySettings.mfaEnabled}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, mfaEnabled: e.target.checked })}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Fingerprint />
                    </ListItemIcon>
                    <ListItemText
                      primary="Biometric Authentication"
                      secondary="Use fingerprint or face recognition"
                    />
                    <Switch
                      checked={securitySettings.biometricEnabled}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, biometricEnabled: e.target.checked })}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <VpnKey />
                    </ListItemIcon>
                    <ListItemText
                      primary="Change Password"
                      secondary="Update your account password"
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenPasswordDialog(true)}
                    >
                      Change
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Sidebar */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: 48,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {currentUser?.name.charAt(0)}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                      }}
                      size="small"
                    >
                      <PhotoCamera />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {currentUser?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentUser?.email}
                </Typography>
                <Chip
                  label={currentUser?.role.replace('_', ' ')}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>

            {/* Recent Login Activity */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <History sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Recent Login Activity
                </Typography>
                
                <List dense>
                  {loginHistory.map((login) => (
                    <ListItem key={login.id} disableGutters>
                      <ListItemText
                        primary={login.device}
                        secondary={
                          <>
                            <Typography variant="caption" component="span" display="block">
                              {login.time} • {login.ip}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {login.location}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button fullWidth variant="text" size="small" sx={{ mt: 1 }}>
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Change Password Dialog */}
        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Password must contain at least 8 characters, including uppercase, lowercase, number and special character.
            </Alert>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default Profile;