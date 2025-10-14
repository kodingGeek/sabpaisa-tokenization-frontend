import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security,
  Warning,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MoreVert,
  Assignment
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AuditDashboard: React.FC = () => {
  const auditData = [
    { month: 'Jan', total: 45, passed: 42, failed: 3 },
    { month: 'Feb', total: 52, passed: 48, failed: 4 },
    { month: 'Mar', total: 48, passed: 46, failed: 2 },
    { month: 'Apr', total: 61, passed: 58, failed: 3 },
    { month: 'May', total: 55, passed: 53, failed: 2 },
    { month: 'Jun', total: 67, passed: 65, failed: 2 }
  ];

  const recentAudits = [
    { id: 1, type: 'Security Audit', date: '2024-01-20', status: 'passed', score: 95 },
    { id: 2, type: 'Compliance Check', date: '2024-01-19', status: 'passed', score: 88 },
    { id: 3, type: 'Access Review', date: '2024-01-18', status: 'failed', score: 65 },
    { id: 4, type: 'Data Privacy', date: '2024-01-17', status: 'passed', score: 92 },
    { id: 5, type: 'API Security', date: '2024-01-16', status: 'passed', score: 90 }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Audit Dashboard</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Audits
                  </Typography>
                  <Typography variant="h4">328</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="caption" color="success.main">
                      +12% this month
                    </Typography>
                  </Box>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pass Rate
                  </Typography>
                  <Typography variant="h4">94%</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="caption" color="success.main">
                      +2% improvement
                    </Typography>
                  </Box>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Failed Audits
                  </Typography>
                  <Typography variant="h4">19</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                    <Typography variant="caption" color="error.main">
                      -8% this month
                    </Typography>
                  </Box>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Score
                  </Typography>
                  <Typography variant="h4">87</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Out of 100
                    </Typography>
                  </Box>
                </Box>
                <Security sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Audit Trends Chart */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Audit Trends" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={auditData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Audits" />
              <Line type="monotone" dataKey="passed" stroke="#82ca9d" name="Passed" />
              <Line type="monotone" dataKey="failed" stroke="#ff7043" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Audits Table */}
      <Card>
        <CardHeader 
          title="Recent Audits" 
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Audit Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>{audit.type}</TableCell>
                    <TableCell>{audit.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={audit.status.toUpperCase()}
                        color={audit.status === 'passed' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{audit.score}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={audit.score} 
                            color={audit.score >= 80 ? 'success' : audit.score >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${audit.score}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditDashboard;