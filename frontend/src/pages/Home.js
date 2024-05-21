import './login.css';
import './Home.css';
import Header from './Header';
import { Link } from 'react-router-dom';

function HomePage() {
 
  return (
      <div className='page'>
        <Header />
        <div className="homepage">
          <div className="text-container">
            <div className="title-home">Malfunction Report System</div>
            <div className="subtitle-home">Easily submit a report on any malfunctions so that it gets fixed as soon as possible!</div>
          </div>
            
            <div className="home-container">
              <div className="box">
                <h1>Create a New Report</h1>
                <Link to="/report">Report</Link>
              </div>
              
              <div className="box">
                <h1>Maintenance Personnel Login</h1>
                <Link to="/login">Login</Link>
              </div>
            
          </div>
        </div>
      </div>
    );
}

export default HomePage;
