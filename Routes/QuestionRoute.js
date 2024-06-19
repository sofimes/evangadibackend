const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleWare");
const {
  questionpost,
  singleQuestionget,
  allquestionget,
} = require("../controler/questionController");
router.post("/questionspost", authMiddleWare, questionpost);
router.get("/single-questionget/:id", authMiddleWare, singleQuestionget);
router.get("/questionsget", allquestionget);
module.exports = router;
