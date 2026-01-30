import request from "supertest";
import app from "../src/app";

describe("auth", () => {
  it("should return 400 for invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });
});
