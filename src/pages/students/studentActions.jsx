import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Additem, Edit2, Trash } from 'iconsax-react';

const StudentActions = ({ student, handleModalAction, handleOpenModal }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleStatusSelect = (status) => {
    handleModalAction({ type: 'status', ...student, status });
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <Tooltip title="Change Status">
        <IconButton size="small" color="secondary" onClick={handleStatusClick}>
          <Edit2 size={18} />
        </IconButton>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {['ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED', 'TRANSFERRED', 'WITHDRAWN'].map((status) => (
          <MenuItem key={status} onClick={() => handleStatusSelect(status)}>
            {status}
          </MenuItem>
        ))}
      </Menu>

      <Tooltip title="Assign Wristband">
        <IconButton size="small" color="info" onClick={() => handleOpenModal('assign')} disabled={student.wristbandId}>
          <Additem size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Student">
        <IconButton size="small" color="primary" onClick={() => handleOpenModal('edit', student)}>
          <Edit2 size={18} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete Student">
        <IconButton size="small" color="error">
          <Trash size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default StudentActions;
