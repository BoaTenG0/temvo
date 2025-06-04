import React from 'react';
import { Modal, Box, Typography, Button, Grid, TextField, IconButton, MenuItem } from '@mui/material';
import { CloseCircle } from 'iconsax-react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const UserModals = ({ state, actions, onFormChange }) => {
  const handleFormFieldChange = (formName, field) => (event) => {
    onFormChange(formName, { [field]: event.target.value });
  };

  return (
    <>
      {/* New User Modal */}
      <Modal open={state.modals.newUser} onClose={actions.handleCloseNewUser} aria-labelledby="new-user-modal">
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Add New User
            </Typography>
            <IconButton onClick={actions.handleCloseNewUser} size="small">
              <CloseCircle fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a new user to the TEMVO system.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                User Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter User Name"
                value={state.forms.newUser.userName}
                onChange={handleFormFieldChange('newUser', 'userName')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter Email"
                value={state.forms.newUser.email}
                onChange={handleFormFieldChange('newUser', 'email')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Phone Number"
                value={state.forms.newUser.phoneNumber}
                onChange={handleFormFieldChange('newUser', 'phoneNumber')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Role
              </Typography>
              <TextField select fullWidth value={state.forms.newUser.role} onChange={handleFormFieldChange('newUser', 'role')}>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Assigned School
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Assigned School"
                value={state.forms.newUser.assignedSchool}
                onChange={handleFormFieldChange('newUser', 'assignedSchool')}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button variant="outlined" color="error" onClick={actions.handleCloseNewUser}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={actions.handleCreateUser}
              disabled={!state.forms.newUser.userName || !state.forms.newUser.email}
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={state.modals.editUser} onClose={actions.handleCloseEdit} aria-labelledby="edit-user-modal">
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Edit User
            </Typography>
            <IconButton onClick={actions.handleCloseEdit} size="small">
              <CloseCircle fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update user information.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                User Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter User Name"
                value={state.forms.editUser.userName}
                onChange={handleFormFieldChange('editUser', 'userName')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter Email"
                value={state.forms.editUser.email}
                onChange={handleFormFieldChange('editUser', 'email')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Phone Number"
                value={state.forms.editUser.phoneNumber}
                onChange={handleFormFieldChange('editUser', 'phoneNumber')}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" gutterBottom>
                Role
              </Typography>
              <TextField select fullWidth value={state.forms.editUser.role} onChange={handleFormFieldChange('editUser', 'role')}>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Assigned School
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Assigned School"
                value={state.forms.editUser.assignedSchool}
                onChange={handleFormFieldChange('editUser', 'assignedSchool')}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button variant="outlined" color="error" onClick={actions.handleCloseEdit}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={actions.handleUpdateUser}
              disabled={!state.forms.editUser.userName || !state.forms.editUser.email}
            >
              Update User
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete User Modal */}
      <Modal open={state.modals.deleteUser} onClose={actions.handleCloseDelete} aria-labelledby="delete-user-modal">
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Delete User
            </Typography>
            <IconButton onClick={actions.handleCloseDelete} size="small">
              <CloseCircle fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Are you sure you want to delete user {state.forms.deleteUser.userName}? This action cannot be undone.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button variant="outlined" onClick={actions.handleCloseDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={actions.handleDeleteUser}>
              Delete User
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserModals;
