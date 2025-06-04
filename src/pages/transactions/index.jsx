/* eslint-disable no-unused-vars */
import '../../assets/datestyle.css';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

// Project imports
import { theme } from './util';
import { useTransactionState } from './hooks/useTransactionState';
import { useTransactionActions } from './hooks/useTransactionActions';
import TransactionStats from './components/TransactionStats';
import TransactionFilters from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import { useGetAllWallets } from "api/requests";

export default function TransactionManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useTransactionState();

  const {
    data: wallets,
    isLoading: walletsLoading,
    refetch: refetchWallets
  } = useGetAllWallets({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc']
  });

  const transactionsData = wallets?.data.content;

  // Get transactions data (placeholder for now - will be replaced with actual API calls)
//   const transactionsData = useMemo(
//     () => [
//       {
//         id: 1,
//         type: 'Temvo-to-Temvo',
//         school: 'Accra Academy',
//         amount: '20,000',
//         dbid: '1718290',
//         crid: '187303',
//         date: '17/02/2025',
//         status: 'Successful'
//       },
//       {
//         id: 2,
//         type: 'Temvo-to-Temvo',
//         school: 'Accra Academy',
//         amount: '20,000',
//         dbid: '1718290',
//         crid: '187303',
//         date: '17/02/2025',
//         status: 'Failed'
//       }
//     ],
//     []
//   );

  // Calculate stats from real data
  const { successfulCount, failedCount } = useMemo(() => {
    if (!transactionsData) return { successfulCount: 0, failedCount: 0 };

    const successful = transactionsData.filter((t) => t.status === 'Successful').length;
    const failed = transactionsData.filter((t) => t.status === 'Failed').length;

    return { successfulCount: successful, failedCount: failed };
  }, [transactionsData]);

  // Use actions hook with real data
  const actions = useTransactionActions(state, updateState, toggleModal, resetForm, transactionsData);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Stats Component */}
          <TransactionStats successfulCount={successfulCount} failedCount={failedCount} />

          {/* Filters Component */}
          <TransactionFilters
            state={state}
            onToggleFilters={actions.toggleFilters}
            onSearchChange={actions.handleSearchChange}
            onDateRangeChange={actions.handleDateRangeChange}
            onSchoolChange={actions.handleSchoolChange}
            onStatusChange={actions.handleStatusChange}
          />

          {/* Table Component */}
          <TransactionTable
            state={state}
            transactionsData={wallets?.data}
            isLoading={walletsLoading}
            onTabChange={actions.handleTabChange}
            onPageChange={actions.handleChangePage}
            onRowsPerPageChange={actions.handleChangeRowsPerPage}
            onTableSearchChange={actions.handleTableSearchChange}
            onPrintReport={actions.handlePrintReport}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
