import { useCallback } from 'react'

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
// import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

export function ForgotPasswordView() {
    const router = useRouter();

    const handleForgotPassword = useCallback(() => {
        router.push('');
    }, [router]);

    const renderForm = (
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="email"
          label="Email address"
          defaultValue="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          onClick={handleForgotPassword}
        >
          Get Reset Link
        </LoadingButton>
      </Box>
    );

    return (
      <>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Forgot Password</Typography>
          <Typography variant="body2" color="text.secondary">
            Input Email to Reset Password
          </Typography>
            </Box>
            
        {renderForm}
      </>
    );

}