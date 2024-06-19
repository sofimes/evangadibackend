const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
//user controllers
const { register, login, checkUser } = require("../controler/userControler");

//register route
router.post("/register", register);
//login user
router.post("/login", login);

//check user
router.get("/check", authMiddleWare, checkUser);
module.exports = router;
