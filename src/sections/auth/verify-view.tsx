import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import type { AxiosResponse,AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton'; // import Divider from '@mui/material/Divider';
import {useSearchParams} from 'react-router-dom'

import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';



export function VerifyView() {

interface VerifyFormData {
  email: string;
  password: string;
  eCode: string;
}

interface FormErrors {
    [key: string]: string | undefined;
    }
    
    // verifyService

  const client = axios.create({
    baseURL: 'http://jobapi.run.edu.ng/',
  });

  const router = useRouter();
    
  const [searchParams] = useSearchParams();

  const [vertical] = useState<'top' | 'bottom'>('top');
  const [horizontal] = useState<'left' | 'center' | 'right'>('right');

  const [errVertical] = useState<'top' | 'bottom'>('top');
  const [errHorizontal] = useState<'left' | 'center' | 'right'>('right');

  const [errLogVertical] = useState<'top' | 'bottom'>('top');
  const [errLogHorizontal] = useState<'left' | 'center' | 'right'>('right');

 const [errors, setErrors] = useState<FormErrors>({});

 const [success, setSuccess] = useState(false);


  const [showPassword, setShowPassword] = useState(false);

  const [open, setOpen] = React.useState(false);

  const [errOpen, setErrOpen] = React.useState(false);

  const [errData, setErrData] = useState('');

  const [errLogOpen, setErrLogOpen] = React.useState(false);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const codeFromParams = searchParams.get('is')
    if (codeFromParams) {
      setFormData((prevData) => ({
        ...prevData,
        eCode: codeFromParams
      }))
    }
  }, [searchParams])
  
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setErrOpen(false);
    setErrLogOpen(false);
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    eCode: '',
  });

    // form change handler
     const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
               const { name, value } = e.currentTarget;
               setFormData({
                   ...formData,
                   [name]: value,
               })
           }
    
    const handleVerification = (e: React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      setClicked(true);
        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            console.log("Form Submitted Successfully");

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
                    const response: AxiosResponse = await client.patch('verifyAdmin/', requestData, config);
                    console.log(response.status);
                    console.log(response.data);
                    setSuccess(true)
                    setOpen(true)
                    
                    setTimeout(() => {
                        router.push('/sign-in');
                    }, 5000)

                } catch (err) {

                    if (axios.isAxiosError(err)) {
                        const errorDetails = err.response?.data
                   
                        let errorMessage: string;

                        if (typeof errorDetails === 'string') {
                            errorMessage = errorDetails;
                        } else if (errorDetails && typeof errorDetails === 'object') {
                            errorMessage = errorDetails.detail || errorDetails.message || errorDetails.error || Object.values(errorDetails).join(', ') || 'An unexpected error occured';
                        } else {
                            errorMessage = 'An unexpected error occurred';
                        }
                      console.log('Full error response', err.response?.data);
                      setClicked(false)
                        setErrData(errorMessage);
                    } else {
                        setErrData('An error occurred');
                  }
                  setClicked(false)
                    setErrLogOpen(true);
                }
            })();
        } else {
            setClicked(false)
            setErrOpen(true);
            }

    }

  // form validation function
  
 const validateForm = (data: VerifyFormData): FormErrors => {
    const validationErrors: FormErrors = {};

    if (!data.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      validationErrors.password = 'Password is required';
    } else if (data.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters long';
    }

    return validationErrors;
  };



    
    // form rendering function
    
    const renderForm = (
      <Box
        component="form"
        onSubmit={handleVerification}
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <TextField
          fullWidth
          name="email"
          label="Email address"
          placeholder="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          value={formData.email}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}

        <TextField
          fullWidth
          name="password"
          label="Password"
          placeholder="@demo1234"
          value={formData.password}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}

        <LoadingButton loading={clicked} fullWidth size="large" type="submit" color="inherit" variant="contained">
          Verify Account 
        </LoadingButton>
      </Box>
    );

    return (
      <>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Verify Account </Typography>
          <Typography variant="body2" color="text.secondary">
            Verify your account
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
                        Verification Submitted Successfully, Routing to Signin Page
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
