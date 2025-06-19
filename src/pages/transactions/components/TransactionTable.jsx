/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  Tooltip,
  TablePagination,
  CircularProgress
} from '@mui/material';
import { Check, CloseCircle, DocumentUpload, Eye, Refresh, SearchFavorite1, SearchNormal1, Setting3, TickCircle } from 'iconsax-react';
import { useGetUserById, useDeactivateWallet, useActivateWallet } from 'api/requests';
import WalletActionModal from './WalletActionModal';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useNavigate } from 'react-router';

const rowsPerPageOptions = [10, 20, 50, 100];

const TransactionTable = ({
  state,
  transactionsData,
  isLoading,
  onTabChange,
  onTableSearchChange,
  onPrintReport,
  onPageChange,
  onRowsPerPageChange,
  userInfo,
  refetchWallets,
  onRefresh
}) => {
  const navigate = useNavigate();

  const transactions = transactionsData?.content || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isActivation, setIsActivation] = useState(true);

  const activateWallet = useActivateWallet();
  const deactivateWallet = useDeactivateWallet();

  const handleWalletAction = (wallet, isActivate) => {
    setSelectedWallet(wallet);
    setIsActivation(isActivate);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    const data = {
      userId: selectedWallet.userId,
      performedByUserId: userInfo.id
    };
    if (isActivation) {
      activateWallet.mutate(data, {
        onSuccess: () => {
          dispatch(
            openSnackbar({
              open: true,
              message: `Wallet activated successfully`,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          refetchWallets();
        },
        onError: () => {
          dispatch(
            openSnackbar({
              open: true,
              message: `Error activating wallet`,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      });
    } else {
      deactivateWallet.mutate(data, {
        onSuccess: () => {
          dispatch(
            openSnackbar({
              open: true,
              message: `Wallet deactivated successfully`,
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: true
            })
          );
          refetchWallets();
        },
        onError: () => {
          dispatch(
            openSnackbar({
              open: true,
              message: `Wallet deactivation unsuccessful`,
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true
            })
          );
        }
      });
    }

    setModalOpen(false);
    setSelectedWallet(null);
  };

  const { data } = useGetUserById(2);

  const paginatedTransactions = transactions.slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage);

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
          <Button size="small" startIcon={<Refresh size={16} />} variant="outlined" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </Button>
          <Button variant="outlined" color="primary" startIcon={<DocumentUpload />} size="small">
            Export Report
          </Button>
        </Stack>
      </Box>

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField select size="small" value={state.rowsPerPage} onChange={onRowsPerPageChange} sx={{ width: 100 }}>
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
          onChange={onTableSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchNormal1 size={15} />
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
              <TableCell>Performed By</TableCell>
              {/* <TableCell>School</TableCell>
              <TableCell>Amount (GHS)</TableCell>
              <TableCell>Debited Temvo ID</TableCell>
              <TableCell>Credited Temvo ID</TableCell> */}
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Loading wristbands...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.balance}</TableCell>
                  <TableCell>{row.userId}</TableCell>
                  {/* <TableCell>{row.amount}</TableCell> */}
                  {/* <TableCell>{row.dbid}</TableCell>
                  <TableCell>{row.crid}</TableCell> */}
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'ACTIVE' ? 'success' : 'warning'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: row.status === 'ACTIVE' ? 'success.light' : 'warning.light',
                        color: row.status === 'ACTIVE' ? 'success.main' : 'warning.main',
                        border: 'none'
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View User Transactions">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user-management/ViewUser/${row.userId}`);
                        }}
                      >
                        <Eye fontSize="small" size={15} />
                      </IconButton>
                    </Tooltip>
                    {row.status !== 'ACTIVE' && (
                      <Tooltip title="Activate Wallet">
                        <IconButton size="small" color="info" onClick={() => handleWalletAction(row, true)}>
                          <TickCircle fontSize="small" size={15} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {row.status === 'ACTIVE' && (
                      <Tooltip title="Deactivate Wallet">
                        <IconButton size="small" color="warning" onClick={() => handleWalletAction(row, false)}>
                          <CloseCircle fontSize="small" size={15} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {/* <Tooltip title="Print Receipt">
                      <IconButton size="small" color="primary">
                        <Setting3 fontSize="small" size={15} />
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No transactions found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={transactionsData?.totalElements || 0}
        page={state.page}
        onPageChange={onPageChange}
        rowsPerPage={state.rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        showFirstButton
        showLastButton
        sx={{
          borderTop: '1px solid rgba(224, 224, 224, 1)',
          '& .MuiTablePagination-toolbar': {
            paddingLeft: 2,
            paddingRight: 2
          }
        }}
      />

      <WalletActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isActivation={isActivation}
        onConfirm={handleConfirmAction}
        loading={isActivation ? activateWallet.isLoading : deactivateWallet.isLoading}
        walletId={selectedWallet?.walletId}
      />
    </Card>
  );
};

export default TransactionTable;
