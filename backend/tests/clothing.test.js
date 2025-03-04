const request = require("supertest");
const app = require("../index"); // Import your Express app

jest.setTimeout(10000); // ✅ Increase timeout to 10 seconds

describe("Clothing API Tests", () => {
  it("should add a clothing item", async () => {
    const res = await request(app)
      .post("/api/clothing/items")
      .send({ name: "Jacket", category: "Outerwear", color: "Black" });
  

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Jacket");
  });

  it("should fetch all clothing items", async () => {
    const res = await request(app).get("/api/clothing");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Give Firestore time to close
});

