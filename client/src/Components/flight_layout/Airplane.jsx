import "../../Styles/Airplane.css";

import Sidebar from "./Sidebar/Sidebar";
import Navbar from "../homepage_layout/Navigation";
import Footer from "../homepage_layout/Footer";
import ReservedSeatsList from "./ReservedSeatsList.jsx";

import API from "../../API";

import { useEffect, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";

function Airplane(props) {
  // ---- STATES ----
  // Data states
  const [seats, setSeats] = useState([]); // state used to contain seats based on airplane type
  const [reservation, setReservation] = useState([]); // state used to contain seats selected by the user
  const [availableSeats, setAvailableSeats] = useState(0);
  // Functional states
  const [loading, setLoading] = useState(false); // state used to show a spinner while seats are loading
  const [isBooked, setIsBooked] = useState(false);
  const [clicked, setClicked] = useState(false); // state used to disable or not buttons depending on user actions
  const [reserveButton, setReserveButton] = useState(false);
  const [dirty, setDirty] = useState(false); // state used to specify if seats must be reloaded or not

  // ---- USE EFFECTS ----

  // Changes seat availability number
  useEffect(() => {
    const availableSeatsCount = seats.flat().filter((s) => s.cod_user === null).length;
    const updatedAvailableSeats = Math.max(availableSeatsCount - reservation.length, 0);
    setAvailableSeats(updatedAvailableSeats);
  }, [reservation.length, seats]);

  // Gets seats when needed
  useEffect(() => {
    API.getSeats(props.type_id) //gets seats based on plane type
      .then((ss) => {
        const newSeats = [];
        let row = [];
        ss.forEach((e) => {
          row.push({ ...e, variant: e.cod_user ? "danger" : "info" });
          if (row.length >= props.seatsPerRow) {
            newSeats.push(row);
            row = [];
          }
        });
        if (props.user) setIsBooked(newSeats.flat().filter((s) => s.cod_user === props.user.id).length > 0 ? true : false);
        setSeats(newSeats);
        setLoading(false);
        setDirty(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.seatsPerRow, props.type_id, dirty, props.user]);

  // ---- HANDLE FUNCTIONS ----

  // When the confirm button is clicked the app enters in loading state until seats are reloaded
  function handleLoading() {
    setLoading(true);
  }

  // "flag" specifies if "Reserve" button can be clicked or not
  function handleReserveButton(flag) {
    setReserveButton(flag);
  }

  // Confirm seats reservation
  async function handleConfirmation() {
    if (props.user && reservation.length > 0) {
      // Creates an array of seats validation promises
      const checkSeatPromises = reservation.map(async (el) => {
        try {
          const check = await API.validateSeat(el.id);
          if (check.cod_user !== null) {
            // Highlights already occupied seats
            setSeats((oldSeats) => oldSeats.map((row) => row.map((s) => s.id === el.id ? { ...s, variant: "outline-dark" } : s)));
            return true; // signals that an occupied seat has been found
          }
          return false; // signals that the seats is available
        } catch (err) { console.log(err) }
      });
      try {
        // Waits for all previously defined promises to complete
        const results = await Promise.all(checkSeatPromises);
        const resetVariant = results.includes(true); // if at least one seat is occupied
        if (!resetVariant) {
          // confirmation is ok, it can be completed
          const confirmationPromises = reservation.map((el) =>
            // then-catch statement for simplicity
            API.confirmSeat(el.id).catch((err) => {
              console.log(err);
            })
          );
          await Promise.all(confirmationPromises);
        } else {
          // Confirmation is not ok -> discard it and alert the user
          setTimeout(() => {
            alert("Reservation deleted: some of the selected seats are no longer available")
          }, 5500);
        }
        setTimeout(
          () => {
            setDirty(true);
            setReservation([]);
            setClicked(false);
          },
          resetVariant ? 5000 : 0 // 5 secs highlighting in case of problems
        );
      }
      catch (err) {
        console.log("Error in confirmation promises:", err);
        setDirty(true);
        setReservation([]);
        setClicked(false);
      }
    } else {
      // Confirm button is pressed when there is no reservation to push
      alert("Select some seats to confirm a reservation");
      setDirty(true);
    }
  }

  // Delete seats booking from db
  function handleDeleteBooking() {
    if (props.user) {
      API.cancelSeats(props.type_id)
        .then(() => {
          setDirty(true);
          setIsBooked(false);
          setReservation([]);
          setClicked(false);
          console.log("Reservation deleted");
        })
        .catch((err) => console.log(err));
    }
  }

  // Deletes temp reservation
  function handleCancelReservation() {
    if (reservation.length > 0) {
      setSeats((prevSeats) => {
        return prevSeats.map((row) => row.map((seat) => ({ ...seat, variant: seat.variant === "warning" ? "info" : seat.variant, })));
      });
      setReservation([]);
      setClicked(false);
    } else {
      console.log("There is no reservation to cancel");
    }
  }

  // Random Reservation
  function handleGeneratedReservation(num) {
    let reserved = [];
    const filteredSeats = seats.flat().filter((el) => el.cod_user === null); // randoms can only be selected among available seats
    while (reserved.length < num) {
      const pickedSeat = filteredSeats[Math.floor(Math.random() * availableSeats)];
      if (!reserved.includes(pickedSeat)) reserved.push(pickedSeat);
    }
    setReservation(reserved);
    setClicked(true);
  }

  // Seat button click handler
  const handleButtonClick = (id) => {
    setSeats((prevSeats) => {
      const newSeats = prevSeats.map((row) =>
        row.map((seat) => ({
          ...seat, variant: seat.id === id ? (seat.variant === "info" ? "warning" : "info") : seat.variant
        }))
      );
      const reservedSeats = newSeats.flat().filter((seat) => seat.variant === "warning");
      setReservation(reservedSeats);
      setReserveButton(reservedSeats.length !== 0); // if seats in the grid are selected random generation is disabled
      return newSeats;
    });
  };


  return (
    <>
      <Navbar />
      <Sidebar
        loggedIn={props.loggedIn}
        totSeats={props.totSeats}
        plane_name={props.type_id === 1 ? "Local" : (props.type_id === 2 ? "Regional" : "International")}
        occupiedSeats={seats.flat().filter((el) => el.cod_user !== null).length}
        availableSeats={availableSeats}
        reservedSeats={reservation.length}
        loading={loading}
        reserveButton={reserveButton}
        isBooked={isBooked}
        handleConfirmation={handleConfirmation}
        handleGenReservation={handleGeneratedReservation}
        handleReserveButton={handleReserveButton}
        handleCancelReservation={handleCancelReservation}
        handleDeleteBooking={handleDeleteBooking}
        handleLoading={handleLoading}
      />
      <Container className="main-seats">
        <Container className="seats-grid">
          <Container className="plane-border">
            <Container className="grid-box">
              {loading &&
                (<div className="spinner-overlay">
                  <Spinner className="spinner-seats" animation="border" variant="primary" />
                </div>)
              }
              <Container className="line-row">
                {["A", "B", "C", "D", "E", "F"].slice(0, props.seatsPerRow).map((line, index) => (
                  <Container className="line" key={index}>
                    <span>{line}</span>
                  </Container>
                ))}
              </Container>
              {seats.map((row, rowIndex) => (
                <Container className="seat-row" key={rowIndex}>
                  {row.map((col, colIndex) => (
                    <Container className="seat-col" key={colIndex}>
                      <Button
                        variant={col.variant}
                        className="seat"
                        key={`${col.id}`}
                        onClick={() => handleButtonClick(col.id)}
                        disabled={props.loggedIn ? isBooked ? true : clicked || col.cod_user : true}
                      >
                        {`${col.row_n}${col.line}`}
                      </Button>
                    </Container>
                  ))}
                </Container>
              ))}
            </Container>
          </Container>
          {props.loggedIn && <ReservedSeatsList reserved={reservation} />}
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default Airplane;
