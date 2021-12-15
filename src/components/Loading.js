import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import NavBar from '../components/NavBar'
import CssBaseline from '@mui/material/CssBaseline';
import Backdrop from '@mui/material/Backdrop';

export default function Loading() {

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleToggle = () => {
    setOpen(!open);
  };

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
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Container>
  );
}