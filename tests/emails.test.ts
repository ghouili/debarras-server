import request from "supertest";
import app from "../src/app";

describe("emails", () => {
  it("should reject unauthorized list", async () => {
    const res = await request(app).get("/api/emails");
    expect(res.status).toBe(401);
  });
});
