const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

describe("Authentication Test", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ username: "testuser" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  test("should login and get a token", async () => {
    const res = await request(app)
      .post("/user/login")
      .send({ username: "testuser" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should access protected route with valid token", async () => {
    const res = await request(app)
      .get("/user/protected")
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "You are authorized");
  });

  test("should not access protected route without token", async () => {
    const res = await request(app).get("/user/protected");
    expect(res.statusCode).toEqual(403);
  });
});
