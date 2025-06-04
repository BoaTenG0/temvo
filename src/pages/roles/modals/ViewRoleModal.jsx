import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { formatRoleName, formatPermissionName, getStatusColor, getStatusLabel } from '../util';
import { Calendar, Edit2, Key } from "iconsax-react";

const ViewRoleModal = ({ open, onClose, formData, permissions = [] }) => {
  const rolePermissions = formData.permissions?.map(permId =>
    permissions.find(p => p.id === permId)
  ).filter(Boolean) || [];

  const actions = (
    <Button onClick={onClose} variant="contained">
      Close
    </Button>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Role Details"
      actions={actions}
      maxWidth={700}
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Basic Information
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Role Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatRoleName(formData.name)}
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

        {/* Permissions */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Assigned Permissions ({rolePermissions.length})
          </Typography>

          {rolePermissions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No permissions assigned to this role
            </Typography>
          ) : (
            <List dense>
              {rolePermissions.map((permission) => (
                <ListItem key={permission.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Key color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        {formatPermissionName(permission.name)}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={permission.resource}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={permission.action}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
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

export default ViewRoleModal;
