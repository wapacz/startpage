/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { firebaseService } from "./FirebaseService";
import Links from './pages/Links';

function App() {

  const isAuth = firebaseService.useState();

  return (
    <div className="app">
      <div className="container">
        <Router>
          <nav className="nav">
            {/* <Link to="/">Links</Link> */}
            {!isAuth && <button className="button" onClick={() => firebaseService.signIn()}>Sign in with Google</button>}
            {isAuth && <button className="button" onClick={() => firebaseService.signOut()}>Log Out</button>}
          </nav>
          <Routes>
            <Route path="/startpage/" element={<Links />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}


export default App;
