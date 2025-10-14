import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Upload,
  Alert,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  LinearProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Warning,
  Error,
  Description,
  Business,
  Person,
  AccountBalance,
  VerifiedUser,
  PendingActions,
  Download
} from '@mui/icons-material';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  size: string;
  comments?: string;
}

const KYCVerification: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'PAN Card.pdf',
      type: 'PAN Card',
      status: 'verified',
      uploadDate: '2024-01-15',
      size: '2.5 MB'
    },
    {
      id: '2',
      name: 'GST Certificate.pdf',
      type: 'GST Certificate',
      status: 'pending',
      uploadDate: '2024-01-18',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Bank Statement.pdf',
      type: 'Bank Statement',
      status: 'rejected',
      uploadDate: '2024-01-17',
      size: '3.2 MB',
      comments: 'Document is not clear. Please upload a clearer copy.'
    }
  ]);

  const steps = [
    'Business Information',
    'Document Upload',
    'Verification',
    'Approval'
  ];

  const requiredDocuments = [
    { name: 'PAN Card', required: true, uploaded: true },
    { name: 'GST Certificate', required: true, uploaded: true },
    { name: 'Bank Statement (Last 6 months)', required: true, uploaded: true },
    { name: 'Certificate of Incorporation', required: true, uploaded: false },
    { name: 'Address Proof', required: true, uploaded: false },
    { name: 'Director/Partner ID Proof', required: true, uploaded: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle color="success" />;
      case 'pending':
        return <PendingActions color="warning" />;
      case 'rejected':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>KYC Verification</Typography>
      
      {/* KYC Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* KYC Status Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUser sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">KYC Status</Typography>
                  <Chip label="In Progress" color="warning" />
                </Box>
              </Box>
              <LinearProgress variant="determinate" value={60} sx={{ mb: 1 }} />
              <Typography variant="caption">60% Complete</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Documents</Typography>
                  <Typography variant="h4">3/6</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                3 documents verified, 3 pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PendingActions sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6">Last Updated</Typography>
                  <Typography variant="body2">2 days ago</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Awaiting document review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Document Checklist */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Required Documents" />
        <CardContent>
          <List>
            {requiredDocuments.map((doc, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {doc.uploaded ? <CheckCircle color="success" /> : <Error color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={doc.uploaded ? 'Uploaded' : 'Pending'}
                />
                {!doc.uploaded && (
                  <Button variant="outlined" startIcon={<CloudUpload />} size="small">
                    Upload
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader title="Uploaded Documents" />
        <CardContent>
          <Grid container spacing={2}>
            {documents.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Description sx={{ mr: 2, color: 'action.active' }} />
                      <Box>
                        <Typography variant="subtitle1">{doc.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.type} • {doc.size} • Uploaded on {doc.uploadDate}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            label={doc.status} 
                            color={getStatusColor(doc.status)} 
                            size="small"
                            icon={getStatusIcon(doc.status)}
                          />
                        </Box>
                        {doc.comments && (
                          <Alert severity="error" sx={{ mt: 1 }}>
                            {doc.comments}
                          </Alert>
                        )}
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <Download />
                    </IconButton>
                  </Box>
                  {doc.status === 'rejected' && (
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small" startIcon={<CloudUpload />}>
                        Re-upload
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default KYCVerification;