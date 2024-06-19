require("dotenv").config();
const express = require("express");
const app = express();
const port = 5500;
//cors for accessing the input from body
const cors = require("cors");
app.use(cors());
//db connection
const dbConnection = require("./db/dbConfig");
//user routes middleware file
const userRoutes = require("./Routes/UserRoute");
//question routes middleware
const questionRoutes = require("./Routes/QuestionRoute");
//answer routes middleware
const answerRoutes = require("./Routes/AnswerRoute");
const bodyParser = require("body-parser");

//middleware of json
app.use(express.json());
app.use(bodyParser.json());
//user routes middleware
app.use("/api/users", userRoutes);

//question routes middleware

app.use("/api/questions", questionRoutes);

//answer routes middleware
app.use("/api/answers", answerRoutes);
// app.use("/api/answers", answerRoutes);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    await app.listen(port);
    console.log("database connection established");
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    console.log(err.message);
  }
}
start();
