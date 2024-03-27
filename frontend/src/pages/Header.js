import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="row">
            <div className="col-md-2"><img src="/imgs/gomibologo.png" className="logoHeader" alt="logo"/></div>
            <div className="col-md-4"></div>
            <div className="col-md-2 header-btn"><Link to="/">Report</Link></div>
            <div className="col-md-2 header-btn"><Link to="/login">Login</Link></div>
            <div className="col-md-2 header-btn">Contact Us</div>
        </header>
    );
}

export default Header;
