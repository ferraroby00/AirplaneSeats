import "../../../Styles/Sidebar.css";

import Legend from "./Legend";

import { Reservation, Confirmation, Login, AlreadyBooked } from "./Reservation";
import { Row, Col } from "react-bootstrap";

function Sidebar(props) {

  return (
    <>
      <Row className="cont-sidebar">
        <Col md={3} xl={2} bg="light" className="below-nav" id="left-sidebar">
          <h1 className="sidebar-title">{props.plane_name} Plane </h1>
          <h2 className="title-seats"> Total seats: {props.totSeats}</h2>
          {props.loggedIn ? (
            props.isBooked ? (
              <AlreadyBooked handleDeleteBooking={props.handleDeleteBooking} />
            ) : (
              <>
                <Reservation
                  available={props.availableSeats}
                  handleReservation={props.handleGenReservation}
                  handleReserveButton={props.handleReserveButton}
                  reserveButton={props.reserveButton}
                />
                <Confirmation
                  handleConfirmation={props.handleConfirmation}
                  handleReserveButton={props.handleReserveButton}
                  handleCancelReservation={props.handleCancelReservation}
                  handleLoading={props.handleLoading}
                />
              </>
            )
          ) : (
            <Login />
          )}
          <Legend
            totSeats={props.totSeats}
            reservedSeats={props.reservedSeats}
            availableSeats={props.availableSeats}
            occupiedSeats={props.occupiedSeats}
            loading={props.loading}
          />
        </Col>
      </Row>
    </>
  );
}

export default Sidebar;
