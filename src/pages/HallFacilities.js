import React from 'react';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import BackIcon from '@mui/icons-material/ArrowBack';
import Loading from './../components/Loading';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';

export default function HallFacilities() {

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [csrf_token, setCsrfToken] = React.useState(false);

    let navigate = useNavigate();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    let { hall } = useParams();

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    var currentUser = localStorage.getItem('currentUser');

    const checkIn = (venue_id) => {
        var bodyFormData = new FormData();
        bodyFormData.append('occupant_id', currentUser);
        bodyFormData.append('venue_id', venue_id);
        bodyFormData.append('hall_name', hall);
        bodyFormData.append('blk_name', "hall");
        bodyFormData.append('csrf_token', csrf_token);

        return axios({
            method: "post",
            "url": `/api/venues/checkin`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async () => {
            axios.get("/api/venues/" + hall + "/hall").then(
                (response) => {
                    const allItems = response.data;
                    setCsrfToken(allItems.jwt);
                    setItems(allItems);
                    setIsLoaded(true);
                }
            ).catch(error => {
                setIsLoaded(true);
                setError(error)
            });
        }).catch((err) => {
            if (err) {
                if ("response" in err) {
                    setError(err.response.data.msg);
                } else {
                    setError(err);
                }
            }
        })
    };

    const checkOut = (venue_id) => {
        var bodyFormData = new FormData();
        bodyFormData.append('occupant_id', currentUser);
        bodyFormData.append('venue_id', venue_id);
        bodyFormData.append('hall_name', hall);
        bodyFormData.append('blk_name', "hall");
        bodyFormData.append('csrf_token', csrf_token);

        return axios({
            method: "post",
            "url": `/api/venues/checkout`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(async () => {
            axios.get("/api/venues/" + hall + "/hall").then(
                (response) => {
                    const allItems = response.data;
                    setCsrfToken(allItems.jwt);
                    setItems(allItems);
                    setIsLoaded(true);
                }
            ).catch(error => {
                setIsLoaded(true);
                setError(error)
            });
        }).catch((err) => {
            if (err) {
                if ("response" in err) {
                    setError(err.response.data.msg);
                } else {
                    setError(err);
                }
            }
        })
    };

    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    React.useEffect(async () => {

        document.title = "Hall Facilities"

        axios.get("/api/venues/" + hall + "/hall").then(
            (response) => {
                const allItems = response.data;
                setCsrfToken(allItems.jwt);
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
        return <Loading />
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
                        View Hall Facilities
                    </Typography>

                    {items.msg ? <Alert severity="info" sx={{ mt: 2 }}>{items.msg}</Alert> :
                        <Grid container spacing={3} sx={{ mt: 3, mb: 8 }}>
                            {items.data.map(item => (
                                <Grid item xs key={item.id}>
                                    <Box sx={{ minWidth: { xs: '275px', md: "90vh" } }}>
                                        <Card >
                                            <Box sx={{ margin: 2 }}>
                                                <React.Fragment>

                                                    <CardHeader
                                                        title={
                                                            <Grid container>
                                                                <Typography component="h1" variant="h5" xs>
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography component="h2" variant="h6" xs sx={{ ml: 2 }} color="text.secondary">
                                                                    {item.occupant.toString() + ' / ' + item.max_capacity.toString() + ' Users'}
                                                                </Typography>
                                                            </Grid>
                                                        }
                                                        subheader={
                                                            Math.round(item.occupant / item.max_capacity * 100) >= 80 ? <Chip label="Quite Full" color="error" sx={{ mt: 1.5 }} /> : Math.round(item.occupant / item.max_capacity * 100) >= 40 ? <Chip label="Not That Empty" color="warning" sx={{ mt: 1.5 }} /> : <Chip label="Quite Empty" color="success" sx={{ mt: 1.5 }} />
                                                        }
                                                    />

                                                    <CardContent sx={{ textAlign: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                                <LinearProgress value={Math.round(item.occupant / item.max_capacity * 100)} variant="determinate" sx={{ height: 10, borderRadius: 5 }} />
                                                            </Box>
                                                            <Box sx={{ minWidth: 80 }}>
                                                                <Typography variant="body2" color="text.secondary">{`${Math.round(item.occupant / item.max_capacity * 100)}% Full`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                    <CardActions>
                                                        {item.occupant < item.max_capacity ? "occupant_list" in item ? item.occupant_list.includes(currentUser) ? <Button onClick={() => checkOut(item.id)} size="small">Check Out</Button> : <Button onClick={() => checkIn(item.id)} size="small">Check In</Button> : <Button onClick={() => checkIn(item.id)} size="small">Check In</Button> : <Grid />}
                                                    </CardActions>
                                                </React.Fragment>
                                            </Box>
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
            </Container >
        )
    }
};