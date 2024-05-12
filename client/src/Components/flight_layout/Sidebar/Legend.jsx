import "../../../Styles/Legend.css";

import { Container, Button, Spinner } from "react-bootstrap";

function Legend(props) {
  return (
    <>
      <Container className="legend-cont d-flex flex-column">
        <span className="legend">
          <Button
            variant="info"
            className="seat-legend available custom-button"
            disabled={true}
          />
          <span className="seat-type">
            Available:{" "}
            {props.loading ? (
              <Spinner
                className="spinner-legend"
                animation="border"
                variant="dark"
                size="sm"
              />
            ) : (props.availableSeats)}
            /{props.totSeats}
          </span>
        </span>
        <span className="legend">
          <Button className="seat-legend reserved custom-button" disabled={true} />
          <span className="seat-type">
            Reserved: {props.reservedSeats || 0}/{props.totSeats}
          </span>
        </span>
        <span className="legend">
          <Button className="seat-legend occupied custom-button" disabled={true} />
          <span className="seat-type">
            Occupied: {props.occupiedSeats || 0}/{props.totSeats}
          </span>
        </span>
      </Container>
    </>
  );
}

export default Legend;
