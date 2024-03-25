import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Assicurati di importare anche Routes
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ReportPage from './pages/ReportPage';


function App() {
  return (
    <Router>
      <Routes> {/* Wrap all your routes in a <Routes> component */}
        <Route path="/login" element={<LoginPage />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/main" element={<MainPage />} /> {/* Use 'element' prop instead of 'component' */}
        
        <Route path="/report" element={<ReportPage />} /> {/* Use 'element' prop instead of 'component' */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
