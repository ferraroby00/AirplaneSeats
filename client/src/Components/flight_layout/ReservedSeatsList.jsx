import "../../Styles/ReservedSeatsList.css";

import { Container, ListGroup } from "react-bootstrap";

const ReservedSeatsList = (props) => {
  return (
    <>
      {props.reserved && props.reserved.length > 0 && (
        <Container className="seat-list">
          <h2>Your reserved seats:</h2>
          <Container className="scroll-container list-group">
            <ListGroup>
              {props.reserved.map((seat) => (
                <ListGroup.Item key={seat.id}>
                  <a
                    href={`#seat-${seat.row_n}-${seat.line}`}
                    className="list-group-item list-group-item-action disabled"
                  >
                    <i className="bi bi-bag-plus-fill"></i>{" "}
                    Seat: <strong>{seat.row_n}{seat.line}</strong>
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Container>
        </Container>
      )}
    </>
  );
};

export default ReservedSeatsList;
