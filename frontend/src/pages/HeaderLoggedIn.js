import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function HeaderLoggedIn() {
    return (
        <header className="row">
            <div className="col-md-2"><Link to="/"><img src="/imgs/gomibologo.png" className="loggedInPlaceholder"/></Link> </div>
            <div className="col-md-2"></div>
            <div className="col-md-2 header-btn"><Link to="/report">Report</Link></div>
            <div className="col-md-2 header-btn"><Link to="/dashboard">Dashboard</Link></div>
            <div className="col-md-2 header-btn"><Link to="/questions">Questions</Link></div>
            <div className="col-md-2 header-btn"><Link to="/">Logout</Link></div>
        </header>
    );
}

export default HeaderLoggedIn;
