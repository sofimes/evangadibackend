const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const {
  allAnswersget,
  singleAnswerget,
  postAnswer,
} = require("../controler/answerController");
router.get("/all-answersget", authMiddleWare, allAnswersget);
router.get("/single-answerget/:questionId", authMiddleWare, singleAnswerget);
router.post("/answerspost/:questionId", authMiddleWare, postAnswer);
module.exports = router;
