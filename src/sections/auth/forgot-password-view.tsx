import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import type { AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import axios from 'axios';
import React, {useState} from 'react'

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

export function ForgotPasswordView() {
    const router = useRouter();

  const client = axios.create({
    baseURL: 'http://jobapi.run.edu.ng/',
  });


  interface ForgotPasswordFormData {
    emailAddy: string;
    frontendURL: string;
    processor: string;
  }

  interface FormErrors{
    [key: string]: string | undefined;
  }


  const [vertical] = useState<'top' | 'bottom'>('top');
  const [horizontal] = useState<'left' | 'center' | 'right'>('right');
  
  const [errVertical] = useState<'top' | 'bottom'>('top');
  const [errHorizontal] = useState<'left' | 'center' | 'right'>('right');
  
  const [errLogVertical] = useState<'top' | 'bottom'>('top');
  const [errLogHorizontal] = useState<'left' | 'center' | 'right'>('right');
     
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = React.useState(false);
    
  const [errOpen, setErrOpen] = React.useState(false);

  const [errData, setErrData] = useState('');
  
    const [errLogOpen, setErrLogOpen] = React.useState(false);
    
    const [, setUserEmail] = useState('');
  
  const [clicked, setClicked] = useState(false);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
           if (reason === 'clickaway') {
             return;
           }
      setOpen(false);
      setErrOpen(false);
      setErrLogOpen(false);
    };

  const [formData, setFormData] = useState({
            emailAddy : '',
            frontendURL: '',
            processor:''
        })
  
  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.currentTarget;
            setFormData({
                ...formData,
                [name]: value,
            })
        }
  
  
    const handleForgotPassword = (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      setClicked(true);
      const newErrors = validateForm(formData);
      setErrors(newErrors);
     
      if (Object.keys(newErrors).length === 0) {
     
        const processor = 'reset-password';
      

        // const frontendURL = 'https://679428dce1da876ade336a1d--luxury-tapioca-ddcd88.netlify.app';
     
        // const frontendURL = 'http://jobs.run.edu.ng';

        const frontendURL = 'http://localhost:3039';
      
        formData.frontendURL = frontendURL;
        formData.processor = processor;
        console.log('Form Submitted Successfully');

        const requestBody = {
          payload: formData
        }

        console.log(requestBody);

        (async () => {
          const config: AxiosRequestConfig = {
            headers: { Accept: 'application/json' } as RawAxiosRequestHeaders,
          };

          try {
            const requestData = requestBody;
            console.log(requestData.payload, '#request data is submitting');
            const response: AxiosResponse = await client.post('sendPassResetLinkAdmin/', requestData, config);
            console.log(response.status);
            console.log(response.data);

            // save the user email
            setUserEmail(formData.emailAddy);

            setSuccess(true);
            setOpen(true);

            setTimeout(() => {
              router.push('/password-link');
            }, 5000);
          } catch (err) {
            // setErrData(err instanceof Error ? err.message : 'An error occurred');
            if (axios.isAxiosError(err)) {
              const errorDetails = err.response?.data;

              let errorMessage: string;

              if (typeof errorDetails === 'string') {
                errorMessage = errorDetails;
              } else if (errorDetails && typeof errorDetails === 'object') {
                errorMessage =
                  errorDetails.detail ||
                  errorDetails.message ||
                  errorDetails.error ||
                  Object.values(errorDetails).join(', ') ||
                  'An unexpected error occured';
              } else {
                errorMessage = 'An unexpected error occurred';
              }
              console.log('Full error response', err.response?.data);
              setErrData(errorMessage);
            } else {
              setErrData('An error occurred');
            }
            setClicked(false)
            setErrLogOpen(true);
          }
        })();
      } else{
        setClicked(false);
        setErrOpen(true);
      }
};

  
  const validateForm = (data: ForgotPasswordFormData): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!data.emailAddy.trim()) {
      validationErrors.emailAddy = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.emailAddy)) {
      validationErrors.emailAddy = 'EmailAddy is invalid';
    }

    return validationErrors;
  };
  
    const renderForm = (
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        onSubmit={handleForgotPassword}
      >
        <TextField
          fullWidth
          name="emailAddy"
          label="Email address"
          placeholder="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

        <LoadingButton loading={clicked} fullWidth size="large" type="submit" color="inherit" variant="contained">
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

        {/* snackbar config */}
        
              {success && (
                <Snackbar
                  anchorOrigin={{ vertical, horizontal }}
                  open={open}
                  autoHideDuration={7000}
                  onClose={handleClose}
                  key={vertical + horizontal}
                >
                  <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Password Reset Link sent to {formData.emailAddy}
                  </Alert>
                </Snackbar>
              )}
        
              {errors && (
                <Snackbar
                  anchorOrigin={{ vertical: errVertical, horizontal: errHorizontal }}
                  open={errOpen}
                  autoHideDuration={7000}
                  onClose={handleClose}
                  key={`error ${errVertical} + ${errHorizontal}`}
                >
                  <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                    Form validation failed due to validation errors
                  </Alert>
                </Snackbar>
              )}
        
              {errLogOpen && (
                        <Snackbar
                          anchorOrigin={{ vertical: errLogVertical, horizontal: errLogHorizontal }}
                          open={errLogOpen}
                          autoHideDuration={7000}
                          onClose={handleClose}
                          key={`error log ${errLogVertical} + ${errLogHorizontal}`}
                        >
                          <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                            {errData}
                          </Alert>
                        </Snackbar>
                      )}
      </>
    );

}