/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from './AppBar';
import Button from '@mui/material/Button';
import Links from './pages/Links';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from "./FirebaseService";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  const isAuth = firebaseService.useState();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!isAuth && <Button onClick={() => firebaseService.signIn()}>Sign in</Button>}
      {isAuth && <Box>
        <AppBar />
        <Box component="main" sx={{ p: 1 }}>
          <Toolbar />
          <Router>
            <Routes>
              <Route path="*" element={<Navigate to="/startpage" />} />
              <Route path="/startpage/" element={<Links />} />
            </Routes>
          </Router>
        </Box>
      </Box>}
    </ThemeProvider>
  );
}


export default App;
