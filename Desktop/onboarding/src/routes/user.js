const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth");

const saltRounds = 10;
let users = []; // 임시로 사용자 정보를 저장

// 회원가입 - /signup
router.post("/signup", async (req, res) => {
  const { username, password, nickname } = req.body;

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    username,
    password: hashedPassword, // 암호화된 비밀번호 저장
    nickname,
    authorities: [{ authorityName: "ROLE_USER" }],
  };

  users.push(newUser);

  res.status(201).json({
    username: newUser.username,
    nickname: newUser.nickname,
    authorities: newUser.authorities,
  });
});

// 로그인 - /login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "잘못된 사용자 정보입니다." });
  }

  // 입력한 비밀번호와 저장된 해시된 비밀번호를 비교
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// 보호된 경로 - /protected
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "인증에 성공했습니다.", user: req.user });
});

module.exports = router;
