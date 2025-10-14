import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Check,
  Star,
  Business,
  CloudUpload,
  Security,
  Support
} from '@mui/icons-material';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    tokensPerMonth: string;
    apiCalls: string;
    storage: string;
    support: string;
  };
  popular?: boolean;
  current?: boolean;
}

const PricingPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses and startups',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      features: [
        '10,000 tokens per month',
        '100,000 API calls',
        'Basic fraud detection',
        '5GB storage',
        'Email support',
        'Standard security'
      ],
      limits: {
        tokensPerMonth: '10,000',
        apiCalls: '100,000',
        storage: '5GB',
        support: 'Email'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 2999,
      yearlyPrice: 29990,
      features: [
        '50,000 tokens per month',
        '500,000 API calls',
        'Advanced fraud detection',
        '25GB storage',
        'Priority email support',
        'Enhanced security',
        'Custom webhooks',
        'Analytics dashboard'
      ],
      limits: {
        tokensPerMonth: '50,000',
        apiCalls: '500,000',
        storage: '25GB',
        support: 'Priority Email'
      },
      popular: true,
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: 9999,
      yearlyPrice: 99990,
      features: [
        'Unlimited tokens',
        'Unlimited API calls',
        'AI-powered fraud detection',
        'Unlimited storage',
        '24/7 phone support',
        'Enterprise security',
        'Custom integrations',
        'Advanced analytics',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      limits: {
        tokensPerMonth: 'Unlimited',
        apiCalls: 'Unlimited',
        storage: 'Unlimited',
        support: '24/7 Phone'
      }
    }
  ];

  const handleUpgrade = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setUpgradeDialog(true);
  };

  const getPrice = (plan: PricingPlan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    return monthlyCost - plan.yearlyPrice;
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Pricing Plans</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Choose the perfect plan for your tokenization needs
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
              />
            }
            label="Pay Yearly (Save up to 17%)"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.popular ? '2px solid' : '1px solid',
                borderColor: plan.popular ? 'primary.main' : 'divider'
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  icon={<Star />}
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
              )}
              
              {plan.current && (
                <Chip
                  label="Current Plan"
                  color="success"
                  sx={{
                    position: 'absolute',
                    top: plan.popular ? 20 : -10,
                    right: 16
                  }}
                />
              )}

              <CardHeader
                title={plan.name}
                subheader={plan.description}
                sx={{ textAlign: 'center', pb: 1 }}
              />
              
              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    ₹{getPrice(plan).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isYearly ? 'per year' : 'per month'}
                  </Typography>
                  {isYearly && getSavings(plan) > 0 && (
                    <Typography variant="caption" color="success.main">
                      Save ₹{getSavings(plan).toLocaleString()} annually
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Check color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    variant={plan.current ? "outlined" : "contained"}
                    fullWidth
                    size="large"
                    onClick={() => handleUpgrade(plan)}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade to ' + plan.name}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Feature Comparison */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title="Feature Comparison" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>Features</Typography>
            </Grid>
            {plans.map((plan) => (
              <Grid item xs={12} md={3} key={plan.id}>
                <Typography variant="h6" align="center" gutterBottom>
                  {plan.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Tokens per month */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body1">Tokens per month</Typography>
            </Grid>
            {plans.map((plan) => (
              <Grid item xs={12} md={3} key={plan.id}>
                <Typography variant="body2" align="center">
                  {plan.limits.tokensPerMonth}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* API Calls */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body1">API Calls</Typography>
            </Grid>
            {plans.map((plan) => (
              <Grid item xs={12} md={3} key={plan.id}>
                <Typography variant="body2" align="center">
                  {plan.limits.apiCalls}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Storage */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="body1">Storage</Typography>
            </Grid>
            {plans.map((plan) => (
              <Grid item xs={12} md={3} key={plan.id}>
                <Typography variant="body2" align="center">
                  {plan.limits.storage}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Support */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body1">Support</Typography>
            </Grid>
            {plans.map((plan) => (
              <Grid item xs={12} md={3} key={plan.id}>
                <Typography variant="body2" align="center">
                  {plan.limits.support}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog 
        open={upgradeDialog} 
        onClose={() => setUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upgrade to {selectedPlan?.name}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            You are about to upgrade your plan to <strong>{selectedPlan?.name}</strong>.
          </Typography>
          <Typography paragraph>
            New monthly cost: <strong>₹{selectedPlan ? getPrice(selectedPlan).toLocaleString() : 0}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The upgrade will take effect immediately, and you'll be charged a prorated amount for the remaining billing period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => setUpgradeDialog(false)} 
            variant="contained"
          >
            Confirm Upgrade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PricingPlans;