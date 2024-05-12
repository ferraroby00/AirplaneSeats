import "../../Styles/AirCard.css";

import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function AirCard(props) {
  const url = props.imgURL;

  return (
    <div className="card shadow">
      <Container className="image-container">
        <img className="card-img" src={url} alt="Card image cap" />
      </Container>
      <Container className="card-body">
        <h5 className="card-title">
          {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
        </h5>
        <p className="card-text">Total Seats: {props.tot_seats}</p>
        <Link to={`/${props.type}`}>
          <Button variant="primary">Show</Button>
        </Link>
      </Container>
    </div>
  );
}

export default AirCard;
