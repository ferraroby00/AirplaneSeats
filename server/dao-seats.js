"use strict";

const db = require("./db");

// get all the seats given plane id
exports.getSeats = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM seats WHERE plane_type = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows.map((e) => e));
    });
  });
};

// given a seat id returns an user_id if it already been booked, NULL otherwise
exports.validateSeat = (seat_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT cod_user FROM seats WHERE id = ?";
    db.get(sql, [seat_id], (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// given a user_id and an array of seats, set the cod_user associeted to seat_id(s) to user_id
exports.confirmReservation = (user_id, seat_id) => {
  const sql = "UPDATE seats SET cod_user = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [user_id, seat_id], (error, result) => {
      if (error) {
        console.error(error); // Log the error for debugging purposes
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// given a user_id and a plane_type, set the cod_user associeted to that seat_id to NULL
exports.cancelReservation = (user_id, plane_type) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE seats SET cod_user = NULL WHERE cod_user = ? AND plane_type=?";
    db.run(sql, [user_id, plane_type], (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
