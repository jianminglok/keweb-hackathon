import React from 'react';
import NavBar from '../components/NavBar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Loading from './../components/Loading';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Home() {

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [hallItems, setHallItems] = React.useState([]);

    let navigate = useNavigate();

    //var hallName = localStorage.getItem('hallName');
    var hallName = 'KE7';

    React.useEffect(async () => {

        document.title = "Select Facility Type"

        axios.get("/api/venues/" + hallName).then(
            (response) => {
                const allItems = response.data;
                setItems(allItems);
                setIsLoaded(true);
            }
        ).catch(error => {
            setIsLoaded(true);
            setError(error)
        });

        axios.get("/api/venues/" + hallName + "/hall").then(
            (response) => {
                if ("data" in response.data) {
                    const allHallItems = response.data.data;
                    setHallItems(allHallItems);
                }
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
            </Container>
        )
    } else if (!isLoaded) {
        return <Loading />;
    } else {
        return (
            <Container component="main" justify="center">
                <NavBar />

                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Grid container spacing={1} sx={{ mt: { md: 30 }, mb: 6 }}>
                        <Grid item xs>
                            <Box sx={{ minWidth: 275, textAlign: 'center', bgColor: '#222831' }}>
                                <Button>
                                    <Card onClick={() => { navigate('/halls/' + hallName + '/facilities'); }}>
                                        <React.Fragment>
                                            <CardContent sx={{ margin: 3 }}>
                                                <Typography variant="h2" component="div">
                                                    Hall Facility
                                                </Typography>
                                            </CardContent>
                                        </React.Fragment>
                                    </Card>
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ minWidth: 275, textAlign: 'center', color: '#222831' }}>
                                <Button>
                                    <Card onClick={() => { navigate('/halls/' + hallName + '/blocks/A/facilities'); }}>
                                        <React.Fragment>
                                            <CardContent sx={{ margin: 3 }}>
                                                <Typography variant="h2" component="div">
                                                    Block Facility
                                                </Typography>
                                            </CardContent>
                                        </React.Fragment>
                                    </Card>
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Container>
        )
    }
};