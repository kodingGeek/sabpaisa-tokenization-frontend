import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Download,
  Visibility,
  CheckCircle,
  Warning,
  Schedule,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ComplianceAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const auditTrails = [
    {
      id: '1',
      timestamp: '2024-01-23 10:30:15',
      user: 'admin@sabpaisa.com',
      action: 'USER_LOGIN',
      resource: 'Authentication System',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      details: 'Successful login with 2FA',
    },
    {
      id: '2',
      timestamp: '2024-01-23 10:28:45',
      user: 'merchant@sabpaisa.com',
      action: 'TOKEN_GENERATED',
      resource: 'Token Service',
      ipAddress: '192.168.1.101',
      status: 'SUCCESS',
      details: 'Generated token for card ending 1111',
    },
    {
      id: '3',
      timestamp: '2024-01-23 10:25:30',
      user: 'security@sabpaisa.com',
      action: 'THREAT_BLOCKED',
      resource: 'Security System',
      ipAddress: '10.0.0.50',
      status: 'WARNING',
      details: 'Blocked suspicious IP address',
    },
  ];

  const complianceChecks = [
    { check: 'Data Encryption', status: 'PASSED', lastRun: '2024-01-20', score: 100 },
    { check: 'Access Control', status: 'PASSED', lastRun: '2024-01-20', score: 95 },
    { check: 'Audit Logging', status: 'WARNING', lastRun: '2024-01-19', score: 82 },
    { check: 'Vulnerability Scan', status: 'PASSED', lastRun: '2024-01-18', score: 91 },
    { check: 'Policy Compliance', status: 'FAILED', lastRun: '2024-01-17', score: 65 },
  ];

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
    },
    {
      field: 'user',
      headerName: 'User',
      width: 200,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
    },
    {
      field: 'resource',
      headerName: 'Resource',
      width: 180,
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'SUCCESS' ? 'success' : 'warning'}
        />
      ),
    },
    {
      field: 'details',
      headerName: 'Details',
      width: 250,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'success';
      case 'WARNING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'info';
    }
  };

  return (
    <DashboardLayout>
      <Box>
      <Typography variant="h4" gutterBottom>
        Compliance Audit
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Audit Trails" />
            <Tab label="Compliance Checks" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={activeTab} index={0}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Showing audit trails for the last 24 hours. All actions are logged and immutable.
            </Alert>
            
            <Box style={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={auditTrails}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
              />
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Automated Compliance Checks</Typography>
              <Button variant="contained" startIcon={<Schedule />}>
                Run All Checks
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Compliance Check</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complianceChecks.map((check) => (
                    <TableRow key={check.check}>
                      <TableCell>{check.check}</TableCell>
                      <TableCell>
                        <Chip
                          label={check.status}
                          size="small"
                          color={getStatusColor(check.status)}
                          icon={check.status === 'PASSED' ? <CheckCircle /> : <Warning />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={check.score}
                            sx={{ width: 100, height: 8, borderRadius: 4 }}
                            color={getStatusColor(check.status)}
                          />
                          <Typography variant="body2">{check.score}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{check.lastRun}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Schedule />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Compliance Reports
            </Typography>
            
            <List>
              <ListItem>
                <AssignmentTurnedIn sx={{ mr: 2 }} />
                <ListItemText
                  primary="Monthly Compliance Report - January 2024"
                  secondary="Generated on Jan 31, 2024 • 2.4 MB"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <Download />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <AssignmentTurnedIn sx={{ mr: 2 }} />
                <ListItemText
                  primary="PCI DSS Self-Assessment Questionnaire"
                  secondary="Completed on Jan 15, 2024 • 1.8 MB"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <Download />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <AssignmentTurnedIn sx={{ mr: 2 }} />
                <ListItemText
                  primary="Annual Security Audit Report 2023"
                  secondary="Finalized on Dec 31, 2023 • 5.2 MB"
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <Download />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </TabPanel>
        </CardContent>
      </Card>
      </Box>
    </DashboardLayout>
  );
};

export default ComplianceAudit;