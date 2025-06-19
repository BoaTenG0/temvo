/* eslint-disable no-unused-vars */
import { Box, Card, CardContent, Avatar, Typography, Grid, useTheme, useMediaQuery, Divider } from '@mui/material';
import { User, Call, Sms, Briefcase, Location, Calendar, Profile2User } from 'iconsax-react';

export function ParentProfileHeader({ parentData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 600
                }}
              >
                {getInitials(parentData?.name)}
              </Avatar>
            </Box>
          </Grid>

          <Grid item xs={12} sm>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <User size={24} color={theme.palette.primary.main} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                  {parentData?.name || 'Unknown Parent'}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Call size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {parentData?.phone || 'No phone provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Sms size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {parentData?.email || 'No email provided'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Briefcase size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {parentData?.occupation || 'No occupation provided'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Location size={18} color={theme.palette.text.secondary} />
                    <Typography variant="body2" color="text.secondary">
                      {parentData?.address || 'No address provided'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(parentData?.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Emergency Contact Section */}
        {(parentData?.emergencyContactName || parentData?.emergencyContactPhone) && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Profile2User size={20} color={theme.palette.error.main} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                  Emergency Contact
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={16} color={theme.palette.text.secondary} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {parentData?.emergencyContactName || 'No name provided'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Call size={16} color={theme.palette.text.secondary} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {parentData?.emergencyContactPhone || 'No phone provided'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
