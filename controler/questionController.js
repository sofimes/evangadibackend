const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function questionpost(req, res) {
  const { title, description, tag } = req.body;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Title and description are required" });
  }

  try {
    const questionid = uuidv4();
    let response;

    if (tag) {
      response = await dbConnection.query(
        `INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)`,
        [questionid, req.user.userid, title, description, tag]
      );
    } else {
      response = await dbConnection.query(
        `INSERT INTO questions (questionid, userid, title, description) VALUES (?, ?, ?, ?)`,
        [questionid, req.user.userid, title, description]
      );
    }

    if (response?.length === 0) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to post question" });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
}

async function singleQuestionget(req, res) {
  try {
    const { id } = req.params;
    const [question] = await dbConnection.query(
      `SELECT * FROM questions WHERE id = ?`,
      [id]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found" });
    }
    return res.json(question[0]);
  } catch (error) {
    console.log(error);
  }
}

async function allquestionget(req, res) {
  try {
    const question = await dbConnection.query(`SELECT * FROM questions`);
    return res.status(StatusCodes.OK).json(question);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
}
async function searchQuestion(req, res) {
  try {
    const { keyword } = req.query;
    const questions = await dbConnection.query(
      `SELECT * FROM questions WHERE question LIKE '%${keyword}%'`
    );
    return res.status(StatusCodes.OK).json(questions);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
}

module.exports = {
  questionpost,
  singleQuestionget,
  allquestionget,
  searchQuestion,
};
