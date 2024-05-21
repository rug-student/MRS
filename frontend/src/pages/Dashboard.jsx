import React, { useEffect, useState } from "react";
import moment from 'moment';
import { Container } from 'react-bootstrap';

const Dashboard = () => {
 
  const [reportsData, setReportsData] = useState([{ id: 1, description: "Description", priority: -1, created_at: "2024-05-15T19:30:06.000000Z", updated_at: "2024-05-15T19:30:06.000000Z", status: 0, submitter_email: "test@test.com", maintainer_id: null, response: [] }])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(` ${process.env.REACT_APP_API_BASE_URL}/reports`);
        const data = await response.json();
        // setReportsData(data)
      } catch (error) {
        console.log(error);
      }
    }
    getData()
  }, [])
  // { "id": 1, "description": "Description", "priority": -1, "created_at": "2024-05-15T19:30:06.000000Z", "updated_at": "2024-05-15T19:30:06.000000Z", "status": 0, "submitter_email": "test@test.com", "maintainer_id": null, "response": [] },
  return (
    <Container>
      <table class="table table-primary">
        <h3>Primary Variant</h3>
        <tr>
          <th>ID</th>
          <th>EMAIL</th>
          <th>DESCRIPTION</th>
          <th>PRIORITY</th>
          <th>STATUS</th>
          <th>CREATED AT</th>

        </tr>
        {reportsData.map(element => (
          <tr key={element.id}>
            <td>{element.id}</td>
            <td>{element.submitter_email}</td>
            <td>{element.description}</td>
            <td>{element.priority}</td>
            <td>{element.status}</td>
            <td>{moment(element.created_at).fromNow()}</td>
          </tr>
        ))}
      </table>
    </Container>
  )
};

export default Dashboard;
