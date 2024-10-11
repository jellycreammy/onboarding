require("dotenv").config(); // 환경변수 설정

const express = require("express");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

// 사용자 라우트 설정
app.use("/user", userRoutes);

module.exports = app;
