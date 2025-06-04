/* eslint-disable no-unused-vars */

import { useCallback } from 'react';

export const useTransactionActions = (state, updateState, toggleModal, resetForm, transactionsData) => {
  // Pagination handlers
  const handleChangePage = useCallback(
    (event, newPage) => {
      updateState({ page: newPage });
    },
    [updateState]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      updateState({
        rowsPerPage: Number.parseInt(event.target.value, 10),
        page: 0
      });
    },
    [updateState]
  );

  // Tab handlers
  const handleTabChange = useCallback(
    (event, newValue) => {
      updateState({ tabValue: newValue });
    },
    [updateState]
  );

  // Filter handlers
  const toggleFilters = useCallback(() => {
    updateState({ filtersExpanded: !state.filtersExpanded });
  }, [state.filtersExpanded, updateState]);

  const handleSearchChange = useCallback(
    (event) => {
      updateState({ searchTerm: event.target.value });
    },
    [updateState]
  );

  const handleTableSearchChange = useCallback(
    (event) => {
      updateState({ tableSearchTerm: event.target.value });
    },
    [updateState]
  );

  const handleDateRangeChange = useCallback(
    (value) => {
      updateState({ dateRange: value });
    },
    [updateState]
  );

  const handleSchoolChange = useCallback(
    (event) => {
      updateState({ school: event.target.value });
    },
    [updateState]
  );

  const handleStatusChange = useCallback(
    (event) => {
      updateState({ status: event.target.value });
    },
    [updateState]
  );

  // Print handlers
  const handlePrintReport = useCallback(() => {
    console.log('Printing transaction report');
    window.print();
  }, []);

  return {
    // Pagination
    handleChangePage,
    handleChangeRowsPerPage,

    // Tabs
    handleTabChange,

    // Filters
    toggleFilters,
    handleSearchChange,
    handleTableSearchChange,
    handleDateRangeChange,
    handleSchoolChange,
    handleStatusChange,

    // Print
    handlePrintReport
  };
};
