import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { formatPermissionName, getStatusColor, getStatusLabel } from '../util';
import { Calendar, Edit2, Key, Security } from "iconsax-react";

const ViewPermissionModal = ({ open, onClose, formData }) => {
  const actions = (
    <Button onClick={onClose} variant="contained">
      Close
    </Button>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Permission Details"
      actions={actions}
      maxWidth={600}
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Basic Information
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Permission Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatPermissionName(formData.name)}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Description
            </Typography>
            <Typography variant="body1">
              {formData.description || 'No description provided'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Status
            </Typography>
            <Chip
              label={getStatusLabel(formData.active)}
              color={getStatusColor(formData.active)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Permission Details */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Permission Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Security sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Resource
                </Typography>
              </Box>
              <Chip
                label={formData.resource}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Key sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Action
                </Typography>
              </Box>
              <Chip
                label={formData.action}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Metadata */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Metadata
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Calendar sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Created
                </Typography>
              </Box>
              <Typography variant="body2">
                {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Edit2 sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
              </Box>
              <Typography variant="body2">
                {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ReusableModal>
  );
};

export default ViewPermissionModal;
