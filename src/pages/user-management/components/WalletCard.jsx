/* eslint-disable no-unused-vars */
import { Box, Card, CardContent, Typography, Chip, Grid, Divider, Button, useTheme } from '@mui/material';
import { Wallet3, TrendUp, Add, Send2 } from 'iconsax-react';

export function WalletCard({ wallet }) {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Wallet3 size={24} color={theme.palette.primary.main} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Wallet Balance
              </Typography>
              <Chip label={wallet.status || 'Unknown'} size="small" color={getStatusColor(wallet.status)} variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            {formatCurrency(wallet.balance)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendUp size={16} color={theme.palette.success.main} />
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
              +2.5% from last month
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Wallet ID
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
              #{wallet.walletId?.toString().slice(-8) || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Last Updated
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(wallet.updatedAt)}
            </Typography>
          </Grid>
        </Grid>

        {/* <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button variant="contained" startIcon={<Add size={16} />} sx={{ flex: 1 }}>
            Add Funds
          </Button>
          <Button variant="outlined" startIcon={<Send2 size={16} />} sx={{ flex: 1 }}>
            Send Money
          </Button>
        </Box> */}
      </CardContent>
    </Card>
  );
}
