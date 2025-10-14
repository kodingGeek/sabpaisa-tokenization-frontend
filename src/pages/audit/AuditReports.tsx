import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Download,
  Share,
  MoreVert,
  PictureAsPdf,
  Description,
  TableChart,
  Search,
  CalendarToday,
  Assessment
} from '@mui/icons-material';

interface AuditReport {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  period: string;
  status: 'completed' | 'processing' | 'scheduled';
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

const AuditReports: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const reports: AuditReport[] = [
    {
      id: '1',
      name: 'Monthly Security Audit Report',
      type: 'Security',
      generatedDate: '2024-01-15',
      period: 'January 2024',
      status: 'completed',
      size: '2.4 MB',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'PCI Compliance Report Q4 2023',
      type: 'Compliance',
      generatedDate: '2024-01-10',
      period: 'Q4 2023',
      status: 'completed',
      size: '3.1 MB',
      format: 'pdf'
    },
    {
      id: '3',
      name: 'Token Usage Analytics',
      type: 'Analytics',
      generatedDate: '2024-01-20',
      period: 'Last 30 days',
      status: 'processing',
      size: '-',
      format: 'excel'
    },
    {
      id: '4',
      name: 'Access Control Audit',
      type: 'Security',
      generatedDate: '2024-01-18',
      period: 'January 2024',
      status: 'completed',
      size: '1.8 MB',
      format: 'csv'
    },
    {
      id: '5',
      name: 'Annual Compliance Summary',
      type: 'Compliance',
      generatedDate: '2024-02-01',
      period: 'Year 2023',
      status: 'scheduled',
      size: '-',
      format: 'pdf'
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'excel': return <TableChart color="success" />;
      case 'csv': return <Description color="primary" />;
      default: return <Description />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Audit Reports</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Reports</Typography>
                  <Typography variant="h4">24</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Generated this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Scheduled</Typography>
                  <Typography variant="h4">3</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Upcoming reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Download sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Downloads</Typography>
                  <Typography variant="h4">156</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Generate */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search reports..."
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
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Assessment />}
              >
                Generate New Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader title="Available Reports" />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Generated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getFormatIcon(report.format)}
                        <Typography variant="body2">{report.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status.toUpperCase()}
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {report.status === 'completed' && (
                          <>
                            <IconButton size="small">
                              <Download />
                            </IconButton>
                            <IconButton size="small">
                              <Share />
                            </IconButton>
                          </>
                        )}
                        <IconButton 
                          size="small"
                          onClick={(e) => handleMenuOpen(e, report.id)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Schedule</MenuItem>
        <MenuItem onClick={handleMenuClose}>Share</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default AuditReports;