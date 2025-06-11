/* eslint-disable no-unused-vars */
import React from 'react';
import { Chip, Skeleton, Typography, Stack } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { userService } from 'api';

export const POSName = ({ assignedPOSDeviceIds }) => {
  const ids = Array.isArray(assignedPOSDeviceIds) ? assignedPOSDeviceIds : [assignedPOSDeviceIds];
  const results = useQueries({
    queries:
      ids.length === 0
        ? []
        : ids.map((id) => ({
            queryKey: ['posDevice', id],
            queryFn: () => userService.getPOSDeviceById(id)
          }))
  });

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {results.map((result, index) => {
        const id = ids[index];

        if (result.isLoading) {
          return <Skeleton key={id} variant="text" width={80} height={24} />;
        }

        if (result.error) {
          return <Chip key={id} label={`Error (${id})`} color="error" variant="outlined" size="small" />;
        }

        return <Chip key={id} label={result.data?.name || `POS ${id}`} color="primary" variant="outlined" size="small" />;
      })}
    </Stack>
  );
};
