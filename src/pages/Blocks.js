import React from 'react';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import BackIcon from '@mui/icons-material/ArrowBack';
import Loading from './../components/Loading';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Blocks() {

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);

    let navigate = useNavigate();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'dark',
                },
            }),
        [prefersDarkMode],
    );

    let { hall } = useParams();

    React.useEffect(async () => {

        document.title = "Select your Block"

        axios.get("/api/venues/" + hall).then(
            (response) => {
                const allItems = response.data;
                setItems(allItems);
                setIsLoaded(true);
            }
        ).catch(error => {
            setIsLoaded(true);
            setError(error)
        });

    }, [])

    if (error) {
        return (
            <Container component="main">
                <NavBar />

                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>
                </Box>

                <Fab variant="extended" color="primary" onClick={() => navigate(-1)} style={{
                    position: 'fixed', bottom: theme.spacing(4),
                    right: theme.spacing(4)
                }}>
                    <BackIcon sx={{ mr: 1 }} />
                    Back
                </Fab>
            </Container>
        )
    } else if (!isLoaded) {
        return <Loading />;
    } else {
        return (
            <Container component="main">
                <NavBar />

                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Select your Block
                    </Typography>

                    {items.msg ? <Alert severity="info" sx={{ mt: 2 }}>{items.msg}</Alert> :
                        <Grid container spacing={3} sx={{ mt: 3, mb: 8 }}>
                            {items.map(item => (
                                <Grid item xs key={item.id}>
                                    <Box sx={{ minWidth: 275, textAlign: 'center' }} onClick={() => navigate('/halls/' + hall + '/blocks/' + item.id + '/facilities')}>
                                        <Card>
                                            <React.Fragment>
                                                <CardContent>
                                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                        Check the availability of
                                                    </Typography>
                                                    <Typography variant="h1" component="div" sx={{ mb: 2 }}>
                                                        {item.id || 0}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Block Facilities
                                                    </Typography>
                                                </CardContent>
                                            </React.Fragment>
                                        </Card>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    }

                </Box>

                <Fab variant="extended" color="primary" onClick={() => navigate(-1)} style={{
                    position: 'fixed', bottom: theme.spacing(4),
                    right: theme.spacing(4)
                }}>
                    <BackIcon sx={{ mr: 1 }} />
                    Back
                </Fab>
            </Container>
        )
    }
};