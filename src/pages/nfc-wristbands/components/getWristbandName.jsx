import { Skeleton, Typography } from '@mui/material';
import { useGetWristbandById } from 'api/requests';

export const WristbandName = ({ wristbandId }) => {
  const { data: wristbandData, isLoading, error } = useGetWristbandById(wristbandId);

  if (!wristbandId) {
    return <Typography variant="body2">N/A</Typography>;
  }

  if (isLoading) {
    return <Skeleton variant="text" width={120} height={20} />;
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Error loading wristband
      </Typography>
    );
  }

  return <Typography variant="body2">{wristbandData?.model || `Wristband ${wristbandId}`}</Typography>;
};
