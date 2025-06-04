/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Card,
  Box,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { DocumentUpload, SearchFavorite1, Setting3 } from 'iconsax-react';

const TransactionTable = ({ state, transactionsData, isLoading, onTabChange, onTableSearchChange, onPrintReport }) => {
  const transactions = transactionsData?.content || [];

  return (
    <Card sx={{ borderRadius: 2 }}>
      {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={state.tabValue} onChange={onTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab label="All Transactions" />
          <Tab label="Successful" />
          <Tab label="Failed" />
        </Tabs>
      </Box> */}

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
        <Typography variant="h6">Transactions List</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" color="primary" startIcon={<DocumentUpload />} size="small" onClick={onPrintReport}>
            Print Report
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField select size="small" value={state.rowsPerPage} sx={{ width: 100 }}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </TextField>
        <TextField
          size="small"
          placeholder="Search..."
          value={state.tableSearchTerm}
          onChange={onTableSearchChange}
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
              <TableCell>Balance</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Amount (GHS)</TableCell>
              <TableCell>Debited Temvo ID</TableCell>
              <TableCell>Credited Temvo ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.school}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.dbid}</TableCell>
                  <TableCell>{row.crid}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Successful' ? 'success' : 'warning'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: row.status === 'Successful' ? 'success.light' : 'warning.light',
                        color: row.status === 'Successful' ? 'success.main' : 'warning.main',
                        border: 'none'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Print Receipt">
                      <IconButton size="small" color="primary">
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
                    {isLoading ? 'Loading transactions...' : 'No transactions found matching the current filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {transactions.length > 0 ? `1 to ${Math.min(transactions.length, state.rowsPerPage)} of ${transactions.length}` : '0'}{' '}
          entries
        </Typography>
      </Box>
    </Card>
  );
};

export default TransactionTable;
