const { exec } = require("child_process");
const path = require("path");

const dbPath = path.join(__dirname, "cmp.db");

function query(sql) {
  return new Promise((resolve, reject) => {
    exec(`sqlite3 "${dbPath}" "${sql}"`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

module.exports = { query };
