import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Assicurati di importare anche Routes
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';
import QuestionsPage from './pages/QuestionsPage';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Routes> {/* Wrap all your routes in a <Routes> component */}
        <Route path="/login" element={<LoginPage />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/" element={<ReportPage />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
