import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import { FiEdit } from "react-icons/fi";
import Header from "./HeaderLoggedIn";

const Dashboard = () => {

  const [reports, setReports] = useState([]);

  // loads questions into form upon page load
  useEffect(() => {
    fetchReports();
  }, []);

  // Gets all the questions from the database
  const fetchReports = () => {
    fetch(`http://localhost:8000/api/reports?status=&priority=`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch reports');
        }
      })
      .then(reports => {
        setReports(reports);
      })
      .catch(error => {
        console.error('Error occurred while fetching reports:', error);
      });
  };
  

  return (
    <div className={`main_wrapper_container ${classes.mainWrapper}`}>
        <Header/>
      <div className={`inner_wrapper_container ${classes.tableHeader}`}>
        <div>
          <h2>ID</h2>
        </div>
        <div>
          <h2>Description</h2>
        </div>
        <div>
          <h2>DateTime</h2>
        </div>
        <div>
          <h2>Status</h2>
        </div>
        <div>
          <h2>Email</h2>
        </div>
        <div>
          <h2>Priority</h2>
        </div>
      </div>
      <div className={`inner_wrapper_container ${classes.rowsWrapper}`}>
        {reports.map((element) => (
          <div className={classes.rowWrapper} key={element.id}>
            <div>
              <p>{element.id}</p>
            </div>
            <div>
              <p>{element.description}</p>
            </div>
            <div>
              <p>{element.created_at}</p>
            </div>
            <div>
              <p>{element.status}</p>
            </div>
            <div>
              <p>{element.submitter_email}</p>
            </div>
            <div>
              <p>{element.priority}</p>
              <FiEdit />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
