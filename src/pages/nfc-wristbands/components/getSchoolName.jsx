import { Skeleton, Typography } from '@mui/material';
import { useGetGeneralSchoolById } from 'api/requests';

export const SchoolName = ({ schoolId }) => {
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
