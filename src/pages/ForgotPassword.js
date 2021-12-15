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

export default function ForgotPassword() {

    const { register, handleSubmit, control, setError, watch, formState: { errors } } = useForm();

    const { forgotPassword, error, success } = useAuth();

    const onSubmit = React.useCallback((values) => {
        forgotPassword(values);
    }, []);

    const isNUSEmail = (email) => {
        return email.includes("nus.edu");
    };

    React.useEffect(() => {
        document.title = "Forgot Password"
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <NavBar />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>

                {success && <Alert severity="success" sx={{ mt: 2 }}>{ success }</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{ error }</Alert>}

                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <TextField
                        name="email"
                        label="Email Address"
                        error={errors.email ? true : false}
                        helperText={errors.email ? "Please enter a valid registered NUS email address" : "Please enter your registered NUS email address"}
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset Password
                    </Button>

                   
                    
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Go back to sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
