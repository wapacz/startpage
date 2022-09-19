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
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from "./FirebaseService";

function App() {

  const isAuth = firebaseService.useState();

  return (
    <>
      {!isAuth && <Button onClick={() => firebaseService.signIn()}>Sign in</Button>}
      {isAuth && <Box sx={{ display: 'flex' }}>
        <AppBar />
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <Router>
            <Routes>
              <Route path="*" element={<Navigate to="/startpage" />} />
              <Route path="/startpage/" element={<Links />} />
            </Routes>
          </Router>
        </Box>
      </Box>}
    </>
  );
}


export default App;
