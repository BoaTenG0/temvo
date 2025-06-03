import React from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import {
  Add,
  Additem,
  DocumentUpload,
  SearchFavorite1,
  Setting3
} from 'iconsax-react';
import { rowsPerPageOptions } from '../constants/posConstants';

const PosTable = ({
  state,
  onTabChange,
  onRowsPerPageChange,
  onTableSearchChange,
  onOpenNewPos,
  onOpenBulkPos,
  onOpenAssignPos,
  onDeletePos
}) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab label="All POS" />
          <Tab label="Assigned" />
          <Tab label="Unassigned" />
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="h6">POS List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<Add />} 
            size="small" 
            onClick={onOpenNewPos}
          >
            Register New POS
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<DocumentUpload />} 
            size="small" 
            onClick={onOpenBulkPos}
          >
            Register Bulk POS
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<Additem />} 
            size="small" 
            onClick={onOpenAssignPos}
          >
            Assign POS
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField 
          select 
          size="small" 
          value={state.rowsPerPage} 
          onChange={onRowsPerPageChange} 
          sx={{ width: 100 }}
        >
          {rowsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          placeholder="Search..."
          value={state.tableSearchTerm}
          onChange={(e) => onTableSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchFavorite1 fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ width: { xs: '100%', sm: 250 }, mt: { xs: 2, sm: 0 } }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Model Name</TableCell>
              <TableCell>Model Number</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell>Date Registered</TableCell>
              <TableCell>Date Assigned</TableCell>
              <TableCell>Assigned School</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.filteredPosDevices.length > 0 ? (
              state.filteredPosDevices.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.modelName}</TableCell>
                  <TableCell>{row.modelNumber}</TableCell>
                  <TableCell>{row.serialNumber}</TableCell>
                  <TableCell>{row.dateRegistered}</TableCell>
                  <TableCell>{row.dateAssigned}</TableCell>
                  <TableCell>{row.assignedSchool}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Assigned' ? 'success' : 'warning'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: row.status === 'Assigned' ? 'success.light' : 'warning.light',
                        color: row.status === 'Assigned' ? 'success.main' : 'warning.main',
                        border: 'none'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Deactivate POS">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => onDeletePos(row.id)}
                      >
                        <Setting3 fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No POS Devices found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="body2" color="text.secondary">
          Showing{' '}
          {state.filteredPosDevices.length > 0
            ? `1 to ${Math.min(state.filteredPosDevices.length, state.rowsPerPage)} of ${state.filteredPosDevices.length}`
            : '0'}{' '}
          entries
        </Typography>
      </Box>
    </Card>
  );
};

export default PosTable;
