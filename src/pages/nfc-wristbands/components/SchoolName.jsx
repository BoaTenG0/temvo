import React from 'react';
import { useGetGeneralSchoolById } from 'api/requests';
import { Typography, Skeleton } from '@mui/material';

const SchoolName = ({ schoolId }) => {
  const { data: schoolData, isLoading, error } = useGetGeneralSchoolById(schoolId);

  if (!schoolId) {
    return <Typography variant="body2">N/A</Typography>;
  }

  if (isLoading) {
    return <Skeleton variant="text" width={120} height={20} />;
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Error loading school
      </Typography>
    );
  }

  return <Typography variant="body2">{schoolData?.name || `School ${schoolId}`}</Typography>;
};

export default SchoolName;
