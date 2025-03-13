/**
 * @fileoverview Test suite for the Clothing Routes API.
 * This suite tests the endpoints for adding, retrieving, filtering, and deleting clothing items.
 */

const request = require("supertest");
const app = require("../index");

const mockClothingData = new Map();

jest.mock("firebase-admin/firestore", () => {
  const firestoreMock = {
    collection: jest.fn((name) => {
      if (name === "clothing") {
        return {
          add: jest.fn(async (data) => {
            const id = "mockClothingId_" + Math.random().toString(36).substr(2, 9);
            mockClothingData.set(id, data);
            return { id };
          }),
          doc: jest.fn((id) => ({
            get: jest.fn(async () => ({
              exists: mockClothingData.has(id),
              data: () => mockClothingData.get(id),
            })),
            delete: jest.fn(async () => {
              if (!mockClothingData.has(id)) throw new Error("Document not found");
              mockClothingData.delete(id);
              return Promise.resolve();
            }),
            update: jest.fn(async (updates) => {
              if (!mockClothingData.has(id)) throw new Error("Document not found");
              mockClothingData.set(id, { ...mockClothingData.get(id), ...updates });
              return Promise.resolve();
            }),
          })),
          where: jest.fn().mockReturnThis(),
          get: jest.fn(async () => ({
            docs: Array.from(mockClothingData.entries()).map(([id, data]) => ({
              id,
              data: () => data,
            })),
          })),
        };
      } else if (name === "outfits") {
        return {
          add: jest.fn(),
          doc: jest.fn((id) => ({
            update: jest.fn(async (updates) => Promise.resolve()),
            delete: jest.fn(async () => Promise.resolve()),
          })),
          where: jest.fn().mockReturnThis(),
          get: jest.fn(async () => {
            const docs = [];
            return {
              docs,
              forEach: function(callback) {
                docs.forEach(callback);
              },
            };
          }),
        };
      }
      return {
        add: jest.fn(),
        doc: jest.fn(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn(async () => ({
          docs: [],
          forEach: function(callback) {
            [].forEach(callback);
          },
        })),
      };
    }),
  };

  return {
    getFirestore: jest.fn(() => firestoreMock),
  };
});

/**
 * @typedef {Object} ClothingItem
 * @property {string} name
 * @property {string} category
 * @property {string} color
 * @property {string} image
 */

/** @type {ClothingItem} */
const testItem = {
  name: "Test Shirt",
  category: "Top",
  color: "Red",
  image: "https://example.com/test-image.jpg",
};

let createdItemId = null;

/**
 * Test suite for Clothing Routes API.
 */
describe("Clothing Routes API Tests", () => {
  /**
   * Clears the in-memory data before each test.
   */
  beforeEach(() => {
    mockClothingData.clear();
  });

  /**
   * Tests that a POST request creates a new clothing item.
   */
  test("POST /api/clothing/items should add a new clothing item", async () => {
    const res = await request(app).post("/api/clothing/items").send(testItem);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(testItem.name);
    expect(res.body.category).toBe(testItem.category);
    createdItemId = res.body.id;
  });

  /**
   * Tests that a GET request retrieves all clothing items.
   */
  test("GET /api/clothing should retrieve all clothing items", async () => {
    await request(app).post("/api/clothing/items").send(testItem);
    const res = await request(app).get("/api/clothing");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  /**
   * Tests that a GET request with category and color filters retrieves matching clothing items.
   */
  test("GET /api/clothing?category=Top&color=Red should retrieve matching clothing items", async () => {
    await request(app).post("/api/clothing/items").send(testItem);
    const res = await request(app).get("/api/clothing?category=Top&color=Red");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe("Top");
    expect(res.body[0].color).toBe("Red");
  });

  /**
   * Tests that a DELETE request removes the specified clothing item.
   */
  test("DELETE /api/clothing/items/:id should delete a clothing item", async () => {
    const addRes = await request(app).post("/api/clothing/items").send(testItem);
    const itemId = addRes.body.id;
    expect(itemId).toBeDefined();
    const res = await request(app).delete(`/api/clothing/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item deleted and outfits updated");
    expect(mockClothingData.has(itemId)).toBe(false);
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
