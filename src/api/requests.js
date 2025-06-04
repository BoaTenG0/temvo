import { useMutation, useQuery } from '@tanstack/react-query';
import { userService } from './index';

export const useGetParents = (filters, parentId) => {
  return useQuery({
    queryKey: ['parents', filters, parentId],
    queryFn: () => userService.getParents(filters, parentId)
  });
};

export const useAddParent = () => {
  return useMutation((data) => userService.addParent(data));
};

export const useGetParentById = (parentId) => {
  return useQuery({
    queryKey: ['parent', parentId],
    queryFn: () => userService.getParentById(parentId)
  });
};

export const useDeleteParent = () => {
  return useMutation((parentId) => userService.deleteParent(parentId));
};

export const useAssignWards = (parentId) => {
  return useMutation((data) => userService.assignWards(data, parentId));
};

export const useGetWards = (parentId) => {
  return useQuery({
    queryKey: ['wards', parentId],
    queryFn: () => userService.getWards(parentId)
  });
};

export const useGetSchoolById = (schoolId) => {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => userService.getSchoolById(schoolId)
  });
};

export const useGetPOS = (filters) => {
  return useQuery({
    queryKey: ['pos', filters],
    queryFn: () => userService.getPOS(filters)
  });
};

export const useCreatePOS = () => {
  return useMutation({ mutationFn: (data) => userService.createPOS(data) });
};

export const useBulkUploadPOS = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadPOS(data) });
};

export const useAutoAssignToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.autoAssignToSchool(data) });
};

export const useAssignToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.assignToSchool(data) });
};

export const useDeactivatePOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.deactivatePOS(data, posId) });
};

export const useActivatePOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.activatePOS(data, posId) });
};

export const useReAssignPOS = (posId) => {
  return useMutation({ mutationFn: (data) => userService.reAssignPOS(data, posId) });
};

export const useUnassignPOS = () => {
  return useMutation({ mutationFn: (data) => userService.unassignPOS(data) });
};

export const useGetPOSForSchool = (schoolId) => {
  return useQuery({
    queryKey: ['pos-for-school', schoolId],
    queryFn: () => userService.getPOSForSchool(schoolId)
  });
};

export const useGetPOSDeviceById = (posId) => {
  return useQuery({
    queryKey: ['pos-device', posId],
    queryFn: () => userService.getPOSDeviceById(posId)
  });
};

export const useGetBulkUploadCredentials = (posId) => {
  return useQuery({
    queryKey: ['bulk-upload-credentials', posId],
    queryFn: () => userService.getBulkUploadCredentials(posId)
  });
};

export const useDeletePOSDevice = (posId) => {
  return useMutation({ mutationFn: () => userService.deletePOSDevice(posId) });
};

export const useGetWristbands = (filters) => {
  return useQuery({
    queryKey: ['wristbands', filters],
    queryFn: () => userService.getWristbands(filters)
  });
};

export const useGetWristbandById = (wristbandId) => {
  return useQuery({
    queryKey: ['wristband', wristbandId],
    queryFn: () => userService.getWristbandById(wristbandId)
  });
};

export const useAssignWristbandToStudent = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.assignWristbandToStudent(data, wristbandId) });
};

export const useAssignWristbandToSchool = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.assignWristbandToSchool(data, wristbandId) });
};

export const useUnassignWristbandFromStudent = (studentId) => {
  return useMutation({ mutationFn: (data) => userService.unassignWristbandFromStudent(data, studentId) });
};

export const useCreateWristband = () => {
  return useMutation({
    mutationFn: (data) => userService.createWristband(data)
  });
};

export const useBulkUploadWristbands = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadWristbands(data) });
};

export const useAutoAssignWristbandsToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.autoAssignWristbandsToSchool(data) });
};

export const useAssignBulkWristbandsToSchool = () => {
  return useMutation({ mutationFn: (data) => userService.assignBulkWristbandsToSchool(data) });
};

export const useDeactivateWristband = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.deactivateWristband(data, wristbandId) });
};

export const useDeleteWristband = (wristbandId) => {
  return useMutation({ mutationFn: () => userService.deleteWristband(wristbandId) });
};

export const useActivateWristband = (wristbandId) => {
  return useMutation({ mutationFn: (data) => userService.activateWristband(data, wristbandId) });
};

