import React from 'react';
import { Button } from '@mui/material';
import ReusableModal from 'components/modal/reusable';
import { useDeleteGenearalSchool } from 'api/requests';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

const DeleteSchoolModal = ({ open, onClose, state, refetchSchools }) => {
  const deleteSchoolMutation = useDeleteGenearalSchool(state?.deleteId);

  const handleDeleteSchool = () => {
    deleteSchoolMutation.mutate(null, {
      onSuccess: () => {
        refetchSchools();
        // Close modal on success
        dispatch(
          openSnackbar({
            open: true,
            message: `School deleted successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        onClose();
      },
      onError: (err) => {
        console.error('Delete school error:', err);
        console.error('Error response:', err?.response?.data);

        // Extract the proper error message
        let errorMessage = 'Failed to delete school. Please try again.';

        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        // Handle specific error codes
        if (err?.response?.status === 403) {
          errorMessage = 'Access Denied: You do not have permission to delete this school.';
        } else if (err?.response?.status === 404) {
          errorMessage = 'School not found or has already been deleted.';
        } else if (err?.response?.status === 409) {
          errorMessage = 'Cannot delete school: It may have associated data.';
        }

        dispatch(
          openSnackbar({
            open: true,
            message: errorMessage,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: true
          })
        );
      }
    });
  };

  const isLoading = deleteSchoolMutation.isPending;

  const actions = [
    <Button key="cancel" variant="outlined" color="error" onClick={onClose} disabled={isLoading}>
      Cancel
    </Button>,
    <Button key="delete" variant="contained" color="primary" onClick={handleDeleteSchool} disabled={isLoading}>
      {isLoading ? 'Deleting...' : 'Yes Delete'}
    </Button>
  ];

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title="Delete School"
      description="Are you sure you want to delete this school? This action cannot be undone."
      actions={actions}
      ariaLabelledBy="delete-school-modal"
    />
  );
};

export default DeleteSchoolModal;
