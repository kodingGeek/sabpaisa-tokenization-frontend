import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import { Security, Lock } from '@mui/icons-material';
import TokenizationForm from '../components/TokenizationForm';
import DetokenizationForm from '../components/DetokenizationForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TokenizationPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SabPaisa Tokenization System
          </Typography>
          <Chip
            label="API: localhost:8082"
            size="small"
            color="success"
            sx={{ bgcolor: 'success.main', color: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="tokenization tabs"
              centered
            >
              <Tab 
                icon={<Security />} 
                label="Tokenize Card" 
                iconPosition="start"
              />
              <Tab 
                icon={<Lock />} 
                label="Verify Token" 
                iconPosition="start"
              />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <TokenizationForm />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <DetokenizationForm />
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            Test Cards: 4111111111111111 (Visa) | 5555555555554444 (Mastercard)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Merchant ID: MERCH001
          </Typography>
        </Box>
      </Container>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default TokenizationPage;