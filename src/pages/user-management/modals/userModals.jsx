import React from 'react';
import NewUserModal from './newUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

const UserModals = ({ state, actions, onFormChange, refetchUsers, schools, roles }) => {
  const handleNewUserFormChange = (updates) => {
    onFormChange('newUser', updates);
  };

  const handleEditUserFormChange = (updates) => {
    onFormChange('editUser', updates);
  };

  return (
    <>
      {/* New User Modal */}
      <NewUserModal
        open={state.modals.newUser}
        onClose={actions.handleCloseNewUser}
        formData={state.forms.newUser}
        onFormChange={handleNewUserFormChange}
        refetchUsers={refetchUsers}
        schools={schools}
        roles={roles}
      />

      {/* Edit User Modal */}
      <EditUserModal
        open={state.modals.editUser}
        onClose={actions.handleCloseEdit}
        formData={state.forms.editUser}
        onFormChange={handleEditUserFormChange}
        refetchUsers={refetchUsers}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={state.modals.deleteUser}
        onClose={actions.handleCloseDelete}
        userData={state.forms.deleteUser}
        refetchUsers={refetchUsers}
      />
    </>
  );
};

export default UserModals;
