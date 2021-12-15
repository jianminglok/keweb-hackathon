import React from 'react';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

export default function NotFound() {

    React.useEffect(() => {
        document.title = "Page Not Found"
    }, [])

    return(
        <Container component="main">
            <NavBar />

            <Box
                sx={{
                    marginTop: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    It seems that you are lost.
                </Typography>

                <Link to="/">Go Back to Home</Link>

            </Box>

        </Container>
    )
}