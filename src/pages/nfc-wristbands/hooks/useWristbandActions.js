import { format } from 'date-fns';

export const useWristbandActions = (state, updateState, toggleModal, resetForm) => {
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    updateState({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    updateState({
      rowsPerPage: Number.parseInt(event.target.value, 10),
      page: 0
    });
  };

  // Tab handler
  const handleTabChange = (event, newValue) => {
    updateState({ tabValue: newValue });
  };

  // Filter handlers
  const toggleFilters = () => {
    updateState({ filtersExpanded: !state.filtersExpanded });
  };

  const handleSearchChange = (value) => {
    updateState({ searchTerm: value });
  };

  const handleTableSearchChange = (value) => {
    updateState({ tableSearchTerm: value });
  };

  const handleDateRangeChange = (newValue) => {
    console.log('🚀 ~ handleDateRangeChange ~ newValue:', newValue);

    updateState({ dateRange: newValue });
  };

  const handleSchoolChange = (value) => {
    updateState({ school: value });
  };

  const handleStatusChange = (value) => {
    updateState({ status: value });
  };

  // Modal handlers
  //   const handleOpenNewWristband = () => {
  //     toggleModal('newWristband', true);
  //   };
  const handleOpenNewWristband = (wristbandData) => {
    console.log('Selected wristband:', wristbandData);
    toggleModal('newWristband', true);
    updateState({ wristbandData: wristbandData });
  };

  const handleCloseNewWristband = () => {
    toggleModal('newWristband', false);
    resetForm('newWristband');
  };

  const handleOpenBulkWristband = () => {
    toggleModal('bulkWristband', true);
  };

  const handleCloseBulkWristband = () => {
    toggleModal('bulkWristband', false);
    resetForm('selectedFile');
  };

  const handleOpenAssignWristband = (wristbandData) => {
    toggleModal('assignWristband', true);
    updateState({ wristbandData: wristbandData });
  };

  const handleCloseAssignWristband = () => {
    toggleModal('assignWristband', false);
    resetForm('assignData');
  };

  const handleOpenDelete = (id) => {
    updateState({ deleteId: id });

    toggleModal('delete', true);
  };
  const handleOpenDeactivate = (id) => {
    updateState({ deactivateId: id });

    toggleModal('deactivate', true);
  };

  const handleCloseDelete = () => {
    toggleModal('delete', false);
  };
  const handleCloseDeactivate = () => {
    toggleModal('deactivate', false);
  };

  // CRUD operations
  const handleRegisterWristband = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const newItem = {
      id: state?.wristbands?.length + 1,
      ...state.forms.newWristband,
      dateRegistered: formattedDate,
      dateAssigned: 'N/A',
      assignedSchool: 'N/A',
      status: 'Unassigned'
    };

    updateState({
      wristbands: [...state.wristbands, newItem]
    });
    handleCloseNewWristband();
  };

  const handleBulkRegister = () => {
    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const bulkItems = [
      {
        id: state?.wristbands?.length + 1,
        modelName: 'Bulk-POS-xu3000',
        modelNumber: 'POS-57687903',
        serialNumber: 'tbw-09300018380',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      },
      {
        id: state.wristbands.length + 2,
        modelName: 'Bulk-POS-xu3001',
        modelNumber: 'POS-57687904',
        serialNumber: 'tbw-09300018381',
        dateRegistered: formattedDate,
        dateAssigned: 'N/A',
        assignedSchool: 'N/A',
        status: 'Unassigned'
      }
    ];

    updateState({
      wristbands: [...state.wristbands, ...bulkItems]
    });
    handleCloseBulkWristband();
  };

  const handleAssignWristbands = () => {
    const count = Number.parseInt(state.forms.assignData.count, 10);
    if (isNaN(count) || count <= 0) return;

    const today = new Date();
    const formattedDate = format(today, 'dd/MM/yyyy');

    const updatedWristbands = [...state.wristbands];
    let assigned = 0;

    for (let i = 0; i < updatedWristbands.length && assigned < count; i++) {
      if (updatedWristbands[i].status === 'Unassigned') {
        updatedWristbands[i].status = 'Assigned';
        updatedWristbands[i].assignedSchool = state.forms.assignData.school;
        updatedWristbands[i].dateAssigned = formattedDate;
        assigned++;
      }
    }

    updateState({ wristbands: updatedWristbands });
    handleCloseAssignWristband();
  };

  const handleDeleteWristband = () => {
    // Handle delete logic here
    handleCloseDelete();
  };
  const handleCloseDeactivateWristband = () => {
    // Handle delete logic here
    handleCloseDeactivate();
  };

  return {
    // Pagination
    handleChangePage,
    handleChangeRowsPerPage,

    // Tabs and filters
    handleTabChange,
    toggleFilters,
    handleSearchChange,
    handleTableSearchChange,
    handleDateRangeChange,
    handleSchoolChange,
    handleStatusChange,

    // Modals
    handleOpenNewWristband,
    handleCloseNewWristband,
    handleOpenBulkWristband,
    handleCloseBulkWristband,
    handleOpenAssignWristband,
    handleCloseAssignWristband,
    handleOpenDelete,
    handleOpenDeactivate,
    handleCloseDelete,
    handleCloseDeactivateWristband,

    // CRUD operations
    handleRegisterWristband,
    handleBulkRegister,
    handleAssignWristbands,
    handleDeleteWristband
  };
};
