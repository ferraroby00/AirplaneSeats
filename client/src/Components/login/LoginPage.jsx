import "../../Styles/LoginPage.css";
import Footer from "../homepage_layout/Footer";

import { Col, Container, Form, Button, Row, Image, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props
      .login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
        setShow(true);
      });
  };

  return (
    <>
      <Container className="wrapper">
        <Container className="main">
          <Row className="cont-row">
            <Col className="col-md-6 left-image">
              <Image className="left-image" src=".\images\login.jpg" fluid />
            </Col>
            {!props.loggedIn ? (
              <Col className="col-md-6 right-col">
                <Container className="back-button-container">
                  <Button
                    size="mg"
                    className="btn-back"
                    onClick={() => navigate("/")}
                  >
                    <i className="bi bi-box-arrow-left back-icon"></i>
                  </Button>
                </Container>


                <Form className="input-box" onSubmit={handleSubmit}>

                  <header>Login</header>
                  <Form.Group className="input-field">
                    <Form.Control
                      type="text"
                      className="input"
                      id="email"
                      required={true}
                      autoComplete="off"
                      value={username}
                      onChange={(ev) => setUsername(ev.target.value)}
                      placeholder="Username"
                    />
                  </Form.Group>
                  <Form.Group className="input-field">
                    <Form.Control
                      type="password"
                      className="input"
                      id="password"
                      required={true}
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group className="input-field">
                    <Button type="submit" className="submit">
                      Log In
                    </Button>
                  </Form.Group>
                </Form>
                <Alert
                  dismissible
                  show={show}
                  onClose={() => setShow(false)}
                  variant="danger"
                >
                  Incorrect username or password inserted
                </Alert>
              </Col>
            ) : (
              <AlreadyLogged />
            )}
          </Row>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

function AlreadyLogged() {
  const navigate = useNavigate();

  return (
    <>
      <Col className="col-md-6 right-col">
        <header>You are already logged in</header>
        <Button size="mg" className="btn-back" onClick={() => navigate("/")}>
          🏠
        </Button>
      </Col>
    </>
  );
}

export default LoginPage;
