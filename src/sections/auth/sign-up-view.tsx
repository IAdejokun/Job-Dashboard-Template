import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import type {AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import axios from 'axios';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';// import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify'; 





export function SignUpView() {
  // SignupService

 const client = axios.create({
   baseURL: '',
 });


  // form data interface
  interface FormData {
        username: string;
        emailAddy: string;
        firstname: string;
        middlename: string;
      lastname: string;
      password: string;
      frontendurl: string;
      processor: string;
      is_Active: string;
    }
    
  // form errors interface
    interface FormErrors {
        [key: string]: string | undefined;
    }

    const router = useRouter();
    
    const [showPassword, setShowPassword] = useState(false)

    const [open, setOpen] = React.useState(false);

    const [errOpen, setErrOpen] = React.useState(false);
    
  const [errLogOpen, setErrLogOpen] = React.useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
       if (reason === 'clickaway') {
         return;
       }
      setOpen(false);
      setErrOpen(false);
      setErrLogOpen(false);
     };

  // setting up the form data state
    const [formData, setFormData] = useState({
        username : '',
        emailAddy : '',
        firstname : '',
        middlename : '',
        lastname : '',
      password: '',
      frontendurl: '',
      processor: '',
      is_Active:''
    })

    const [vertical] = useState<'top' | 'bottom'>('top');
    const [horizontal] = useState<'left' | 'center' | 'right'>('right');

  const [errVertical] = useState<'top' | 'bottom'>('top');
  const [errHorizontal] = useState<'left' | 'center' | 'right'>('right');
  
  const [errLogVertical] = useState<'top' | 'bottom'>('top');
  const [errLogHorizontal] = useState<'left' | 'center' | 'right'>('right');

    const [errors, setErrors] = useState<FormErrors>({})

    const [success, setSuccess] = useState(false);

    const [errData, setErrData] = useState('');
  
    // const handleSignUp = useCallback(() => {
    //     router.push('/sign-in')
    // }, [router]);

  // form change handler
    const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        setFormData({
            ...formData,
            [name]: value,
        })
    }

  // signup function handler/service

    const handleSignup = (e:React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        const username = formData.username;
        const processor = 'frontend';
        const frontendurl = `http://localhost:3039/profile/${username}`;
        
        formData.frontendurl = frontendurl;
        formData.processor = processor;
        formData.is_Active = 'true';

        console.log("Form Submitted successfully");

      // request data to be sent to the backend
        const requestBody = {
          'user': formData
        }
        console.log(requestBody);

         (async () => {
           const config: AxiosRequestConfig = {
             headers: { Accept: 'application/json' } as RawAxiosRequestHeaders,
           };

           try{
          const requestData = requestBody
             const response: AxiosResponse = await client.post('createAdmin/', requestData, config);
             console.log(response.status);
             console.log(response.data);
             setSuccess(true) 
             setOpen(true);

            setTimeout(() => {
            router.push('/sign-in');
          }, 5000 )

           } catch (err) {
             // setErrData(err instanceof Error ? err.message : 'An error occurred');
             if (axios.isAxiosError(err)) {
              const errorDetails = err.response?.data

            let errorMessage: string;
            
            if (typeof errorDetails === 'string' ) {
              errorMessage = errorDetails;
            } else if (errorDetails && typeof errorDetails === 'object') {
              errorMessage = errorDetails.detail || errorDetails.message || errorDetails.error || Object.values(errorDetails).join(', ') || 'An unexpected error occured';
            } else {
              errorMessage = 'An unexpected error occurred';
            }
            console.log('Full error response', err.response?.data);
            setErrData(errorMessage);
          } else {
               setErrData('An error occurred');
               
             }
             setErrLogOpen(true);
        }
         })();
            
        } else {
            setErrOpen(true);
        }
    }

  // form validation function

    const validateForm = (data: FormData): FormErrors => {
        const validationErrors: FormErrors = {};

        if (!data.username.trim()) {
            validationErrors.username = 'Username is required';    
        } else if (data.username.length < 4) {
            validationErrors.username = 'Username must be at least 4 characters long';
        }


         if (!data.firstname.trim()) {
            validationErrors.firstname = 'Firstname is required';    
        } else if (data.firstname.length < 3) {
            validationErrors.firstname = 'Firstname must be at least 3 characters long';
        }

         if (!data.lastname.trim()) {
            validationErrors.lastname = 'Lastname is required';    
        } else if (data.username.length < 3) {
            validationErrors.lastname = 'Lastname must be at least 3 characters long';
        }

         if (!data.middlename.trim()) {
           validationErrors.middlename = 'Middlename is required';
         } else if (data.username.length < 3) {
           validationErrors.username = 'Middlename must be at least 3 characters long';
         }

         if (!data.emailAddy.trim()) {
           validationErrors.emailAddy = 'Email is required';
         } else if (!/\S+@\S+\.\S+/.test(data.emailAddy)) {
           validationErrors.emailAddy = 'Email is invalid';
         }

        if (!data.password) {
            validationErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long';
        }
        
        return validationErrors;
    }

  // form rendering function
  
    const renderForm = (
      <Box
        component="form"
        onSubmit={handleSignup}
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <TextField
          fullWidth
          name="username"
          label="username"
          placeholder="JohnDoe"
          InputLabelProps={{ shrink: true }}
          value={formData.username}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />
        {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}

        <TextField
          fullWidth
          name="emailAddy"
          label="Email address"
          placeholder="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          value={formData.emailAddy}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

        {errors.emailAddy && <span style={{ color: 'red' }}>{errors.emailAddy}</span>}

        <TextField
          fullWidth
          name="firstname"
          label="Firstname"
          placeholder="John"
          //   defaultValue="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          value={formData.firstname}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

        {errors.firstname && <span style={{ color: 'red' }}>{errors.firstname}</span>}

        <TextField
          fullWidth
          name="middlename"
          label="Middlename"
          placeholder="Adam"
          InputLabelProps={{ shrink: true }}
          value={formData.middlename}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

            {errors.middlename && <span style={{ color: 'red' }}>{errors.middlename}</span>}

        <TextField
          fullWidth
          name="lastname"
          label="Lastname"
          placeholder="Doe"
          InputLabelProps={{ shrink: true }}
          value={formData.lastname}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

            {errors.lastname && <span style={{ color: 'red' }}>{errors.lastname}</span>}

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

        <LoadingButton fullWidth size="large" type="submit" color="inherit" variant="contained">
          Sign Up
        </LoadingButton>
      </Box>
    );    

    return (
      <>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
          <Typography variant="h5">Sign Up</Typography>
          <Typography variant="body2" color="text.secondary">
            Already have an account?
            <Link component={RouterLink} to="/sign-in" variant="subtitle2" sx={{ ml: 0.5 }}>
              Sign In
            </Link>
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
              Signup Submitted Successfully, Routing to Sign In Page
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
