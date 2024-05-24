import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Styles from "./ModalForm.module.css";

const ModalForm = ({ show, onHide, data, onUpdate }) => {
  const { id, submitter_email, priority, status } = data;
  const [formPriority, setFormPriority] = useState(priority);
  const [formStatus, setFormStatus] = useState(status);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost/api/reports/${id}`;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const body = JSON.stringify({
        status: formStatus,
        priority: formPriority,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: body,
        redirect: "follow",
      };
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const result = await response.json();
        console.log("Update result:", result);
        onUpdate();
        onHide();
      } else {
        console.error("Fetch error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className={Styles.fieldWrapper}>
            <label htmlFor="idField">Id</label>
            <input type="text" value={id} id="idField" readOnly />
          </div>
          <div className={Styles.fieldWrapper}>
            <label htmlFor="submitterField">Submitter Email</label>
            <input
              type="text"
              value={submitter_email}
              id="submitterField"
              readOnly
            />
          </div>
          <div className={Styles.fieldWrapper}>
            <label htmlFor="priorityField">Priority</label>
            <input
              type="text"
              placeholder={priority}
              value={formPriority}
              id="priorityField"
              onChange={(e) => setFormPriority(e.target.value)}
            />
          </div>
          <div className={Styles.fieldWrapper}>
            <label htmlFor="statusField">Status</label>
            <input
              type="text"
              placeholder={status}
              value={formStatus}
              id="statusField"
              onChange={(e) => setFormStatus(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalForm;
