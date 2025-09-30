import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  Security as SecurityIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

interface Platform {
  id: number;
  platformCode: string;
  platformName: string;
  description?: string;
  iconUrl?: string;
  webhookUrl?: string;
  allowedDomains?: string;
  isActive: boolean;
  createdAt: string;
  tokenCount?: number;
}

const PlatformManagement: React.FC = () => {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  
  const [formData, setFormData] = useState({
    platformCode: '',
    platformName: '',
    description: '',
    iconUrl: '',
    webhookUrl: '',
    allowedDomains: ''
  });

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/platform-tokens/platforms');
      setPlatforms(response.data);
    } catch (err) {
      setError('Failed to fetch platforms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenDialog = (platform?: Platform) => {
    if (platform) {
      setEditingPlatform(platform);
      setFormData({
        platformCode: platform.platformCode,
        platformName: platform.platformName,
        description: platform.description || '',
        iconUrl: platform.iconUrl || '',
        webhookUrl: platform.webhookUrl || '',
        allowedDomains: platform.allowedDomains || ''
      });
    } else {
      setEditingPlatform(null);
      setFormData({
        platformCode: '',
        platformName: '',
        description: '',
        iconUrl: '',
        webhookUrl: '',
        allowedDomains: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPlatform(null);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      if (editingPlatform) {
        // Update platform
        await api.put(`/platform-tokens/platforms/${editingPlatform.id}`, formData);
        setSuccess('Platform updated successfully');
      } else {
        // Create new platform
        await api.post('/platform-tokens/platforms', formData);
        setSuccess('Platform created successfully');
      }
      
      fetchPlatforms();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggleActive = async (platform: Platform) => {
    try {
      await api.patch(`/platform-tokens/platforms/${platform.id}/toggle-active`);
      fetchPlatforms();
    } catch (err) {
      setError('Failed to update platform status');
    }
  };

  const handleDelete = async (platform: Platform) => {
    if (!window.confirm(`Are you sure you want to delete platform "${platform.platformName}"?`)) {
      return;
    }

    try {
      await api.delete(`/platform-tokens/platforms/${platform.id}`);
      setSuccess('Platform deleted successfully');
      fetchPlatforms();
    } catch (err) {
      setError('Failed to delete platform');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 2 }} />
          {t('Platform Management')}
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {t('Add Platform')}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {platforms.map((platform) => (
          <Grid item xs={12} md={6} lg={4} key={platform.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={platform.iconUrl}
                      sx={{ mr: 2, bgcolor: 'primary.main' }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {platform.platformName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Code: {platform.platformCode}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={platform.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    label={platform.isActive ? 'Active' : 'Inactive'}
                    color={platform.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {platform.description || 'No description provided'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {platform.webhookUrl && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinkIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption" noWrap sx={{ maxWidth: '80%' }}>
                        {platform.webhookUrl}
                      </Typography>
                    </Box>
                  )}
                  
                  {platform.allowedDomains && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {platform.allowedDomains.split(',').length} allowed domains
                      </Typography>
                    </Box>
                  )}
                  
                  {platform.tokenCount !== undefined && (
                    <Typography variant="caption" color="primary">
                      {platform.tokenCount} active tokens
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={platform.isActive}
                      onChange={() => handleToggleActive(platform)}
                      size="small"
                    />
                  }
                  label={<Typography variant="caption">{t('Active')}</Typography>}
                />
                
                <Box>
                  <Tooltip title={t('Edit')}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(platform)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title={t('Delete')}>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(platform)}
                      disabled={platform.tokenCount && platform.tokenCount > 0}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Platform Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPlatform ? t('Edit Platform') : t('Create New Platform')}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Platform Code')}
                name="platformCode"
                value={formData.platformCode}
                onChange={handleInputChange}
                disabled={!!editingPlatform}
                helperText="Uppercase alphanumeric, 3-20 chars"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Platform Name')}
                name="platformName"
                value={formData.platformName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('Description')}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('Icon URL')}
                name="iconUrl"
                value={formData.iconUrl}
                onChange={handleInputChange}
                helperText="URL to platform icon/logo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('Webhook URL')}
                name="webhookUrl"
                value={formData.webhookUrl}
                onChange={handleInputChange}
                helperText="URL for token event notifications"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('Allowed Domains')}
                name="allowedDomains"
                value={formData.allowedDomains}
                onChange={handleInputChange}
                helperText="Comma-separated list of domains"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPlatform ? t('Update') : t('Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlatformManagement;