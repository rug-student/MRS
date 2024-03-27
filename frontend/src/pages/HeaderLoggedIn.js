import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function HeaderLoggedIn() {
    return (
        <header className="row">
            <div className="col-md-2"><img src="/imgs/gomibologo.png" className="logoHeader" alt="logo"/></div>
            <div className="col-md-4"></div>
            <div className="col-md-2 header-btn"><Link to="/report">Report</Link></div>
            <div className="col-md-2 header-btn"><Link to="/questions">Questions</Link></div>
            <div className="col-md-2 header-btn">Logout</div>
        </header>
    );
}

export default HeaderLoggedIn;
