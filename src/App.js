/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
// import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { firebaseService } from "./FirebaseService";
import PrimarySearchAppBar from './PrimarySearchAppBar';
import Links from './pages/Links';
import Button from '@mui/material/Button';

function App() {

  const isAuth = firebaseService.useState();

  return (
    <div className="app">
      {!isAuth && <Button onClick={() => firebaseService.signIn()}>Sign in</Button>}
      {isAuth && <div className="container">
        <PrimarySearchAppBar></PrimarySearchAppBar>
        <Router>
          <Routes>
            <Route path="*" element={<Navigate to="/startpage" />} />
            <Route path="/startpage/" element={<Links />} />
          </Routes>
        </Router>
      </div>}
    </div>
  );
}


export default App;
