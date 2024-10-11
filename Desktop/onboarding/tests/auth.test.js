const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

describe("Authentication Test", () => {
  let token;

  beforeAll(async () => {
    // 회원가입 추가
    await request(app)
      .post("/user/signup")
      .send({ username: "testuser", password: "1234", nickname: "Tester" });

    // 로그인 후 토큰 발급
    const res = await request(app)
      .post("/user/login")
      .send({ username: "testuser", password: "1234" });

    token = res.body.token;
  });

  test("should login and get a token", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: "testuser", password: "1234" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should access protected route with valid token", async () => {
    const res = await request(app)
      .get("/user/protected")
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "인증에 성공했습니다."); // 응답 메시지 변경
  });

  test("should not access protected route without token", async () => {
    const res = await request(app).get("/user/protected");
    expect(res.statusCode).toEqual(403);
  });
});
