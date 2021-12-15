import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { UserContext } from './hooks/UserContext';
import useFindUser from './hooks/useFindUser';
import PrivateRoute from './pages/PrivateRoute';
import Home from './pages/Home';
import Blocks from './pages/Blocks';
import BlockFacilities from './pages/BlockFacilities';
import HallFacilities from './pages/HallFacilities';
import NotFound from './pages/NotFound';

export default function App() {

  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const { user, setUser, isLoading } = useFindUser();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'dark',
          primary: {
            main: '#ffffff',
          },
          secondary: {
            main: '#393e46',
          },
          background: {
            default: "#222831"
          },
        },
        typography: {
          button: {
            textTransform: 'none'
          }
        },
        components: {
          MuiToolbar: {
            styleOverrides: {
              root: {
                // apply theme's border-radius instead of component's default
                backgroundColor: '#393e46'
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                // apply theme's border-radius instead of component's default
                backgroundColor: '#393e46'
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                // apply theme's border-radius instead of component's default
                backgroundColor: '#222831'
              },
            },
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <div className="app">

      <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser, isLoading }}>
          <Routes>

            <Route exact path="/login" element={user ? <Navigate to='/' /> : <Login />} />
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path='/' element={<Home />} />
            </Route>
            <Route exact path="/halls/:hall/blocks" element={<PrivateRoute />}>
              <Route exact path='/halls/:hall/blocks' element={<Blocks />} />
            </Route>
            <Route exact path="/halls/:hall/blocks/:blk/facilities" element={<PrivateRoute />}>
              <Route exact path='/halls/:hall/blocks/:blk/facilities' element={<BlockFacilities />} />
            </Route>
            <Route exact path="/halls/:hall/facilities" element={<PrivateRoute />}>
              <Route exact path='/halls/:hall/facilities' element={<HallFacilities />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}
