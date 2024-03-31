import React, { useEffect, useState } from "react";
import data from "../data/dataFake.json";
import classes from "./Dashboard.module.css";
import { FiEdit } from "react-icons/fi";
import Header from "./Header";

const Dashboard = () => {
  const [reports, setReports] = useState(data);

  useEffect(() => {
    const fetchReportsData = async () => {
      const apiUrl = process.env.REACT_APP_API_URL; // Access the environment variable
      try {

        const response = await fetch(`${apiUrl}/reports`);
      const data = await response.json();
      console.log(data);
      } catch (error) {
        console.log(error)
      }   
    };
    fetchReportsData();
  }, []);

  return (
    <div className={`main_wrapper_container ${classes.mainWrapper}`}>
        <Header/>
      <div className={`inner_wrapper_container ${classes.tableHeader}`}>
        <div>
          <h2>Item</h2>
        </div>
        <div>
          <h2>Status</h2>
        </div>
        <div>
          <h2>DateTime</h2>
        </div>
        <div>
          <h2>Location</h2>
        </div>
        <div>
          <h2>Email</h2>
        </div>
        <div>
          <h2>Technician</h2>
        </div>
        <div>
          <h2>Priority</h2>
        </div>
      </div>
      <div className={`inner_wrapper_container ${classes.rowsWrapper}`}>
        {reports.map((element) => (
          <div className={classes.rowWrapper} key={element.id}>
            <div>
              <p>{element.item}</p>
            </div>
            <div>
              <p>{element.status}</p>
            </div>
            <div>
              <p>{element.date_time}</p>
            </div>
            <div>
              <p>{element.location}</p>
            </div>
            <div>
              <p>{element.email}</p>
            </div>
            <div>
              <p>{element.person_assigned || "Unassigned"}</p>
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
