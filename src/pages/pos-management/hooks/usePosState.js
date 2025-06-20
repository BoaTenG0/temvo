import { useState, useEffect } from 'react';
import { initialPosDevices, initialNewPos, initialAssignData } from '../constants/posConstants';

export const usePosState = () => {
  // Consolidated state object
  const [state, setState] = useState({
    // Pagination and display
    page: 0,
    rowsPerPage: 10,
    tabValue: 0,
    filtersExpanded: true,

    // Search and filters
    searchTerm: '',
    dateRange: [null, null],
    school: 'All',
    status: 'All',
    tableSearchTerm: '',
    deleteId: null,
    deactivateId: null,
    activateId: null,

    // Data
    posDevices: initialPosDevices,
    filteredPosDevices: initialPosDevices,

    // Modal states
    modals: {
      newPos: false,
      bulkPos: false,
      assignPos: false,
      delete: false
    },

    // Track selected POS for assignment modal
    selectedAssignPosId: null,

    // Form data
    forms: {
      newPos: initialNewPos,
      assignData: initialAssignData,
      selectedFile: null
    }
  });

  // Update state helper
  const updateState = (updates) => {
    setState((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Update nested state helper
  const updateNestedState = (key, updates) => {
    setState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  // Modal handlers
  const toggleModal = (modalName, isOpen = null) => {
    updateNestedState('modals', {
      [modalName]: isOpen !== null ? isOpen : !state.modals[modalName]
    });
  };

  // Form handlers
  const updateForm = (formName, updates) => {
    updateNestedState('forms', {
      [formName]: {
        ...state.forms[formName],
        ...updates
      }
    });
  };

  const resetForm = (formName) => {
    const initialValues = {
      newPos: initialNewPos,
      assignData: initialAssignData,
      selectedFile: null
    };

    updateNestedState('forms', {
      [formName]: initialValues[formName]
    });
  };

  // Computed values
  const assignedCount = state.posDevices.filter((p) => p.status === 'Assigned').length;
  const unassignedCount = state.posDevices.filter((p) => p.status === 'Unassigned').length;

  // Filter effect
  useEffect(() => {
    let filtered = [...state.posDevices];

    // Filter by tab value
    if (state.tabValue === 1) {
      filtered = filtered.filter((p) => p.status === 'Assigned');
    } else if (state.tabValue === 2) {
      filtered = filtered.filter((p) => p.status === 'Unassigned');
    }

    // Filter by school
    if (state.school !== 'All') {
      filtered = filtered.filter((p) => p.assignedSchool === state.school);
    }

    // Filter by status
    if (state.status !== 'All') {
      filtered = filtered.filter((p) => p.status === state.status);
    }

    // Filter by date range
    if (state.dateRange[0] && state.dateRange[1]) {
      const startDate = new Date(state.dateRange[0]);
      const endDate = new Date(state.dateRange[1]);

      filtered = filtered.filter((p) => {
        if (p.dateRegistered === 'N/A') return false;
        const parts = p.dateRegistered.split('/');
        const posDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return posDate >= startDate && posDate <= endDate;
      });
    }

    // Filter by global search
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.modelName.toLowerCase().includes(term) ||
          p.modelNumber.toLowerCase().includes(term) ||
          p.serialNumber.toLowerCase().includes(term) ||
          p.assignedSchool.toLowerCase().includes(term) ||
          p.status.toLowerCase().includes(term)
      );
    }

    // Filter by table search
    if (state.tableSearchTerm) {
      const term = state.tableSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.modelName.toLowerCase().includes(term) ||
          p.modelNumber.toLowerCase().includes(term) ||
          p.serialNumber.toLowerCase().includes(term) ||
          p.assignedSchool.toLowerCase().includes(term) ||
          p.status.toLowerCase().includes(term)
      );
    }

    updateState({ filteredPosDevices: filtered });
  }, [state.posDevices, state.tabValue, state.school, state.status, state.dateRange, state.searchTerm, state.tableSearchTerm]);

  return {
    state,
    updateState,
    updateNestedState,
    toggleModal,
    updateForm,
    resetForm,
    assignedCount,
    unassignedCount
  };
};
