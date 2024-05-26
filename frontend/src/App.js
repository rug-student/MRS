import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import ReportPage from './pages/ReportPage';
import QuestionsPage from './pages/QuestionsPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import SingleReport from './pages/SingleReport';


function App() {
  return (
    <Routes> {/* Wrap all your routes in a <Routes> component */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} /> {/* Use 'element' prop instead of 'component' */}
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/report" element={<ReportPage />} /> {/* Use 'element' prop instead of 'component' */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/:ReportId" element={<SingleReport />} />
    </Routes>
  );
}

export default App;
