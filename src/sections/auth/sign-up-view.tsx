import type { SnackbarCloseReason } from '@mui/material/Snackbar';
import type {AxiosResponse, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import axios from 'axios';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';


export function SignUpView() {
  // SignupService

 const client = axios.create({
   baseURL: 'http://jobapi.run.edu.ng/',
 });


  // form data interface
  interface FormData {
      username: string;
      emailAddy: string;
      password: string;
      confirmPassword: string;
      frontendurl: string;
      processor: string;
      is_Active: string;
    }
    
  // form errors interface
    interface FormErrors {
        [key: string]: string | undefined;
    }

  const router = useRouter();
  
  // const [isStaff, setStaff] = useState(true)

  // const [isStudent, setStudent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  
  const [showConfirmPassword, setShowConfirmPasword] = useState(false)

    const [open, setOpen] = React.useState(false);

    const [errOpen, setErrOpen] = React.useState(false);
    
  const [errLogOpen, setErrLogOpen] = React.useState(false);

  const [clicked, setClicked] = useState(false);

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
      password: '',
      confirmPassword: '',
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
  

  // form change handler

    const [inputValue, setInputValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

      const { value } = e.target;
      setInputValue(value);

      // email validation

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
      const isEmail = emailRegex.test(value);
      
      // username validation

      const isUsername = value.length > 3

      if (isEmail) {
        setFormData(prev => ({
          ...prev, 
          emailAddy: value,
          username: 'dummy_username' 
        }))
      } else if (isUsername) {
        setFormData(prev => ({
          ...prev,
          emailAddy: 'default_dummy@gmail.com',
          username: value.trim()
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          emailAddy: '',
          username: ''
         }))
        }
    }

  // signup function handler/service

    const handleSignup = (e:React.FormEvent<HTMLInputElement>) => {
      e.preventDefault();
      setClicked(true);
        const newErrors = validateForm(formData);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        // const username = formData.username;
        const processor = 'verify';
        const frontendurl = `http://jobs.run.edu.ng/`;
        
        formData.frontendurl = frontendurl;
        formData.processor = processor;
        formData.is_Active = 'true';


        console.log(`Form Submitted successfully, Check email to verify your account`);

      // request data to be sent to the backend
        const requestBody = {
          user: {
            username: formData.username,
            emailAddy: formData.emailAddy,
            password: formData.password,
            frontendurl: formData.frontendurl,
            processor: formData.processor,
            is_Active: formData.is_Active,
          },
        };
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
             setClicked(false);
             setErrLogOpen(true);
        }
         })();
      } else {
        setClicked(false);
            setErrOpen(true);
        }
    }

  // form validation function

    const validateForm = (data: FormData): FormErrors => {
        const validationErrors: FormErrors = {};

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       const isEmailValid = emailRegex.test(data.emailAddy);
       const isUsernameValid = data.username.trim().split(/\s+/).length > 3;

       if (!isEmailValid && !isUsernameValid) {
         validationErrors.emailAddy =
           'Please enter a valid email or username with more than three words';
       }
      
        if (!data.password) {
            validationErrors.password = 'Password is required';
        } else if (data.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long';
      }
      
      if (!data.confirmPassword) {
        validationErrors.confirmPassword = 'Confirm your Password';
      } else if (data.confirmPassword.length < 8) {
        validationErrors.confirmPassword = 'Password must be at least 8 characters long';
      } else if (data.confirmPassword !== data.password){
        validationErrors.confirmPassword = 'Password do not match';
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
          label="Username / Email"
          placeholder="Enter email or username (4+ words)"
          InputLabelProps={{ shrink: true }}
          value={inputValue}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
        />

         {errors.emailAddy && <span style={{ color: 'red' }}>{errors.emailAddy}</span>} 
        
        <TextField
          fullWidth
          name="password"
          label="Password"
          placeholder="@demo1234"
          value={formData.password}
          onChange={e => setFormData(prev => ({...prev, password: e.target.value}))}
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

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          placeholder="@demo1234"
          value={formData.confirmPassword}
          onChange={e => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
          InputLabelProps={{ shrink: true }}
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPasword(!showConfirmPassword)} edge="end">
                  <Iconify
                    icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}

        <LoadingButton loading={clicked} fullWidth size="large" type="submit" color="inherit" variant="contained">
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
              Signup Submitted Successfully, Check email to verify your account, Routing to Sign In Page
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
