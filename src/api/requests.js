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
  return useMutation((data) => userService.createPOS(data));
};

export const useBulkUploadPOS = () => {
  return useMutation((data) => userService.bulkUploadPOS(data));
};

export const useAutoAssignToSchool = () => {
  return useMutation((data) => userService.autoAssignToSchool(data));
};

export const useAssignToSchool = () => {
  return useMutation((data) => userService.assignToSchool(data));
};

export const useDeactivatePOS = (posId) => {
  return useMutation((data) => userService.deactivatePOS(data, posId));
};

export const useActivatePOS = (posId) => {
  return useMutation((data) => userService.activatePOS(data, posId));
};

export const useReAssignPOS = (posId) => {
  return useMutation((data) => userService.reAssignPOS(data, posId));
};

export const useUnassignPOS = () => {
  return useMutation((data) => userService.unassignPOS(data));
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

export const useDeletePOSDevice = () => {
  return useMutation((posId) => userService.deletePOSDevice(posId));
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
  return useMutation((data) => userService.createGeneralSchool(data));
};

export const useBulkUploadGeneralSchool = () => {
  return useMutation((data) => userService.bulkUploadGeneralSchool(data));
};

export const useReAssignSchoolAdmin = (schoolId) => {
  return useMutation((data) => userService.ReAssignSchoolAdmin(data, schoolId));
};

export const useDeleteGenearalSchool = (schoolId) => {
  return useMutation((data) => userService.deleteGenearalSchool(data, schoolId));
};

export const useGetGeneralSchool = () => {
  return useQuery({
    queryKey: ['general-school'],
    queryFn: () => userService.getGeneralSchool()
  });
};
