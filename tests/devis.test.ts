import request from "supertest";
import app from "../src/app";

describe("devis", () => {
  it("should reject unauthorized list", async () => {
    const res = await request(app).get("/api/devis");
    expect(res.status).toBe(401);
  });

  it("should reject unauthorized status update", async () => {
    const res = await request(app)
      .patch("/api/devis/2b0a5a15-8c8b-4b20-b4f7-4b4a2b7b4b47/status")
      .send({ status: "traite" });
    expect(res.status).toBe(401);
  });
});
