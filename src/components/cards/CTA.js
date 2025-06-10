import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

import { ArrowLeft } from 'iconsax-react';
// assets
// import BackLeft from "assets/images/profile/UserProfileBackLeft";
// import BackRight from 'assets/images/profile/UserProfileBackRight';
// project-imports
import MainCard from 'components/MainCard';
import PropTypes from 'prop-types';
import { ThemeMode } from 'config';
import { useNavigate } from 'react-router';
// import { useNavigate } from "react-router";
// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| USER PROFILE - TOP CARD ||============================== //

const ClientCTA = ({ user, title = '', showDo = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainCard
      border={false}
      sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.700' : 'primary.lighter', position: 'relative' }}
    >
      <Grid container justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 5 }}>
        <Grid item>
          <Stack direction="row" spacing={matchDownSM ? 1 : 2} alignItems="center" justifyContent="space-between">
            <ArrowLeft style={{ cursor: 'pointer' }} type="button" onClick={handleBack} />

            <Box spacing={0.75}>
              <Typography variant="h4">
                Managing {user}
                {showDo ? '' : "'s "} {title}{' '}
              </Typography>
              {showDo && (
                <Typography variant="body1" color="secondary">
                  What would you want to do for client {user}?
                </Typography>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

ClientCTA.propTypes = {
  focusInput: PropTypes.func
};

export default ClientCTA;
