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

                    <Typography component="h1" variant="h5">
                        Select Facility Type
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 3 }}>
                        <Grid item xs>
                            <Box sx={{ minWidth: 275, textAlign: 'center' }}>
                                <Card onClick={() => { navigate('/halls/' + hallName + '/facilities'); }}>
                                    <React.Fragment>
                                        <CardContent>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Check the availability of our
                                            </Typography>
                                            <Typography variant="h1" component="div">
                                                {hallItems.length || 0}
                                            </Typography>
                                            <Typography variant="body1">
                                                {hallItems.length > 1 ? 'Facilities' : 'Facility'}
                                            </Typography>
                                        </CardContent>
                                    </React.Fragment>
                                </Card>
                            </Box>
                        </Grid>
                        <Grid item xs>
                            <Box sx={{ minWidth: 275, textAlign: 'center' }}>
                                <Card onClick={() => { navigate('/halls/' + hallName + '/blocks'); }}>
                                    <React.Fragment>
                                        <CardContent>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Check the availability of facilities from our
                                            </Typography>
                                            <Typography variant="h1" component="div">
                                                {items.length || 0}
                                            </Typography>

                                            <Typography variant="body1">
                                                {items.length > 1 ? 'Blocks' : 'Block'}
                                            </Typography>
                                        </CardContent>
                                    </React.Fragment>
                                </Card>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

            </Container>
        )
    }
};