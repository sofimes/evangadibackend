//db connection
const dbConnection = require("../db/dbConfig");
//password cryption
const bcrypt = require("bcrypt");
//status codes
const { StatusCodes } = require("http-status-codes");
//jwt
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please fill all fields" });
  }
  try {
    const [user] = await dbConnection.query(
      `SELECT username,userid FROM users WHERE email = ? OR username = ?`,
      [email, username]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username already exists" });
    }
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password should be at least 8 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      `INSERT INTO users (username, firstname, lastname, email, password) VALUES (? , ?, ?, ?, ?)`,
      [username, firstname, lastname, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please fill all fields" });
  }
  try {
    const [user] = await dbConnection.query(
      `SELECT username,userid,password FROM users WHERE email = ?`,
      [email]
    );
    if (user.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }
    //generate token
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(StatusCodes.OK).json({
      message: "Logged in successfully",
      token,
      username,
      userid,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
}
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({
    message: "User is authenticated",
    username,
    userid,
  });
}

module.exports = { register, login, checkUser };
