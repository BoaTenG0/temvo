/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Box, Grid, ListItemButton, Menu, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

// assets
import { More } from 'iconsax-react';

// ==============================|| CHART WIDGET - ECOMMERCE CARD  ||============================== //

const EcommerceDataCard = ({ title, count, percentage, color, iconPrimary, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar variant="rounded" color={color}>
                {iconPrimary}
              </Avatar>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{title}</Typography>
            </Stack>
            {/* <IconButton
              color="secondary"
              id="wallet-button"
              aria-controls={open ? 'wallet-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <More style={{ transform: 'rotate(90deg)' }} />
            </IconButton> */}
            {/* <Menu
              id="wallet-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'wallet-button',
                sx: { p: 1.25, minWidth: 150 }
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <ListItemButton onClick={handleClose}>Today</ListItemButton>
              <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
              <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
            </Menu> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <MainCard content={false} border={false} sx={{ bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
              {/* <Grid container spacing={3}>
                <Grid item xs={7}>
                  {children}
                </Grid>
              </Grid> */}
              {/* <Grid item xs={5}> */}
              {/* <Stack spacing={1}> */}
              <Typography variant="h5">{count}</Typography>
              {/* {percentage} */}
              {/* </Stack> */}
              {/* </Grid> */}
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

EcommerceDataCard.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.object,
  children: PropTypes.node,
  iconPrimary: PropTypes.node
};

export default EcommerceDataCard;
