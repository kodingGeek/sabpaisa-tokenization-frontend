import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ReportProblem,
  CheckCircle,
  Timer,
  Assignment,
  Group,
  Email,
  Phone,
  Block,
  Security,
  Description,
  AttachFile,
  Send,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Incident {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  type: string;
  assignedTo: string;
  createdAt: string;
  description: string;
  affectedSystems: string[];
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  time: string;
  action: string;
  user: string;
  description: string;
}

const IncidentResponse: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newIncidentData, setNewIncidentData] = useState({
    title: '',
    severity: 'MEDIUM',
    type: '',
    description: '',
  });

  // Mock data
  const incidents: Incident[] = [
    {
      id: 'INC001',
      title: 'Suspicious Token Usage Pattern Detected',
      severity: 'HIGH',
      status: 'INVESTIGATING',
      type: 'FRAUD_DETECTION',
      assignedTo: 'Security Team',
      createdAt: '2024-01-23T10:30:00Z',
      description: 'Multiple tokens showing unusual transaction patterns from different geographic locations.',
      affectedSystems: ['Token Service', 'Transaction API'],
      timeline: [
        {
          time: '10:30 AM',
          action: 'Incident Created',
          user: 'System',
          description: 'Automated detection triggered incident',
        },
        {
          time: '10:35 AM',
          action: 'Investigation Started',
          user: 'John Doe',
          description: 'Security analyst assigned to investigate',
        },
      ],
    },
    {
      id: 'INC002',
      title: 'Potential Data Breach Attempt',
      severity: 'CRITICAL',
      status: 'CONTAINED',
      type: 'DATA_BREACH',
      assignedTo: 'CSIRT',
      createdAt: '2024-01-22T14:15:00Z',
      description: 'Unauthorized access attempts to token vault detected.',
      affectedSystems: ['Token Vault', 'Access Control'],
      timeline: [
        {
          time: '2:15 PM',
          action: 'Breach Detected',
          user: 'IDS System',
          description: 'Intrusion detection system triggered alert',
        },
        {
          time: '2:20 PM',
          action: 'Access Blocked',
          user: 'Auto Response',
          description: 'Suspicious IP addresses blocked',
        },
        {
          time: '2:30 PM',
          action: 'Containment Confirmed',
          user: 'Security Admin',
          description: 'Threat contained, no data exfiltration detected',
        },
      ],
    },
  ];

  const responseSteps = [
    'Detection & Analysis',
    'Containment',
    'Eradication',
    'Recovery',
    'Post-Incident Review',
  ];

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleCreateIncident = () => {
    toast.success('Incident created successfully!');
    setOpenDialog(false);
    setNewIncidentData({
      title: '',
      severity: 'MEDIUM',
      type: '',
      description: '',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'error';
      case 'INVESTIGATING':
        return 'warning';
      case 'CONTAINED':
        return 'info';
      case 'RESOLVED':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <DashboardLayout>
      <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Incident Response</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<ReportProblem />}
          onClick={() => setOpenDialog(true)}
        >
          Report New Incident
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Active Incidents */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Incidents
              </Typography>
              <List>
                {incidents.map((incident, index) => (
                  <React.Fragment key={incident.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      button
                      onClick={() => setSelectedIncident(incident)}
                      selected={selectedIncident?.id === incident.id}
                    >
                      <ListItemIcon>
                        <ReportProblem color={getSeverityColor(incident.severity)} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">{incident.title}</Typography>
                            <Chip 
                              label={incident.severity} 
                              size="small" 
                              color={getSeverityColor(incident.severity)}
                            />
                            <Chip 
                              label={incident.status} 
                              size="small" 
                              color={getStatusColor(incident.status)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              ID: {incident.id} | Type: {incident.type} | 
                              Assigned: {incident.assignedTo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Created: {new Date(incident.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Response Workflow */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Response Workflow
              </Typography>
              <Stepper activeStep={activeStep} orientation="vertical">
                {responseSteps.map((step, index) => (
                  <Step key={step}>
                    <StepLabel onClick={() => handleStepClick(index)}>
                      {step}
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" paragraph>
                        {index === 0 && 'Identify the incident, assess its impact, and gather initial information.'}
                        {index === 1 && 'Isolate affected systems to prevent further damage.'}
                        {index === 2 && 'Remove the threat from the environment.'}
                        {index === 3 && 'Restore systems to normal operation and verify functionality.'}
                        {index === 4 && 'Document lessons learned and update response procedures.'}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={index === responseSteps.length - 1}
                        >
                          Complete Step
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Incident Details */}
        <Grid item xs={12} md={5}>
          {selectedIncident ? (
            <>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Incident Details
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedIncident.description}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Affected Systems
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      {selectedIncident.affectedSystems.map((system) => (
                        <Chip key={system} label={system} size="small" />
                      ))}
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" gap={1}>
                    <Button startIcon={<Block />} variant="outlined" size="small">
                      Isolate Systems
                    </Button>
                    <Button startIcon={<Email />} variant="outlined" size="small">
                      Notify Team
                    </Button>
                    <Button startIcon={<Description />} variant="outlined" size="small">
                      Generate Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Incident Timeline
                  </Typography>
                  <Timeline>
                    {selectedIncident.timeline.map((event, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color={index === 0 ? 'error' : 'primary'}>
                            {index === 0 ? <ReportProblem /> : <CheckCircle />}
                          </TimelineDot>
                          {index < selectedIncident.timeline.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            {event.action}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.time} - {event.user}
                          </Typography>
                          <Typography>{event.description}</Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert severity="info">
              Select an incident from the list to view details
            </Alert>
          )}
        </Grid>
      </Grid>

      {/* Create Incident Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report New Incident</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Incident Title"
              value={newIncidentData.title}
              onChange={(e) => setNewIncidentData({ ...newIncidentData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={newIncidentData.severity}
                    onChange={(e) => setNewIncidentData({ ...newIncidentData, severity: e.target.value })}
                    label="Severity"
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newIncidentData.type}
                    onChange={(e) => setNewIncidentData({ ...newIncidentData, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="FRAUD_DETECTION">Fraud Detection</MenuItem>
                    <MenuItem value="DATA_BREACH">Data Breach</MenuItem>
                    <MenuItem value="SYSTEM_COMPROMISE">System Compromise</MenuItem>
                    <MenuItem value="POLICY_VIOLATION">Policy Violation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={newIncidentData.description}
              onChange={(e) => setNewIncidentData({ ...newIncidentData, description: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateIncident} variant="contained" color="error">
            Create Incident
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default IncidentResponse;