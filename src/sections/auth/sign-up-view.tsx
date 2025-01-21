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
import type { RadioProps } from '@mui/material/Radio';

import Radio from '@mui/material/Radio';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';




// styling for radios

  const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
      ...theme.applyStyles('dark', {
        backgroundColor: '#30404d',
      }),
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
      ...theme.applyStyles('dark', {
        background: 'rgba(57,75,89,.5)',
      }),
    },
    ...theme.applyStyles('dark', {
      boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
      backgroundColor: '#394b59',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    }),
  }));

  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  });

  // Inspired by blueprintjs
  function BpRadio(props: RadioProps) {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    );
  }



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
  
  const [isStaff, setStaff] = useState(true)

  const [isStudent, setStudent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  
  const [showConfirmPassword, setShowConfirmPasword] = useState(false)

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
        // const username = formData.username;
        const processor = 'verify';
        const frontendurl = `http://jobs.run.edu.ng/`;
        
        if (isStaff) {
          formData.username = 'randomUser'
        }

        if (isStudent) {
          formData.emailAddy = 'randomuser@gmail.com'
        }

        formData.frontendurl = frontendurl;
        formData.processor = processor;
        formData.is_Active = 'true';


        console.log("Form Submitted successfully");

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
            router.push('/verify');
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

      if(isStudent === true)
        if (!data.username.trim()) {
            validationErrors.username = 'Username is required';    
        } else if (!/^run\/[a-z]{3}\/\d{2}\/\d{4}$/i.test(data.username)) {
             validationErrors.username = 'Username must be in the format: run/abc/12/3456';
      }
      
          if(isStaff === true){
         if (!data.emailAddy.trim()) {
           validationErrors.emailAddy = 'Email is required';
         } else if (!/\S+@\S+\.\S+/.test(data.emailAddy)) {
           validationErrors.emailAddy = 'Email is invalid';
            }
            
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
          label="username"
          placeholder="JohnDoe"
          InputLabelProps={{ shrink: true }}
          value={formData.username}
          onChange={handleChange}
          autoComplete="true"
          sx={{ mb: 3 }}
          disabled = {isStaff}
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
          disabled = {isStudent}
        />

        {errors.emailAddy && <span style={{ color: 'red' }}>{errors.emailAddy}</span>}

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

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          placeholder="@demo1234"
          value={formData.confirmPassword}
          onChange={handleChange}
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

        {/* add the radio buttons */}

        <FormControl fullWidth sx={{ mb: 1}}>
          <FormLabel id="demo-customized-radios" sx={{ml:1}}>Role</FormLabel>
          <RadioGroup
            row
            defaultValue="Staff"
            aria-labelledby="demo-customized-radios"
            name="customized-radios"
            sx={{ ml: 1 }}
          >
            <FormControlLabel value="Staff" control={<BpRadio />} label="Staff" onClick={() => { setStaff(true); setStudent(false) }} />
            <FormControlLabel value="Student" control={<BpRadio />} label="Student" onClick={() => { setStudent(true); setStaff(false) }} />
          </RadioGroup>
        </FormControl>

        {isStudent && <p>Email field not required for student </p> }
        {isStaff && <p>Username field not required for staff</p> }

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