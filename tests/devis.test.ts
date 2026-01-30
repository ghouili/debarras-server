import request from "supertest";
import app from "../src/app";

describe("devis", () => {
  it("should reject unauthorized list", async () => {
    const res = await request(app).get("/api/devis");
    expect(res.status).toBe(401);
  });
});
