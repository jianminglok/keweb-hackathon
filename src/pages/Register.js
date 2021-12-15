import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import NavBar from '../components/NavBar'
import useAuth from './../hooks/useAuth';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

export default function Register() {

    const { register, handleSubmit, control, setError, watch, formState: { errors } } = useForm();

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const password = React.useRef({});
    password.current = watch("password", "");

    var hallName;

    const { registerUser, error } = useAuth();

    const onSubmit = React.useCallback((values) => {
        registerUser(values);
    }, []);

    const isNUSEmail = (email) => {
        return email.includes("nus.edu");
    };

    React.useEffect(() => {
        document.title = "Sign Up"
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <NavBar />
            <Box
                sx={{
                    marginTop: 3,
                    marginBottom: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="first_name"
                                required
                                fullWidth
                                id="first_name"
                                label="First Name"
                                autoFocus
                                error={errors.first_name ? true : false}
                                helperText="First Name"
                                {...register("first_name", {
                                    required: true
                                })}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="last_name"
                                label="Last Name"
                                name="last_name"
                                autoComplete="family-name"
                                error={errors.last_name ? true : false}
                                helperText="Last Name"
                                {...register("last_name", {
                                    required: true
                                })}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        name="email"
                        label="Email Address"
                        error={errors.email ? true : false}
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
                        error={errors.password ? true : false}
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="false"
                        error={errors.confirmPassword ? true : false}
                        helperText={errors.confirmPassword ? errors.confirmPassword.message != '' ? errors.confirmPassword.message : "Please enter your password again" : "Please enter your password again"}
                        {...register("confirmPassword", {
                            required: true,
                            validate: value =>
                                value === password.current || "Yours passwords do not match"
                        })}
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirmPassword visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownConfirmPassword}
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <TextField
                            select
                            id="hall_name"
                            label="Hall Name"
                            defaultValue=''
                            error={errors.hall_name ? true : false}
                            helperText="Please select the hall your are residing in"
                            required
                            {...register("hall_name", {
                                required: true
                            })}
                        >
                            <MenuItem value='KE7'>King Edward VII Hall</MenuItem>
                            <MenuItem value='Eusoff'>Eusoff Hall</MenuItem>
                            <MenuItem value='KR'>Kent Ridge Hall</MenuItem>
                            <MenuItem value='Raffles'>Raffles Hall</MenuItem>
                            <MenuItem value='Sheares'>Sheares Hall</MenuItem>
                            <MenuItem value='Temasek'>Temasek Hall</MenuItem>
                        </TextField>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>



                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
