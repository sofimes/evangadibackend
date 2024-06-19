const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
async function postAnswer(req, res) {
  const { answer } = req.body;
  const { questionId } = req.params;
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide an answer" });
  }

  try {
    const response = await dbConnection.query(
      `INSERT INTO answers (answer,questionid,userid,username) VALUES (?,?,?,?)
        `,
      [answer, questionId, req.user.userid, req.user.username]
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer added successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
async function singleAnswerget(req, res) {
  const { answerId } = req.params;
  try {
    const [answer] = await dbConnection.query(
      `SELECT * FROM answers WHERE answerid = ?`,
      [answerId]
    );
    if (!answer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Answer not found" });
    }
    return res.json(answer[0]);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
async function allAnswersget(req, res) {
  try {
    const [answers] = await dbConnection.query(`SELECT * FROM answers `);
    return res.status(StatusCodes.OK).json(answers);
  } catch {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}
module.exports = { allAnswersget, postAnswer, singleAnswerget };
