const { response } = require("express");
const { fetchUserCred } = require("./DB/DB");

function getCurrentTime() {
  const now = new Date();

  // Get hours, minutes, and seconds
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  // Pad with '0' if needed to ensure two digits
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // Return time in HHMMSS format
  return `${hours}${minutes}${seconds}`;
}
function getCurrentDate() {
  const now = new Date();

  // Get day, month, and year
  let day = now.getDate();
  let month = now.getMonth() + 1; // Months are zero-based
  let year = now.getFullYear() % 100; // Get last two digits of the year

  // Pad with '0' if needed to ensure two digits
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Return date in DDMMYY format
  return `${day}${month}${year}`;
}

async function isValidUser(id) {
  try {
    const DBuser = await fetchUserCred(id);
    if (DBuser.length === 0) return false;
    return DBuser[0].id === id;
  } catch (error) {
    console.error(error);
  }
}
function sortDataByRegNo(data) {
  return data.sort((a, b) => {
      const regA = a.reg_no.toUpperCase();
      const regB = b.reg_no.toUpperCase();
      if (regA < regB) {
          return -1;
      }
      if (regA > regB) {
          return 1;
      }
      return 0;
  });
}

module.exports = {
  getCurrentDate,
  getCurrentTime,
  isValidUser,
  sortDataByRegNo
};
