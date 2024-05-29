import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Styles from "../../styleSheets/ModalForm.module.css";
import {updateReport} from "../../api/reports.api";


const ModalForm = ({ show, onHide, data, onUpdate }) => {
  const { id, submitter_email, priority, status } = data;

  const [formPriority, setFormPriority] = useState("");
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    setFormPriority(priority);
    setFormStatus(status);
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateReport(id, formStatus, formPriority);
    onUpdate();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit} className={Styles.modalForm}>
        <Modal.Body className={Styles.modalBody}>
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
            <select
              value={formPriority}
              id="priorityField"
              onChange={(e) => setFormPriority(parseInt(e.target.value))}
            >
              <option value={-1}>Unset</option>
              <option value={1}>Low</option>
              <option value={2}>Mid</option>
              <option value={3}>High</option>
            </select>
          </div>
          <div className={Styles.fieldWrapper}>
            <label htmlFor="statusField">Status</label>
            <select
              value={formStatus}
              id="statusField"
              onChange={(e) => setFormStatus(parseInt(e.target.value))}
            >
              <option value={0}>Unresolved</option>
              <option value={1}>Resolved</option>
              <option value={2}>In Progress</option>
              <option value={3}>Dropped</option>
            </select>
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
