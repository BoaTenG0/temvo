/* eslint-disable no-unused-vars */
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  InputAdornment,
  Chip,
  DialogActions
} from '@mui/material';
import { SearchNormal1 } from 'iconsax-react';

export function AssignPOSContent({ onAction, loading, onClose, posData }) {
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter unassigned vendors
  const unassignedVendors = posData.filter(
    (vendor) =>
      vendor.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectVendor = (vendorId, checked) => {
    if (checked) {
      setSelectedVendors([vendorId]);
    } else {
      setSelectedVendors([]);
    }
  };

  const handleAssign = () => {
    if (selectedVendors.length === 0) return;
    const posId = selectedVendors[0];
    const assignmentData = {
      posId
    };
    onAction(assignmentData);
  };

  //   const isAllSelected = selectedVendors.length === unassignedVendors.length && unassignedVendors.length > 0;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select POS Device to assign to vendor.
      </Typography>

      <Box sx={{ mb: 3 }}>
        {/* <TextField
          fullWidth
          label="POS ID Prefix"
          value={posPrefix}
          onChange={(e) => setPosPrefix(e.target.value)}
          helperText="POS IDs will be generated with this prefix"
          sx={{ mb: 2 }}
        /> */}
        <TextField
          fullWidth
          placeholder="Search pos device..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchNormal1 size={18} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Checkbox
            checked={isAllSelected}
            indeterminate={selectedVendors.length > 0 && selectedVendors.length < unassignedVendors.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <Typography component="span" variant="body2">
            Select All ({unassignedVendors.length} vendors)
          </Typography>
        </Box>
        <Chip label={`${selectedVendors.length} selected`} color="primary" variant="outlined" />
      </Box> */}

      <TableContainer sx={{ maxHeight: 300, mb: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>Model Name</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Serial Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unassignedVendors.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={(e) => handleSelectVendor(vendor.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{vendor.model}</TableCell>
                <TableCell>{vendor.modelNumber}</TableCell>
                <TableCell>{vendor.serialNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {unassignedVendors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchTerm ? 'No pos devices found matching your search.' : 'All pos device systems.'}
          </Typography>
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAssign} disabled={selectedVendors.length === 0 || loading} sx={{ minWidth: 120 }}>
          {loading ? 'Assigning...' : `Assign POS`}
        </Button>
      </DialogActions>
    </Box>
  );
}
