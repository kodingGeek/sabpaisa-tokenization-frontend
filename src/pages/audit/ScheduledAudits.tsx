import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  Add,
  Edit,
  Delete,
  CheckCircle,
  PendingActions,
  Warning
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ScheduledAudit {
  id: string;
  title: string;
  type: string;
  frequency: string;
  nextRun: Date;
  lastRun?: Date;
  status: 'active' | 'paused' | 'completed';
  assignee: string;
}

const ScheduledAudits: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [audits, setAudits] = useState<ScheduledAudit[]>([
    {
      id: '1',
      title: 'Monthly Security Compliance Audit',
      type: 'Security',
      frequency: 'Monthly',
      nextRun: new Date('2024-02-01'),
      lastRun: new Date('2024-01-01'),
      status: 'active',
      assignee: 'Security Team'
    },
    {
      id: '2',
      title: 'Quarterly PCI DSS Assessment',
      type: 'Compliance',
      frequency: 'Quarterly',
      nextRun: new Date('2024-03-31'),
      lastRun: new Date('2023-12-31'),
      status: 'active',
      assignee: 'Compliance Team'
    },
    {
      id: '3',
      title: 'Weekly Token Usage Review',
      type: 'Analytics',
      frequency: 'Weekly',
      nextRun: new Date('2024-01-28'),
      lastRun: new Date('2024-01-21'),
      status: 'active',
      assignee: 'Operations Team'
    },
    {
      id: '4',
      title: 'Annual Security Audit',
      type: 'Security',
      frequency: 'Annually',
      nextRun: new Date('2024-06-30'),
      lastRun: new Date('2023-06-30'),
      status: 'paused',
      assignee: 'External Auditor'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'paused': return <Warning />;
      case 'completed': return <PendingActions />;
      default: return null;
    }
  };

  const upcomingAudits = audits
    .filter(audit => audit.status === 'active')
    .sort((a, b) => a.nextRun.getTime() - b.nextRun.getTime())
    .slice(0, 5);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Scheduled Audits</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Schedule New Audit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Audit Calendar" />
            <CardContent>
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Calendar component would be integrated here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Audits */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Upcoming Audits" />
            <CardContent>
              <List>
                {upcomingAudits.map((audit) => (
                  <ListItem key={audit.id} divider>
                    <ListItemIcon>
                      <CalendarToday color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={audit.title}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {audit.nextRun.toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={audit.frequency}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* All Scheduled Audits */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="All Scheduled Audits" />
            <CardContent>
              <Grid container spacing={2}>
                {audits.map((audit) => (
                  <Grid item xs={12} md={6} key={audit.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {audit.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Chip
                                icon={getStatusIcon(audit.status)}
                                label={audit.status.toUpperCase()}
                                color={getStatusColor(audit.status)}
                                size="small"
                              />
                              <Chip
                                label={audit.type}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={audit.frequency}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Assigned to: {audit.assignee}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Next Run: {audit.nextRun.toLocaleDateString()}
                            </Typography>
                            {audit.lastRun && (
                              <Typography variant="body2" color="text.secondary">
                                Last Run: {audit.lastRun.toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schedule New Audit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Audit</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Audit Title"
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Audit Type</InputLabel>
              <Select label="Audit Type">
                <MenuItem value="security">Security Audit</MenuItem>
                <MenuItem value="compliance">Compliance Audit</MenuItem>
                <MenuItem value="performance">Performance Audit</MenuItem>
                <MenuItem value="operational">Operational Audit</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Frequency</InputLabel>
              <Select label="Frequency">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal"
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Assignee"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledAudits;