import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Grid,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  ExpandMore,
  Info,
  Warning,
  CheckCircle,
  Schedule,
  Search,
  Gavel,
  Article,
  Update,
  NotificationImportant
} from '@mui/icons-material';

interface RegulatoryUpdate {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  effectiveDate: string;
  description: string;
  impactAreas: string[];
  actionRequired: boolean;
  status: 'implemented' | 'pending' | 'review';
  publishedDate: string;
}

const RegulatoryUpdates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const updates: RegulatoryUpdate[] = [
    {
      id: '1',
      title: 'RBI Updates on Digital Payments Security Standards',
      category: 'Security',
      severity: 'high',
      effectiveDate: '2024-04-01',
      description: 'New guidelines mandating enhanced security measures for digital payment systems including mandatory 2FA for all transactions above Rs. 2000.',
      impactAreas: ['Authentication', 'Transaction Processing', 'API Security'],
      actionRequired: true,
      status: 'pending',
      publishedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'PCI DSS v4.0 Implementation Requirements',
      category: 'Compliance',
      severity: 'high',
      effectiveDate: '2024-03-31',
      description: 'All payment processors must comply with PCI DSS v4.0 standards. Key changes include customized approach for security validation and enhanced reporting.',
      impactAreas: ['Data Security', 'Network Segmentation', 'Vulnerability Management'],
      actionRequired: true,
      status: 'review',
      publishedDate: '2024-01-10'
    },
    {
      id: '3',
      title: 'Data Localization Requirements Update',
      category: 'Data Protection',
      severity: 'medium',
      effectiveDate: '2024-06-01',
      description: 'Updated requirements for storing payment data within Indian borders. Cross-border data transfer restrictions have been clarified.',
      impactAreas: ['Data Storage', 'Cross-border Transactions'],
      actionRequired: false,
      status: 'implemented',
      publishedDate: '2024-01-05'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle color="success" />;
      case 'pending': return <Schedule color="warning" />;
      case 'review': return <Info color="info" />;
      default: return null;
    }
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Regulatory Updates</Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2">
          Stay informed about the latest regulatory changes affecting payment systems. 
          Review and implement required changes before the effective dates.
        </Typography>
      </Alert>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationImportant sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Action Required</Typography>
                  <Typography variant="h4">2</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Updates requiring immediate attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Updates pending implementation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Implemented</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Successfully implemented updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search regulatory updates..."
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
              <TextField
                select
                fullWidth
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="all">All Categories</option>
                <option value="Security">Security</option>
                <option value="Compliance">Compliance</option>
                <option value="Data Protection">Data Protection</option>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Updates List */}
      <Card>
        <CardHeader title="Recent Updates" />
        <CardContent>
          {filteredUpdates.map((update) => (
            <Accordion
              key={update.id}
              expanded={expandedPanel === update.id}
              onChange={handlePanelChange(update.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getStatusIcon(update.status)}
                      <Typography variant="h6">{update.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={update.category} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={update.severity} 
                        size="small" 
                        color={getSeverityColor(update.severity)} 
                      />
                      {update.actionRequired && (
                        <Chip 
                          label="Action Required" 
                          size="small" 
                          color="error" 
                          icon={<Warning />}
                        />
                      )}
                      <Chip 
                        label={`Effective: ${update.effectiveDate}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph>{update.description}</Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Impact Areas:</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {update.impactAreas.map((area, index) => (
                      <Chip key={index} label={area} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button variant="contained" startIcon={<Article />}>
                    View Full Document
                  </Button>
                  <Button variant="outlined" startIcon={<Update />}>
                    Implementation Guide
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegulatoryUpdates;