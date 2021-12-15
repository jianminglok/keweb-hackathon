import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import NavBar from '../components/NavBar'
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import useAuth from './../hooks/useAuth';

export default function Login() {

    const { register, handleSubmit, control, setError, formState: { errors } } = useForm();

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const { loginUser, error } = useAuth();

    const onSubmit = React.useCallback((values) => {
        loginUser(values);
    }, []);


    const isNUSEmail = (email) => {
        return email.includes("nus.edu");
    };

    React.useEffect(() => {
        document.title = "Sign in"
    }, [])

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={2} sm={8} md={5} component={Paper} elevation={6} square>
                <Box 
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        King Edward VII Facility Checker
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            name="email"
                            label="Email Address"
                            error={errors.email ? true : errors.apiError ? true : false}
                            helperText={errors.email ? "Please enter a valid NUS email address" : "Please enter your NUS email address"}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            autoComplete="email"
                            autoFocus
                            {...register("email", {
                                validate: isNUSEmail
                            })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            error={errors.password ? true : errors.apiError ? true : false}
                            helperText="Please enter your password"
                            {...register("password", {
                                required: true
                            })}
                            InputProps={{ // <-- This is where the toggle button is added.
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={10}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://nus.edu.sg/osa/images/default-source/kevii-hall/open-house/ke7.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[50],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

        </Grid>
    )
}