import React, { useState } from 'react';
import { TableCell, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip } from '@mui/material';
import { Copy, Eye } from 'iconsax-react';

const StudentApiKeyCell = ({ student }) => {
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(student.apiKey || '');
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
    }
  };

  return (
    <TableCell>
      {student.apiKey ? (
        <>
          <Tooltip title="View API Key">
            <IconButton onClick={() => setOpen(true)}>
              <Eye size={14} />
            </IconButton>
          </Tooltip>

          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>API Key</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                {student.apiKey}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCopy} startIcon={<Copy size={14} />}>
                {copySuccess || 'Copy'}
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          N/A
        </Typography>
      )}
    </TableCell>
  );
};

export default StudentApiKeyCell;
