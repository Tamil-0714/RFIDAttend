const {
  tableInit,
  insertAttendDetails,
  fetchUserCred,
  fetchAttendDetails,
} = require("./DB/DB");
const {
  getCurrentDate,
  getCurrentTime,
  isValidUser,
  sortDataByRegNo,
} = require("./helper");
const bcrypt = require("bcrypt");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const app = express();
const PRODUCTION = false;
const PORT = 3002;

(async () => {
  await tableInit();
})();

const corsOptions = {
  origin: "http://127.0.0.1:5500", // Explicitly allow your client origin
  credentials: true, // Enable sending of cookies
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "adengappa password uh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: PRODUCTION ? true : false,
    },
  })
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  const DBuser = await fetchUserCred(username);
  if (DBuser.length === 0) {
    console.log("no user found");
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const DBRes = DBuser[0];

  // console.log(DBuser);

  bcrypt.compare(password, DBRes.passHash, (err, isMatch) => {
    if (err) throw err;

    if (isMatch) {
      // Password matches, initiate a session
      req.session.userId = DBRes.id; // Store user ID in session
      res.json({ message: "Login succes" });
    } else {
      // Password doesn't match
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
  // res.json({ message: "From serer" });
});

app.get("/attendData", async (req, res) => {
  const user = await fetchUserCred(req.session.userId);
  // console.log("from attend at");
  if (user.length === 0) {
    res.status(401).json({ message: "Session expired" });
    return;
  }

  /**
   * 

   [
    {
        "reg_no": "22ucs664",
        "JSONData": "[{\"attendanceStatus\":\"present\",\"time_stamp\":\"174033\",\"date_stamp\":\"240924\",\"day_order\":\"B\",\"category\":\"workshop\"},{\"attendanceStatus\":\"absent\",\"time_stamp\":\"174054\",\"date_stamp\":\"240924\",\"day_order\":\"c\",\"category\":\"workshop\"}]"
    }
]
   */
  if (isValidUser(req.session.userId)) {
    const resObj = [];
    const DBObj = await fetchAttendDetails();
    DBObj.forEach((e) => {
      const childObj = {
        reg_no: e.reg_no,
        JSONData: JSON.parse(e.JSONData),
      };
      resObj.push(childObj);
    });
    res.status(200).json(resObj);
    // res.status(200).json(sortDataByRegNo(resObj));
    return;
  } else {
    res.status(401).json({ message: "Session expired" });
    return;
  }
  // res.send("from server !!");
});

app.post("/attendData", async (req, res) => {
  console.log(req.query);
  const data = req.query;
  await insertAttendDetails(
    data.regno,
    data.attests,
    getCurrentTime(),
    getCurrentDate(),
    data.dayorder,
    data.cate
  );
  res.json({message:"Data inserted success"});
});

app.listen(PORT, () => {
  console.log(`app listeng on http://127.0.0.1:${PORT}`);
});

// (async () => {
//   const rows = await tableInit();
//   console.log(rows);

//   //   const rows2 = await insertAttendDetails(
//   //     "22ucs626",
//   //     "present",
//   //     "164234",
//   //     "170924",
//   //     "A",
//   //     "Workshop"
//   //   );
//   //   const rows3 =
//     await insertAttendDetails(
//       "22ucs626",
//       "absent",
//       "13216",
//       "150924",
//       "D",
//       "Class"
//     );
// })();

console.log();
console.log();
