import "../../../Styles/Reservation.css";
import "../../../Styles/Confirmation.css";

import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

function Reservation(props) {
  const [numSeats, setNumSeats] = useState(""); // Number of seats to be reserved

  // Input box number change handler
  function handleNumSeatsChange(event) {
    setNumSeats(event.target.value);
  };

  // Handler for reservation form submission
  function handleSubmit(event) {
    event.preventDefault();
    if (numSeats > 0 && numSeats <= props.available) {
      props.handleReservation(numSeats);
    }
    props.handleReserveButton(true);
    console.log(`Number of seats to be reserved: ${numSeats}`);
  };

  return (
    <>
      <Container className="reservation-form">
        <h1>Reserve your seats</h1>
        <Form onSubmit={handleSubmit}>
          <Container className="form-row">
            <Form.Group controlId="formNumSeats" className="form-group">
              <Form.Label className="form-label">Seats to reserve:</Form.Label>
              <Form.Control
                type="number"
                value={numSeats}
                min="1"
                max={props.available}
                onChange={handleNumSeatsChange}
                required={true}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={props.reserveButton}
            >
              Reserve
            </Button>
          </Container>
        </Form>
      </Container>
    </>
  );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Confirmation(props) {
  function handleConfirmReservation(){
    props.handleConfirmation();
    props.handleReserveButton(false);
    props.handleLoading();
  };

  function handleCancelReservation(){
    props.handleCancelReservation();
    props.handleReserveButton(false);
  };

  return (
    <>
      <Container className="conf-container">
        <h2>Confirm your reservation?</h2>
        <Button
          className="conf-button"
          variant="success"
          onClick={() => handleConfirmReservation()}
        >
          Confirm
        </Button>
        <Button
          className="conf-button"
          variant="danger"
          onClick={() => handleCancelReservation()}
        >
          Cancel
        </Button>
      </Container>
    </>
  );
}

function Login() {
  return (
    <>
      <Container className="log-container">
        <p>It seems that you are not logged in</p>
        <p>Perform login to start your reservation</p>
        <Link to="/login">
          <i className="bi bi-box-arrow-right"></i>
        </Link>
      </Container>
    </>
  );
}

function AlreadyBooked(props) {
  return (
    <Container className="already-booked container">
      <p>You have a confirmed booking for this plane</p>
      <p>Do you want to cancel your booking?</p>
      <Button variant="danger" onClick={() => props.handleDeleteBooking()}>
        Delete
      </Button>
    </Container>
  );
}

export { Reservation, Confirmation, Login, AlreadyBooked };
