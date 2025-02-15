"use strict";

const db = require("./db");
const crypto = require("crypto");

// Return user's information given its id
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found" });
      else {
        const user = { id: row.id, username: row.email, name: row.name };
        resolve(user);
      }
    });
  });
};

// Verify username and password
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = { id: row.id, username: row.email, name: row.name };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword)) resolve(false);
          else resolve(user);
        });
      }
    });
  });
};
