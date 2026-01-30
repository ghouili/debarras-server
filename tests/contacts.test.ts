import request from "supertest";
import app from "../src/app";

describe("contacts", () => {
  it("should reject unauthorized list", async () => {
    const res = await request(app).get("/api/contacts");
    expect(res.status).toBe(401);
  });
});
