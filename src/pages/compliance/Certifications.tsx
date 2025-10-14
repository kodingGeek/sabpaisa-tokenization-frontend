import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Alert
} from '@mui/material';
import {
  VerifiedUser,
  CheckCircle,
  Schedule,
  Warning,
  Download,
  Refresh,
  CalendarToday,
  Assignment
} from '@mui/icons-material';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: 'active' | 'expiring' | 'expired' | 'pending';
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  scope: string[];
  complianceScore: number;
}

const Certifications: React.FC = () => {
  const certifications: Certification[] = [
    {
      id: '1',
      name: 'PCI DSS Level 1',
      issuer: 'Payment Card Industry Security Standards Council',
      status: 'active',
      issueDate: '2023-06-15',
      expiryDate: '2024-06-14',
      certificateNumber: 'PCI-2023-12345',
      scope: ['Card Data Security', 'Network Security', 'Access Control'],
      complianceScore: 98
    },
    {
      id: '2',
      name: 'ISO 27001:2013',
      issuer: 'International Organization for Standardization',
      status: 'active',
      issueDate: '2023-03-10',
      expiryDate: '2026-03-09',
      certificateNumber: 'ISO-27001-2023-5678',
      scope: ['Information Security Management', 'Risk Management'],
      complianceScore: 95
    },
    {
      id: '3',
      name: 'SOC 2 Type II',
      issuer: 'AICPA',
      status: 'expiring',
      issueDate: '2023-01-20',
      expiryDate: '2024-01-19',
      certificateNumber: 'SOC2-2023-9012',
      scope: ['Security', 'Availability', 'Confidentiality'],
      complianceScore: 92
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expiring': return 'warning';
      case 'expired': return 'error';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'expiring': return <Warning />;
      case 'expired': return <Warning />;
      case 'pending': return <Schedule />;
      default: return null;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Compliance Certifications</Typography>
      
      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h4">3</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Active certifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Compliant</Typography>
                  <Typography variant="h4">2</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Fully compliant
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Expiring</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Expiring soon
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Score</Typography>
                  <Typography variant="h4">95%</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Average compliance score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Certifications List */}
      <Grid container spacing={3}>
        {certifications.map((cert) => (
          <Grid item xs={12} md={6} key={cert.id}>
            <Card>
              <CardHeader
                title={cert.name}
                subheader={cert.issuer}
                action={
                  <Chip
                    icon={getStatusIcon(cert.status)}
                    label={cert.status.toUpperCase()}
                    color={getStatusColor(cert.status)}
                    size="small"
                  />
                }
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Certificate Number: {cert.certificateNumber}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'action.active' }} />
                        <Typography variant="caption">
                          Issued: {cert.issueDate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'action.active' }} />
                        <Typography variant="caption">
                          Expires: {cert.expiryDate}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Compliance Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={cert.complianceScore} 
                        color={getComplianceColor(cert.complianceScore)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2">{cert.complianceScore}%</Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Scope</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {cert.scope.map((item, index) => (
                      <Chip key={index} label={item} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                {cert.status === 'expiring' && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This certification expires soon. Please initiate renewal process.
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Download />}
                  >
                    Download Certificate
                  </Button>
                  {cert.status === 'expiring' && (
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Refresh />}
                      color="warning"
                    >
                      Renew
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Compliance Requirements */}
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Compliance Requirements" />
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Annual Security Assessment"
                secondary="Last completed: March 2023 | Next due: March 2024"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Quarterly Vulnerability Scans"
                secondary="Last completed: December 2023 | Next due: March 2024"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Penetration Testing"
                secondary="Last completed: June 2023 | Next due: January 2024 - Overdue"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Security Awareness Training"
                secondary="All staff completed as of December 2023"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Certifications;