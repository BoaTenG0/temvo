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
import { SchoolName } from 'pages/nfc-wristbands/components/getSchoolName';
import { WristbandName } from 'pages/nfc-wristbands/components/getWristbandName';

export function AssignPOSContent({ vendors, selectedVendors: initialSelected, onAction, loading, onClose }) {
  console.log('🚀 ~ AssignPOSContent ~ vendors:', vendors);
  const [selectedVendors, setSelectedVendors] = useState(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter unassigned vendors
  const unassignedWards = vendors.filter(
    (vendor) => vendor.status === 'ACTIVE' && (vendor.parentId === null || !selectedVendors.includes(vendor.parentId))
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVendors(unassignedWards.map((vendor) => vendor.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleSelectVendor = (vendorId, checked) => {
    if (checked) {
      setSelectedVendors((prev) => [...prev, vendorId]);
    } else {
      setSelectedVendors((prev) => prev.filter((id) => id !== vendorId));
    }
  };

  const handleAssign = () => {
    const assignmentData = {
      studentIds: selectedVendors
    };
    onAction(assignmentData);
  };

  const isAllSelected = selectedVendors.length === unassignedWards.length && unassignedWards.length > 0;

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Select wards to assign parents to. Only unassigned wards are shown. You can only Perform one operation at a time
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search wards..."
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

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Checkbox
            checked={isAllSelected}
            indeterminate={selectedVendors.length > 0 && selectedVendors.length < unassignedWards.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <Typography component="span" variant="body2">
            Select All ({unassignedWards.length} wards)
          </Typography>
        </Box>
        <Chip label={`${selectedVendors.length} selected`} color="primary" variant="outlined" />
      </Box>

      <TableContainer sx={{ maxHeight: 300, mb: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>Ward Name</TableCell>
              <TableCell>Ward Code</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Wristband</TableCell>
              <TableCell>Wallet Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unassignedWards.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={(e) => handleSelectVendor(vendor.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.studentCode}</TableCell>
                <TableCell>
                  <SchoolName schoolId={vendor.schoolId} />
                </TableCell>
                <TableCell>
                  <WristbandName wristband={vendor.wristband} />
                </TableCell>
                <TableCell>{vendor.walletBalance || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {unassignedWards.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {searchTerm ? 'No wards found matching your search.' : 'All wards have been assigned POS systems.'}
          </Typography>
        </Box>
      )}

      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button variant="outlined" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleAssign} disabled={selectedVendors.length === 0 || loading} sx={{ minWidth: 120 }}>
          {loading ? 'Assigning...' : `Assign Ward (${selectedVendors.length})`}
        </Button>
      </DialogActions>
    </Box>
  );
}
