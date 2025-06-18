import { Skeleton, Typography } from '@mui/material';
import { useGetParentById } from 'api/requests';

export const ParentName = ({ parentId }) => {
  const { data: parentData, isLoading, error } = useGetParentById(parentId);

  if (!parentId) {
    return <Typography variant="body2">N/A</Typography>;
  }

  if (isLoading) {
    return <Skeleton variant="text" width={120} height={20} />;
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Error loading parent
      </Typography>
    );
  }

  return <Typography variant="body2">{parentData?.name || `Parent ${parentId}`}</Typography>;
};
