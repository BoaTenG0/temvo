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
import { useGetAllWallets } from 'api/requests';
import { useSelector } from 'store';
import { convertDateJS } from 'utils/hooks';
import TransactionsSection from 'pages/schools/sections/transactions-section';

export default function TransactionManagement() {
  // Use consolidated state management
  const { state, updateState, updateNestedState, toggleModal, updateForm, resetForm } = useTransactionState();

  const userInfo = useSelector((state) => state.user.userInfo);
  const {
    data: wallets,
    isLoading: walletsLoading,
    refetch: refetchWallets
  } = useGetAllWallets({
    page: state.page,
    size: state.rowsPerPage,
    search: state.searchTerm || state.tableSearchTerm || '',
    sort: ['desc'],
    from: convertDateJS(state.dateRange[0]),
    to: convertDateJS(state.dateRange[1]),
    status: state.status
  });

  const transactionsData = wallets?.data.content;

  const status = useMemo(() => {
    if (!transactionsData) return [];
    return [...new Set(transactionsData.map((tx) => tx.status))];
  }, [transactionsData]);

  // Calculate stats from real data
  const { successfulCount, failedCount } = useMemo(() => {
    if (!transactionsData) return { successfulCount: 0, failedCount: 0 };

    const successful = transactionsData.filter((t) => t.status === 'ACTIVE').length;
    const failed = transactionsData.filter((t) => t.status === 'SUSPENDED').length;

    return { successfulCount: successful, failedCount: failed };
  }, [transactionsData]);

  // Use actions hook with real data
  const actions = useTransactionActions(state, updateState, toggleModal, resetForm, transactionsData);

  return (
    <ThemeProvider theme={theme}>
      {userInfo.schoolId !== null ? (
        <TransactionsSection schoolId={userInfo?.schoolId ? userInfo?.schoolId : null} />
      ) : (
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
              status={status}
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
              userInfo={userInfo}
              refetchWallets={refetchWallets}
              onRefresh={refetchWallets}
            />
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}
