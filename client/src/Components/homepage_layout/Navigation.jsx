import "../../Styles/Navigation.css";

import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Navigation = (props) => {
  const loggedIn = props.loggedIn;
  const navigate = useNavigate();

  return (
    <Navbar
      bg="primary"
      expand="sm"
      variant="dark"
      fixed="top"
      className="navbar-padding justify-content-between"
    >
      {loggedIn ? (
        <>
          <Navbar.Brand>
            <i className="bi-airplane nav-icon" />
            {`Welcome, ${props.user.name}`}
          </Navbar.Brand>
          <Navbar.Brand className="title">Airplane Seats</Navbar.Brand>
          <Nav className="ml-md-auto">
            <Button
              variant="outline-light"
              size="mg"
              className="right-btn"
              onClick={props.logout}
            >
              Logout
            </Button>
            <Navbar.Brand>
              <i className="bi bi-person-badge-fill nav-icon"></i>
            </Navbar.Brand>
          </Nav>
        </>
      ) : (
        typeof loggedIn === "undefined" ?
          (
            <>
              <Navbar.Brand>
                <i className="bi-airplane nav-icon" />
              </Navbar.Brand>
              <Navbar.Brand className="title">Airplane Seats</Navbar.Brand>
              <Nav className="ml-md-auto">
                <Button
                  variant="outline-light"
                  size="mg"
                  className="right-btn"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
                <Navbar.Brand>
                  <i className="bi bi-person-badge-fill nav-icon"></i>
                </Navbar.Brand>
              </Nav>
            </>
          ) : (
            <>
              <Navbar.Brand>
                <i className="bi-airplane nav-icon" />
                {`Hi, please log in`}
              </Navbar.Brand>
              <Navbar.Brand className="title">Airplane Seats</Navbar.Brand>
              <Nav className="ml-md-auto">
                <Button
                  variant="outline-light"
                  size="mg"
                  className="right-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Navbar.Brand>
                  <i className="bi bi-person-badge-fill nav-icon"></i>
                </Navbar.Brand>
              </Nav>
            </>
          )
      )}

    </Navbar>
  )
};

export default Navigation;
