import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Styles/App.css";
import API from "./API";

import Homepage from "./Components/homepage_layout/Homepage.jsx";
import LoginPage from "./Components/login/LoginPage";
import Airplane from "./Components/flight_layout/Airplane";
import PageNotFound from "./Components/NotFoundLayout";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  // ---- STATES ----
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  const [planesInfo, setPlanesInfo] = useState([]);

  // ---- USE EFFECTS ----

  // This useEffects runs only when the component is rendered for the first time
  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo(); 
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    API.getPlaneInfo()
      .then((pi) => {
        setPlanesInfo(pi);
      })
      .catch((err) => {
        console.error("Error fetching plane info:", err);
      });
  }, [user]);

  // ---- HANDLE FUNCTIONS ----

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                loggedIn={loggedIn}
                planesInfo={planesInfo}
                logout={handleLogout}
                user={loggedIn ? user : null}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginPage login={handleLogin} loggedIn={loggedIn} />}
          />
          {planesInfo.length > 0 && (
            <>
              {planesInfo.map((planeInfo) => (
                <Route
                  key={planeInfo.id}
                  path={`/${planeInfo.type.toLowerCase()}`}
                  element={
                    <Airplane
                      type_id={planeInfo.id}
                      rowNum={planeInfo.rows}
                      seatsPerRow={planeInfo.seats_per_row}
                      totSeats={planeInfo.tot_seats}
                      loggedIn={loggedIn}
                      user={loggedIn ? user : null}
                    />
                  }
                />
              ))}

            </>
          )}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
