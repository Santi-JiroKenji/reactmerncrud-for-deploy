const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// const dbConfig = require("./database/db");
const createError = require("http-errors");
const app = express();
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
app.use(express.json());

// Express Route
const studentRoute = require("./routes/student.route");

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(
    () => {
      console.log("Database successfully connected");
    },
    (error) => {
      console.log("Could not connect to database");
    }
  );

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/api/v1/students", studentRoute);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running");
  });
}

// app.listen(process.env.PORT || 5000, () => {
//   console.log("Server is running.");
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
