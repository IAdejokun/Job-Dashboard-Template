// import type { AdminData } from 'src/interface/admin-data';

// import axios from 'axios';
import {useState, useEffect} from 'react'

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { useAdminData } from 'src/routes/hooks/useAdminData'

import { DashboardContent } from 'src/layouts/dashboard';

// import { setInterval } from 'timers/promises';

// ----------------------------------------------------------------------

export function ProfileView() {
  const { data: adminData, error, isError, refetch } = useAdminData();

  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(true);
      refetch();
    };

    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refetch]);

  // capitalize the firstletter

  function capitalizeFirstLetter(string: string) {
    const randomString = string.toLowerCase();
    return randomString.charAt(0).toUpperCase() + randomString.slice(1);
  }

  const Fullname =
    adminData?.lastname && adminData?.firstname
      ? `${capitalizeFirstLetter(adminData.lastname)} ${capitalizeFirstLetter(adminData.firstname)} ${capitalizeFirstLetter(adminData.middlename)}`
      : 'Guest';

  return (
    <DashboardContent>
      {!networkStatus && (
        <Alert severity="error" sx={{ mb: 3 }}>
          No internet connection - changes will sync when back online
        </Alert>
      )}

      {isError && networkStatus && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to fetch admin data'}
        </Alert>
      )}

      {/* {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error instanceof Error ? error.message : 'Failed to fetch admin data'}
        </Alert>
      )} */}

      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Profile
        </Typography>
      </Box>

      <Box>
        <Box display="flex" sx={{ alignItems: 'center', my: '14px' }}>
          <Typography variant="h5">Name:</Typography>
          <Typography variant="body1" sx={{ mt: '2px', ml: '15px' }}>
            {Fullname}
          </Typography>
        </Box>
        <Box display="flex" sx={{ alignItems: 'center', my: '14px' }}>
          <Typography variant="h5">Email:</Typography>
          <Typography variant="body1" sx={{ mt: '2px', ml: '15px' }}>
            {adminData ? adminData.emailAddy : 'Guest'}
          </Typography>
        </Box>
        <Box display="flex" sx={{ alignItems: 'center', my: '14px' }}>
          <Typography variant="h5">Date Joined:</Typography>
          <Typography variant="body1" sx={{ mt: '2px', ml: '15px' }}>
            {adminData ? adminData.dateCreated.slice(0, 10) : 'Guest'}
          </Typography>
        </Box>
      </Box>
    </DashboardContent>
  );
}
