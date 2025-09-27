import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Security,
  Assessment,
  Schedule,
  Description,
} from '@mui/icons-material';

interface ComplianceItem {
  requirement: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
  description: string;
  lastChecked: string;
}

const PCIDSSStatus: React.FC = () => {
  const overallCompliance = 87;

  const complianceItems: ComplianceItem[] = [
    {
      requirement: 'Build and Maintain a Secure Network',
      status: 'COMPLIANT',
      description: 'Firewall configuration standards met',
      lastChecked: '2024-01-20',
    },
    {
      requirement: 'Protect Cardholder Data',
      status: 'COMPLIANT',
      description: 'Encryption at rest and in transit implemented',
      lastChecked: '2024-01-20',
    },
    {
      requirement: 'Maintain a Vulnerability Management Program',
      status: 'PARTIAL',
      description: 'Quarterly scans pending completion',
      lastChecked: '2024-01-15',
    },
    {
      requirement: 'Implement Strong Access Control Measures',
      status: 'COMPLIANT',
      description: 'RBAC and MFA fully implemented',
      lastChecked: '2024-01-20',
    },
    {
      requirement: 'Regularly Monitor and Test Networks',
      status: 'COMPLIANT',
      description: 'Continuous monitoring active',
      lastChecked: '2024-01-20',
    },
    {
      requirement: 'Maintain an Information Security Policy',
      status: 'PARTIAL',
      description: 'Policy review pending approval',
      lastChecked: '2024-01-10',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return <CheckCircle color="success" />;
      case 'PARTIAL': return <Warning color="warning" />;
      case 'NON_COMPLIANT': return <Error color="error" />;
      default: return null;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <DashboardLayout>
      <Box>
      <Typography variant="h4" gutterBottom>
        PCI DSS Compliance Status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Overall Compliance Score</Typography>
                <Chip 
                  label={`Level ${overallCompliance >= 90 ? '1' : '2'} Compliant`}
                  color={getComplianceColor(overallCompliance)}
                />
              </Box>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Compliance Progress</Typography>
                  <Typography variant="h6">{overallCompliance}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={overallCompliance} 
                  color={getComplianceColor(overallCompliance)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Next assessment due: February 28, 2024
              </Alert>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                PCI DSS Requirements Status
              </Typography>
              <List>
                {complianceItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(item.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.requirement}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {item.description}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Last checked: {item.lastChecked}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={item.status.replace('_', ' ')}
                        size="small"
                        color={
                          item.status === 'COMPLIANT' ? 'success' :
                          item.status === 'PARTIAL' ? 'warning' : 'error'
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Compliant Requirements" />
                  <Typography variant="h6" color="success.main">4</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Partial Compliance" />
                  <Typography variant="h6" color="warning.main">2</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Non-Compliant" />
                  <Typography variant="h6" color="error.main">0</Typography>
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Assessment />}
                  size="small"
                >
                  Run Self-Assessment
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Schedule />}
                  size="small"
                >
                  Schedule Audit
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<Description />}
                  size="small"
                >
                  View Full Report
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Updates
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <ListItemText
                    primary="Security Policy Updated"
                    secondary="2 days ago"
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary="Vulnerability Scan Completed"
                    secondary="5 days ago"
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary="Access Controls Reviewed"
                    secondary="1 week ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default PCIDSSStatus;