export const useGetWristbandsForCurrentSchool = (schoolId) => {
  return useQuery({
    queryKey: ['wristbands-for-school', schoolId],
    queryFn: () => userService.getWristbandsForCurrentSchool(schoolId)
  });
};

export const useGetUnassignedWristbands = () => {
  return useQuery({
    queryKey: ['unassigned-wristbands'],
    queryFn: () => userService.getUnassignedWristbands()
  });
};

export const useGetGeneralSchoolById = (schoolId) => {
  return useQuery({
    queryKey: ['general-school', schoolId],
    queryFn: () => userService.getGeneralSchoolById(schoolId)
  });
};

export const useCreateGeneralSchool = () => {
  return useMutation({ mutationFn: (data) => userService.createGeneralSchool(data) });
};

export const useBulkUploadGeneralSchool = () => {
  return useMutation({ mutationFn: (data) => userService.bulkUploadGeneralSchool(data) });
};

export const useReAssignSchoolAdmin = (schoolId) => {
  return useMutation({ mutationFn: (data) => userService.ReAssignSchoolAdmin(data, schoolId) });
};

export const useDeleteGenearalSchool = (schoolId) => {
  return useMutation({ mutationFn: () => userService.deleteGenearalSchool(schoolId) });
};

export const useGetGeneralSchool = (filters) => {
  return useQuery({
    queryKey: ['general-school', filters],
    queryFn: () => userService.getGeneralSchool(filters)
  });
};

export const useGetAllWallets = () => {
  return useQuery({
    queryKey: ['all-wallets'],
    queryFn: () => userService.getAllWallets()
  });
};

export const useGetUsers = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters)
  });
};

export const useCreateUser = () => {
  return useMutation({ mutationFn: (data) => userService.createUser(data) });
};

export const useBulkDeleteUsers = () => {
  return useMutation({ mutationFn: (data) => userService.bulkDeleteUsers(data) });
};

export const useGetUnassignedAdmins = () => {
  return useQuery({
    queryKey: ['unassigned-admins'],
    queryFn: () => userService.getUnassignedAdmins()
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile()
  });
};

export const useChangePassword = () => {
  return useMutation({ mutationFn: (data) => userService.changePassword(data) });
};

export const useEditUser = (userId) => {
  return useMutation({ mutationFn: (data) => userService.editUser(data, userId) });
};

export const useDeleteUser = (userId) => {
  return useMutation({ mutationFn: () => userService.deleteUser(userId) });
};

export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId)
  });
};

export const useGetRoles = (filters) => {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: () => userService.getRoles(filters)
  });
};

export const useCreateRole = () => {
  return useMutation({ mutationFn: (data) => userService.createRole(data) });
};

export const useGetRoleById = (roleId) => {
  return useQuery({
    queryKey: ['role', roleId],
    queryFn: () => userService.getRoleById(roleId)
  });
};

export const useEditRole = (roleId) => {
  return useMutation({ mutationFn: (data) => userService.editRole(data, roleId) });
};

export const useDeleteRole = (roleId) => {
  return useMutation({ mutationFn: () => userService.deleteRole(roleId) });
};

export const useGetPermissions = (filters) => {
  return useQuery({
    queryKey: ['permissions', filters],
    queryFn: () => userService.getPermissions(filters)
  });
};

export const useCreatePermission = () => {
  return useMutation({ mutationFn: (data) => userService.createPermission(data) });
};

export const useBulkCreatePermission = () => {
  return useMutation({ mutationFn: (data) => userService.bulkCreatePermission(data) });
};

export const useGetPermissionById = (permissionId) => {
  return useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => userService.getPermissionById(permissionId)
  });
};

export const useUpdatePermission = (permissionId) => {
  return useMutation({ mutationFn: (data) => userService.updatePermission(data, permissionId) });
};

export const useDeletePermission = (permissionId) => {
  return useMutation({ mutationFn: () => userService.deletePermission(permissionId) });
};

export const useGetBulkUploadJobStatus = (jobId) => {
  return useQuery({
    queryKey: ['bulk-upload-status', jobId],
    queryFn: () => userService.getBulkUploadJobStatus(jobId)
  });
};
