import React, { useEffect, useState } from 'react';
import '../pages/Header.css';
import { Link } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';

function Header() {

	const { logout, user } = useAuthContext();

	return (
		<header className="row">
			<div className="col-md-2"><Link to="/"><img src="/imgs/gomibologo.png" className="logoHeader" alt="logo" /></Link> </div>
			<div className="col-md-2"></div>
			<div className="col-md-2 header-btn"><Link to="/report">Report</Link></div>
			{user ? ( <>
					<div className="col-md-2 header-btn"><Link to="/dashboard">Dashboard</Link></div>
					<div className="col-md-2 header-btn"><Link to="/questions">Questions</Link></div>
					<div className="col-md-2 header-btn" onClick={logout}><Link to="/">Logout</Link></div>
				</>) : (
				<div className="col-md-2 header-btn"><Link to="/login">Login</Link></div>
			)}
			<div className="col-md-2 header-btn">Contact Us</div>
		</header>
	);
}

export default Header;
