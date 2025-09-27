import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Download,
  Send,
  Visibility,
  Schedule,
  CheckCircle,
  Error,
  Search,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Report {
  id: string;
  reportType: string;
  period: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ACKNOWLEDGED' | 'PENDING';
  generatedDate: string;
  submittedDate: string | null;
  dueDate: string;
  fileSize: string;
}

const RBIReports: React.FC = () => {
  const [reportType, setReportType] = useState('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const reports: Report[] = [
    {
      id: 'RBI001',
      reportType: 'Monthly Transaction Report',
      period: 'January 2024',
      status: 'SUBMITTED',
      generatedDate: '2024-02-01',
      submittedDate: '2024-02-02',
      dueDate: '2024-02-05',
      fileSize: '2.4 MB',
    },
    {
      id: 'RBI002',
      reportType: 'Quarterly Compliance Report',
      period: 'Q4 2023',
      status: 'ACKNOWLEDGED',
      generatedDate: '2024-01-10',
      submittedDate: '2024-01-11',
      dueDate: '2024-01-15',
      fileSize: '5.8 MB',
    },
    {
      id: 'RBI003',
      reportType: 'Annual Security Audit',
      period: '2023',
      status: 'PENDING',
      generatedDate: '2024-01-20',
      submittedDate: null,
      dueDate: '2024-01-31',
      fileSize: '12.3 MB',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACKNOWLEDGED': return 'success';
      case 'SUBMITTED': return 'info';
      case 'PENDING': return 'warning';
      case 'DRAFT': return 'default';
      default: return 'default';
    }
  };

  const handleGenerateReport = () => {
    toast.success('Report generation started. You will be notified when complete.');
  };

  const handleSubmitReport = (reportId: string) => {
    toast.success(`Report ${reportId} submitted to RBI successfully!`);
  };

  return (
    <DashboardLayout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">RBI Reports</Typography>
          <Button variant="contained" startIcon={<Schedule />} onClick={handleGenerateReport}>
            Generate New Report
          </Button>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Reports Due</Typography>
                <Typography variant="h4">3</Typography>
                <Typography variant="body2" color="error">2 overdue</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Submitted</Typography>
                <Typography variant="h4">24</Typography>
                <Typography variant="body2" color="text.secondary">This quarter</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Acknowledged</Typography>
                <Typography variant="h4">22</Typography>
                <Typography variant="body2" color="success.main">91.6% compliance</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Next Due</Typography>
                <Typography variant="h6">Feb 5, 2024</Typography>
                <Typography variant="body2" color="text.secondary">Monthly Report</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Box display="flex" gap={2} mb={3}>
              <TextField
                placeholder="Search reports..."
                size="small"
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="ALL">All Reports</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                  <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                  <MenuItem value="ANNUAL">Annual</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report ID</TableCell>
                    <TableCell>Report Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Generated</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          size="small"
                          color={getStatusColor(report.status)}
                          icon={report.status === 'ACKNOWLEDGED' ? <CheckCircle /> : undefined}
                        />
                      </TableCell>
                      <TableCell>{report.generatedDate}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={new Date(report.dueDate) < new Date() ? 'error' : 'text.primary'}
                        >
                          {report.dueDate}
                        </Typography>
                      </TableCell>
                      <TableCell>{report.fileSize}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" title="View">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" title="Download">
                          <Download />
                        </IconButton>
                        {report.status === 'PENDING' && (
                          <IconButton
                            size="small"
                            title="Submit to RBI"
                            color="primary"
                            onClick={() => handleSubmitReport(report.id)}
                          >
                            <Send />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        </Box>
      </LocalizationProvider>
    </DashboardLayout>
  );
};

export default RBIReports;