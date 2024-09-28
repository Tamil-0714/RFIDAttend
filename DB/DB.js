const mysql = require("mysql2");

function connectDB() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "TooJoo_1967",
    database: "Attend_RFID",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool.promise();
}

// async function queryDB(query) {
//   try {
//     const connection = await connectDB();
//     const [rows] = await connection.query(query);
//     connection.releaseConnection();
//     return rows;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function queryDB(sql, params) {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query(sql, params);
    connection.releaseConnection();
    return rows;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.error("Duplicate entry error:", error.message);
      return { message: "ER_DUP_ENTRY" };
    } else {
      console.error("Error occurred:", error.message);
    }
    // throw error; // Re-throw the error if needed
  }
}

/*
1. reg_no,  size 20,  
2. attend_info, size 3, values[P,A,OD,ML]
3. timestamp, format ddmmyyhhmmss - DD-MM-YY-HH-MM-SS, SIZE 20
4. day_order, size 5, values A to F 
5. category, default "normal day" : "event name"

{
  "attendanceStatus": "Present",
  "time_stamp": "hhmmss",
  "date_stamp": "ddmmyy",
  "day_order": "A",
  "category": "workshop event"
}

*/

function checkForTable(tableArr) {
  result = false;
  tableArr.forEach((e, i) => {
    if (e.Tables_in_Attend_RFID === "attendanceData") result = true;
  });
  return result;
}

async function tableInit() {
  try {
    const query = "show tables";
    const params = null;
    const rows = await queryDB(query, params);
    if (rows.length !== 0) {
      if (!checkForTable(rows)) {
        // not present
        const tableCreateQuery = `CREATE TABLE attendanceData(
                                        reg_no VARCHAR(20) primary key,
                                        JSONData VARCHAR(255) not null default "{}"
                                    )`;
        const tableCreationResult = await queryDB(tableCreateQuery, null);
        return tableCreationResult;
      } else {
        return rows;
      }
    }
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function insertAttendDetails(
  regno,
  atteSts,
  timeStamp,
  dateStamp,
  dayOrder,
  category
) {
  const JSONFormat = {
    attendanceStatus: atteSts,
    time_stamp: timeStamp,
    date_stamp: dateStamp,
    day_order: dayOrder,
    category: category,
  };
  const query = `SELECT * FROM attendanceData WHERE reg_no = ?`;
  const params = [regno];
  const rows = await queryDB(query, params);
  console.log("initial rows", rows);
  if (rows.length === 0) {
    const newInsertionQuery = `INSERT INTO attendanceData VALUES(?,?)`;
    const attendanceDataArray = [JSONFormat];
    const paramsForInsertion = [regno, JSON.stringify(attendanceDataArray)];
    const rowsForNewInsertion = await queryDB(
      newInsertionQuery,
      paramsForInsertion
    );
    console.log(rowsForNewInsertion);
    return rowsForNewInsertion;
  } else {
    const updationQuery = `UPDATE attendanceData SET JSONData = ? WHERE reg_no = ?`;
    const oldAttendanceDataArray = JSON.parse(rows[0].JSONData);
    oldAttendanceDataArray.push(JSONFormat);
    const paramsForUpdation = [JSON.stringify(oldAttendanceDataArray), regno];
    const rowsForUpdation = await queryDB(updationQuery, paramsForUpdation);
    console.log(rowsForUpdation);
    return rowsForUpdation;
  }
}
async function fetchUserCred(id) {
  try {
    const query = "SELECT * FROM userCred WHERE id = ?";
    const params = [id];
    const rows = await queryDB(query, params);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchAttendDetails(id) {
  try {
    const query = "SELECT * FROM attendanceData";
    // const params = [id];
    const rows = await queryDB(query, null);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  tableInit,
  insertAttendDetails,
  fetchUserCred,
  fetchAttendDetails,
};

// CREATE TABLE attendanceData(
//     reg_no varchar(20) primary key,
//     attend_info varchar(5) default "-",
//     timestamp varchar(20),
//     day_order varchar(5),
//     date varchar(20),
//     category varchar(20)
// );
