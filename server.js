const express = require("express");
const fs = require("fs");
const DATABASE = "db.json";
const app = express();
const PORT = process.env.PORT ?? 8080;
const users = [];

var myLogger = function (req, res, next) {
  console.log("New request has been detected.");
  next();
};
var readHeader = function (req, res, next) {
  if (req.headers.iknowyoursecret == "TheOwlsAreNotWhatTheySeem") {
    const { username } = req.headers;
    const { remoteAddress } = req.connection;
    console.log(
      `Glad to see >>> ${username} 
      and his ip adress >>> ${remoteAddress}.`
    );
    next();
  } else {
    console.log("u forgot to pass right secret header");
    res.end("bye!");
  }
};
var writeDb = function (req, res, next) {
  const { username } = req.headers;
  const { remoteAddress } = req.connection;
  users.push({
    name: username,
    ip: remoteAddress,
  });
  fs.appendFile(DATABASE, JSON.stringify(users), (err, req) => {
    if (err) throw err;
  });
  next();
};

app.use(myLogger, readHeader, writeDb);

app.get("/", function (req, res) {
  res.send("assertion to db completed...");
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
});
