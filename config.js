const sqlite3 = require('sqlite3').verbose(); 

const db = new sqlite3.Database('./datastore.db');

function query(sql, args) {
  return new Promise((resolve, reject) => {
    db.all(sql, args, (err, rows) => { // Use db.all for SELECT queries
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function executeSQL(sql) {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

module.exports = { query, executeSQL };