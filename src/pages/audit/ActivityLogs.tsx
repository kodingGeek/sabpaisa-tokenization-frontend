import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  Security,
  Person,
  Computer,
  Api
} from '@mui/icons-material';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const ActivityLogs: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const logs: ActivityLog[] = [
    {
      id: '1',
      timestamp: '2024-01-20 10:30:45',
      user: 'admin@techsolutions.com',
      action: 'Token Created',
      resource: 'Token API',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Created token for card ending 4242'
    },
    {
      id: '2',
      timestamp: '2024-01-20 10:28:12',
      user: 'john.doe@techsolutions.com',
      action: 'Login Attempt',
      resource: 'Auth Service',
      ip: '192.168.1.101',
      status: 'failed',
      details: 'Invalid credentials'
    },
    {
      id: '3',
      timestamp: '2024-01-20 10:25:33',
      user: 'system',
      action: 'API Rate Limit',
      resource: 'API Gateway',
      ip: '203.0.113.45',
      status: 'warning',
      details: 'Rate limit exceeded for merchant M12345'
    },
    {
      id: '4',
      timestamp: '2024-01-20 10:22:18',
      user: 'admin@techsolutions.com',
      action: 'Settings Updated',
      resource: 'Merchant Settings',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Updated security settings'
    },
    {
      id: '5',
      timestamp: '2024-01-20 10:20:05',
      user: 'jane.smith@techsolutions.com',
      action: 'Token Deleted',
      resource: 'Token API',
      ip: '192.168.1.102',
      status: 'success',
      details: 'Deleted expired token'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Token')) return <Security sx={{ fontSize: 20 }} />;
    if (action.includes('Login')) return <Person sx={{ fontSize: 20 }} />;
    if (action.includes('API')) return <Api sx={{ fontSize: 20 }} />;
    return <Computer sx={{ fontSize: 20 }} />;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Activity Logs</Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Activity Type</InputLabel>
                <Select
                  value={filterType}
                  label="Activity Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="auth">Authentication</MenuItem>
                  <MenuItem value="token">Token Operations</MenuItem>
                  <MenuItem value="api">API Calls</MenuItem>
                  <MenuItem value="settings">Settings Changes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                fullWidth
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardHeader 
          title="Recent Activity" 
          subheader="All user and system activities are logged for audit purposes"
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getActionIcon(log.action)}
                        {log.action}
                      </Box>
                    </TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {log.ip}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status.toUpperCase()}
                        color={getStatusColor(log.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={logs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityLogs;