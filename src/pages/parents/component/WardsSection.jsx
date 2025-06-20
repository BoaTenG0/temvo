/* eslint-disable no-unused-vars */
import { Box, Card, CardContent, Typography, Grid, Avatar, Chip, useTheme, Button } from '@mui/material';
import { People, Building, Book, Scan, Wallet3, Add, Eye } from 'iconsax-react';

export function WardsSection({ wards = [] }) {
  const theme = useTheme();


  const getInitials = (name) => {
    if (!name) return '?';
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <People size={24} color={theme.palette.primary.main} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Ward Information
            </Typography>
            <Chip label={`${wards.length} Ward${wards.length !== 1 ? 's' : ''}`} size="small" color="primary" />
          </Box>
        </Box>

        {wards.length > 0 ? (
          <Grid container spacing={3}>
            {wards.map((ward, index) => (
              <Grid item xs={12} md={6} key={ward?.id || index}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: '100%',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${getRandomColor(index)}.main`,
                        width: 48,
                        height: 48,
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(ward?.name)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {ward?.name || 'Unknown Student'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Student ID: #{ward?.id || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ space: 2 }}>
                    {/* School Information */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Building size={18} color={theme.palette.text.secondary} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ward?.schoolName || 'No school assigned'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Class Information */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Book size={18} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        Class: {ward?.class_name || 'Not assigned'}
                      </Typography>
                    </Box>

                    {/* Wristband ID */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Scan size={18} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        Wristband ID: {ward?.wristband_id ? `#${ward.wristband_id}` : 'Not assigned'}
                      </Typography>
                      {ward?.wristband_id && <Chip label="Active" size="small" color="success" variant="outlined" />}
                    </Box>

                    {/* Wallet Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Wallet3 size={18} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        Wallet: {ward?.walletId ? `#${ward.walletId}` : 'Not linked'}
                      </Typography>
                      {!ward?.walletId && <Chip label="Setup Required" size="small" color="warning" variant="outlined" />}
                    </Box>

                    {/* User ID */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        User ID: {ward?.user_id || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <People size={64} color={theme.palette.text.disabled} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
              No wards registered
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add a ward to get started with managing student information
            </Typography>
            <Button variant="contained" startIcon={<Add size={16} />} onClick={handleAddWard}>
              Add First Ward
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
