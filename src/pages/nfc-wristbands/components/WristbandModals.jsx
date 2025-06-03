import React from 'react';
import NewWristbandModal from './modals/NewWristbandModal';
import BulkWristbandModal from './modals/BulkWristbandModal';
import AssignWristbandModal from './modals/AssignWristbandModal';
import DeleteWristbandModal from './modals/DeleteWristbandModal';
import DeactivateWristbandModal from './modals/DeactivateWristbandModal';

const WristbandModals = ({ state, actions, onFormChange, refetchWristbands, schools }) => {
  const handleNewWristbandFormChange = (updates) => {
    onFormChange('newWristband', updates);
  };

  const handleAssignFormChange = (updates) => {
    onFormChange('assignData', updates);
  };

  const handleFileChange = (file) => {
    onFormChange('selectedFile', file);
  };

  return (
    <>
      {/* Register New Wristband Modal */}
      <NewWristbandModal
        open={state.modals.newWristband}
        onClose={actions.handleCloseNewWristband}
        formData={state.forms.newWristband}
        onFormChange={handleNewWristbandFormChange}
        // onSubmit={actions.handleRegisterWristband}
        refetchWristbands={refetchWristbands}
      />

      {/* Register Bulk Wristbands Modal */}
      <BulkWristbandModal
        open={state.modals.bulkWristband}
        onClose={actions.handleCloseBulkWristband}
        selectedFile={state.forms.selectedFile}
        onFileChange={handleFileChange}
        onSubmit={actions.handleBulkRegister}
      />

      {/* Assign Wristbands Modal */}
      <AssignWristbandModal
        open={state.modals.assignWristband}
        onClose={actions.handleCloseAssignWristband}
        formData={state.forms.assignData}
        onFormChange={handleAssignFormChange}
        schools={schools}
        state={state}
        refetchWristbands={refetchWristbands}
      />

      {/* Delete Wristband Modal */}
      <DeleteWristbandModal
        state={state}
        open={state.modals.delete}
        onClose={actions.handleCloseDelete}
        // onConfirm={actions.handleDeleteWristband}
        refetchWristbands={refetchWristbands}
      />
      <DeactivateWristbandModal
        state={state}
        open={state.modals.deactivate}
        onClose={actions.handleCloseDeactivateWristband}
        // onConfirm={actions.handleDeleteWristband}
        refetchWristbands={refetchWristbands}
      />
    </>
  );
};

export default WristbandModals;
