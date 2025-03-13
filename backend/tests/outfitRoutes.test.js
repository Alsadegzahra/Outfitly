/**
 * @fileoverview Test suite for the Outfit Routes API.
 * This file tests the endpoints for creating, retrieving, and deleting outfits.
 */

const request = require("supertest");
const app = require("../index");
const { getFirestore } = require("firebase-admin/firestore");

jest.mock("firebase-admin/firestore", () => {
  const firestoreMock = {
    collection: jest.fn(() => ({
      add: jest.fn(async (data) => ({
        id: "mockOutfitId",
        ...data,
      })),
      doc: jest.fn((id) => ({
        get: jest.fn(async () => ({
          exists: id === "mockOutfitId",
          data: () => ({
            name: "Casual Outfit",
            items: ["mockItemId1", "mockItemId2"],
          }),
        })),
        delete: jest.fn(async () => {
          if (id !== "mockOutfitId") throw new Error("Document not found");
          return Promise.resolve();
        }),
      })),
      where: jest.fn().mockReturnThis(),
      get: jest.fn(async () => ({
        docs: [
          {
            id: "mockOutfitId",
            data: () => ({
              name: "Casual Outfit",
              items: ["mockItemId1", "mockItemId2"],
            }),
          },
        ],
      })),
    })),
  };

  return {
    getFirestore: jest.fn(() => firestoreMock),
  };
});

/**
 * @typedef {Object} Outfit
 * @property {string} name - The name of the outfit.
 * @property {string[]} items - The IDs of the clothing items in the outfit.
 */

/** @type {Outfit} */
const testOutfit = {
  name: "Casual Outfit",
  items: ["mockItemId1", "mockItemId2"],
};

let createdOutfitId = "mockOutfitId";

/**
 * Outfit Routes API Tests
 */
describe("Outfit Routes API Tests", () => {
  /**
   * Test creating a new outfit.
   */
  test("POST /api/outfits should create a new outfit", async () => {
    const res = await request(app).post("/api/outfits").send(testOutfit);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(testOutfit.name);
    expect(res.body.items).toEqual(testOutfit.items);
    createdOutfitId = res.body.id;
  });

  /**
   * Test retrieving all outfits.
   */
  test("GET /api/outfits should retrieve all outfits", async () => {
    const res = await request(app).get("/api/outfits");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  /**
   * Test retrieving outfits with category and color filters.
   */
  test("GET /api/outfits?category=Top&color=Red should retrieve matching outfits", async () => {
    const res = await request(app).get("/api/outfits?category=Top&color=Red");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(0);
  });

  /**
   * Test deleting an existing outfit.
   */
  test("DELETE /api/outfits/:id should delete an outfit", async () => {
    if (!createdOutfitId) throw new Error("No outfit ID found for deletion test");
    const res = await request(app).delete(`/api/outfits/${createdOutfitId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Outfit deleted successfully");
  });

  /**
   * Test deleting a non-existent outfit returns an error.
   */
  test("DELETE /api/outfits/:id should return error if outfit does not exist", async () => {
    const res = await request(app).delete("/api/outfits/nonExistentId");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error deleting outfit");
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
