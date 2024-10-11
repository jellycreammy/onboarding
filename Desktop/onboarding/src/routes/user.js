const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// 로그인 경로
router.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// 보호된 경로
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

module.exports = router;
