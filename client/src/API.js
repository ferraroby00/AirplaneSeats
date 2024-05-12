"use strict";

const SERVER_URL = "http://localhost:3001/api/";

// Parse the HTTP response
const getJson = (httpResponsePromise) =>
  new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        response
          .json()
          .then((json) => {
            if (response.ok) {
              resolve(json);
            } else {
              reject(json);
            }
          })
          .catch((err) => {
            reject({ error: "Cannot parse server response: " + err });
          });
      })
      .catch((err) => {
        reject({ error: "Cannot communicate: " + err });
      });
  });

/////////////////////////////////////////////////////////

// SEATS API

const getSeats = async (type_id) => {
  return getJson(fetch(`${SERVER_URL}seats/${type_id}`)).then((json) => {
    return json.map((seat) => {
      const clientSeat = {
        id: seat.id,
        row_n: seat.row_n,
        line: seat.line,
        plane_type: seat.plane_type,
        cod_user: seat.cod_user,
      };
      return clientSeat;
    });
  });
};

const validateSeat = async (seat_id) => {
  return getJson(
    fetch(`${SERVER_URL}validate/${seat_id}`, { credentials: "include" })
  ).then((json) => {
    const seatCodUser = {
      cod_user: json.cod_user,
    };
    return seatCodUser;
  });
};

const confirmSeat = async (toReserve) => {
  return getJson(
    fetch(`${SERVER_URL}confirm`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        seat_id: toReserve,
      }),
    })
  );
};

const cancelSeats = async (plane_type) => {
  return getJson(
    fetch(`${SERVER_URL}delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plane_type: plane_type,
      }),
    })
  );
};

/////////////////////////////////////////////////////////

// PLANES API

const getPlaneInfo = async () => {
  return getJson(fetch(`${SERVER_URL}planes`)).then((json) => {
    return json.map((plane) => {
      const clientPlane = {
        id: plane.id,
        type: plane.type,
        rows: plane.rows,
        seats_per_row: plane.seats_per_row,
        tot_seats: plane.tot_seats,
      };
      return clientPlane;
    });
  });
};

/////////////////////////////////////////////////////////

// USERS API

const getUserInfo = async () => {
  return getJson(
    fetch(`${SERVER_URL}sessions/current`, {
      credentials: "include",
    })
  );
};

const logIn = async (credentials) => {
  return getJson(
    fetch(`${SERVER_URL}sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    })
  );
};

const logOut = async () => {
  return getJson(
    fetch(`${SERVER_URL}sessions/current`, {
      method: "DELETE",
      credentials: "include",
    })
  );
};

const API = {
  getSeats,
  validateSeat,
  confirmSeat,
  cancelSeats,
  getPlaneInfo,
  getUserInfo,
  logIn,
  logOut,
};

export default API;
