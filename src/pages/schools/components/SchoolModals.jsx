import React from 'react';
import NewSchoolModal from './modals/NewSchoolModal';
import BulkSchoolModal from './modals/BulkSchoolModal';
import AssignSchoolModal from './modals/AssignSchoolModal';
import ViewSchoolModal from './modals/ViewSchoolModal';
import EditSchoolModal from './modals/EditSchoolModal';
import DeleteSchoolModal from './modals/DeleteSchool';

const SchoolModals = ({ state, actions, onFormChange, schools, refetchSchools }) => {
  return (
    <>
      {/* New School Modal */}
      <NewSchoolModal
        open={state.modals.newSchool}
        onClose={actions.handleCloseNewSchool}
        formData={state.forms.newSchool}
        onFormChange={(updates) => onFormChange('newSchool', updates)}
        onSubmit={actions.handleRegisterSchool}
        refetchSchools={refetchSchools}
      />

      {/* Bulk School Modal */}
      <BulkSchoolModal
        open={state.modals.bulkSchool}
        onClose={actions.handleCloseBulkSchool}
        selectedFile={state.forms.selectedFile}
        onFileChange={(file) => onFormChange('selectedFile', file)}
        onSubmit={actions.handleBulkRegister}
        refetchSchools={refetchSchools}
      />

      {/* Assign School Modal */}
      <AssignSchoolModal
        open={state.modals.assignSchool}
        onClose={actions.handleCloseAssignSchool}
        formData={state.forms.assignData}
        onFormChange={(updates) => onFormChange('assignData', updates)}
        onSubmit={actions.handleAssignSchools}
        schools={schools}
      />

      {/* View School Modal */}
      <ViewSchoolModal open={state.modals.viewSchool} onClose={actions.handleCloseView} schoolData={state.schoolData} />

      {/* Edit School Modal */}
      <EditSchoolModal
        open={state.modals.editSchool}
        onClose={actions.handleCloseEdit}
        schoolData={state.schoolData}
        onSubmit={actions.handleUpdateSchool}
      />

      <DeleteSchoolModal
        state={state}
        open={state.modals.delete}
        onClose={actions.handleCloseDelete}
        // onConfirm={actions.handleDeleteWristband}
        refetchSchools={refetchSchools}
      />
    </>
  );
};

export default SchoolModals;
