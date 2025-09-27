import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Search,
  FilterList,
  Download,
  CheckCircle,
  Block,
  Delete,
  Create,
  Payment,
  Info,
  Warning,
  Error,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

interface TokenEvent {
  id: string;
  tokenId: string;
  token: string;
  event: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: any;
}

const TokenHistory: React.FC = () => {
  const [view, setView] = useState<'timeline' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Mock data
  const mockEvents: TokenEvent[] = [
    {
      id: '1',
      tokenId: 'tok_1',
      token: 'tok_1234567890abcdef',
      event: 'TOKEN_CREATED',
      description: 'Token created for card ending in 1111',
      timestamp: '2024-01-15T10:00:00Z',
      status: 'success',
      metadata: { cardType: 'VISA', merchant: 'MERCH001' },
    },
    {
      id: '2',
      tokenId: 'tok_1',
      token: 'tok_1234567890abcdef',
      event: 'TOKEN_USED',
      description: 'Token used for transaction amount ₹5,000',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'success',
      metadata: { amount: 5000, currency: 'INR' },
    },
    {
      id: '3',
      tokenId: 'tok_2',
      token: 'tok_2345678901bcdefg',
      event: 'TOKEN_SUSPENDED',
      description: 'Token suspended due to suspicious activity',
      timestamp: '2024-01-16T09:15:00Z',
      status: 'warning',
      metadata: { reason: 'FRAUD_DETECTION' },
    },
    {
      id: '4',
      tokenId: 'tok_3',
      token: 'tok_3456789012cdefgh',
      event: 'TOKEN_DELETED',
      description: 'Token deleted by merchant request',
      timestamp: '2024-01-17T16:45:00Z',
      status: 'error',
      metadata: { deletedBy: 'MERCHANT_API' },
    },
  ];

  const getEventIcon = (event: string, status: string) => {
    switch (event) {
      case 'TOKEN_CREATED':
        return <Create />;
      case 'TOKEN_USED':
        return <Payment />;
      case 'TOKEN_SUSPENDED':
        return <Block />;
      case 'TOKEN_DELETED':
        return <Delete />;
      default:
        switch (status) {
          case 'success':
            return <CheckCircle />;
          case 'warning':
            return <Warning />;
          case 'error':
            return <Error />;
          default:
            return <Info />;
        }
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'token',
      headerName: 'Token',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'event',
      headerName: 'Event',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value.replace('_', ' ')}
          size="small"
          color={getEventColor(params.row.status)}
          variant="outlined"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'metadata',
      headerName: 'Details',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={<pre>{JSON.stringify(params.value, null, 2)}</pre>}>
          <IconButton size="small">
            <Info />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = 
      event.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === 'ALL' || event.event === eventFilter;
    const matchesDateRange = 
      (!startDate || new Date(event.timestamp) >= startDate) &&
      (!endDate || new Date(event.timestamp) <= endDate);
    return matchesSearch && matchesEvent && matchesDateRange;
  });

  return (
    <DashboardLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Token History</Typography>
          <Box>
            <Button
              variant={view === 'table' ? 'contained' : 'outlined'}
              onClick={() => setView('table')}
              sx={{ mr: 1 }}
            >
              Table View
            </Button>
            <Button
              variant={view === 'timeline' ? 'contained' : 'outlined'}
              onClick={() => setView('timeline')}
            >
              Timeline View
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  placeholder="Search by token or description..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    label="Event Type"
                  >
                    <MenuItem value="ALL">All Events</MenuItem>
                    <MenuItem value="TOKEN_CREATED">Created</MenuItem>
                    <MenuItem value="TOKEN_USED">Used</MenuItem>
                    <MenuItem value="TOKEN_SUSPENDED">Suspended</MenuItem>
                    <MenuItem value="TOKEN_DELETED">Deleted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
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

        {view === 'table' ? (
          <Card>
            <Box style={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={filteredEvents}
                columns={columns}
                slots={{
                  toolbar: GridToolbar,
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                  sorting: {
                    sortModel: [{ field: 'timestamp', sort: 'desc' }],
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
              />
            </Box>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Timeline position="alternate">
                {filteredEvents.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent
                      sx={{ m: 'auto 0' }}
                      variant="body2"
                      color="text.secondary"
                    >
                      {new Date(event.timestamp).toLocaleString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                      <TimelineDot color={getEventColor(event.status)}>
                        {getEventIcon(event.event, event.status)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" component="span">
                          {event.event.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {event.token}
                        </Typography>
                        <Typography>{event.description}</Typography>
                        {event.metadata && (
                          <Box mt={1}>
                            {Object.entries(event.metadata).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                sx={{ mr: 1, mt: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        )}
        </Box>
      </LocalizationProvider>
    </DashboardLayout>
  );
};

export default TokenHistory;