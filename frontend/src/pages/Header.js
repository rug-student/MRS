import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="row">
            <div className="col-md-2"><Link to="/"><img src="/imgs/gomibologo.png" className="logoHeader" alt="logo"/></Link> </div>
            <div className="col-md-4"></div>
            <div className="col-md-2 header-btn"><Link to="/report">Report</Link></div>
            <div className="col-md-2 header-btn"><Link to="/login">Login</Link></div>
            <div className="col-md-2 header-btn">Contact Us</div>
        </header>
    );
}

export default Header;
