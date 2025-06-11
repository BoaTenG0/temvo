
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { CloseCircle } from 'iconsax-react';
import { AssignWristbandsContent } from './assignWristbandsContent';
import { AddStudentContent } from './addStudentContent';
import { BulkStudentsContent } from './bulkStudentsContent';

const modalConfig = {
  assign: {
    title: 'Assign Wristbands',
    maxWidth: 'md'
  },
  add: {
    title: 'Register New Student',
    maxWidth: 'sm'
  },
  bulk: {
    title: 'Register Bulk Students',
    maxWidth: 'md'
  }
};

export function StudentActionModal({ open, type, loading, selectedStudents, onClose, onAction, students }) {
  if (!type) return null;

  const config = modalConfig[type];

  const renderContent = () => {
    switch (type) {
      case 'assign':
        return <AssignWristbandsContent students={students} selectedStudents={selectedStudents} onAction={onAction} loading={loading} />;
      case 'add':
        return <AddStudentContent onAction={onAction} loading={loading} />;
      case 'bulk':
        return <BulkStudentsContent onAction={onAction} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={config.maxWidth}
      fullWidth
      aria-labelledby="modal-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 300
        }
      }}
    >
      <DialogTitle
        id="modal-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        {config.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseCircle size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>{renderContent()}</DialogContent>
    </Dialog>
  );
}
