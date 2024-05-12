import "../../Styles/Homepage.css";

import Navigation from "./Navigation";
import AirCard from "./AirCard";
import Footer from "./Footer";

import { Container } from "react-bootstrap";

function Homepage(props) {
  return (
    <>
      <Navigation loggedIn={props.loggedIn} logout={props.logout} user={props.loggedIn ? props.user : null} />
      <Container className="cont justify-content-evenly">
        <Container className="cards justify-content-evenly">
          {props.planesInfo.map((plane) => (
            <AirCard
              key={plane.id}
              id={plane.id}
              imgURL={
                plane.type === "local" ? "./images/local.jpg" :
                  plane.type === "regional" ? "./images/regional.jpg" : "./images/international.jpg"
              }
              type={plane.type}
              tot_seats={plane.tot_seats}
            />
          ))}
        </Container>
      </Container>

      <Footer />
    </>
  );
}


export default Homepage;
