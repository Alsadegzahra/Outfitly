/**
 * @fileoverview Test suite for the /api/search endpoint.
 * This test file mocks Firestore using the firebase-admin/firestore module and tests various filtering functionalities.
 */

const request = require("supertest");
const app = require("../index");

jest.mock("firebase-admin/firestore", () => {
  let clothingDocs = [];
  let outfitsDocs = [];

  /**
   * Creates a query interface that supports chained where calls.
   * @param {Array} docs - The documents to query.
   * @param {Array} [criteria=[]] - The query criteria.
   * @returns {Object} Query interface with where() and get() methods.
   */
  const createQuery = (docs, criteria = []) => {
    return {
      where(field, op, value) {
        return createQuery(docs, [...criteria, { field, op, value }]);
      },
      async get() {
        const filtered = docs.filter(doc => {
          return criteria.every(crit => {
            if (crit.field === "id" && crit.op === "==") {
              return doc.id === crit.value;
            }
            if (crit.field === "name" && crit.op === ">=") {
              return doc.data[crit.field] >= crit.value;
            }
            if (crit.op === "==") {
              return doc.data[crit.field] === crit.value;
            }
            return true;
          });
        });
        return {
          docs: filtered.map(doc => ({
            id: doc.id,
            data: () => doc.data,
          })),
        };
      },
    };
  };

  /**
   * Resets the in-memory Firestore data.
   */
  const __resetFirestoreData = () => {
    clothingDocs = [];
    outfitsDocs = [];
  };

  /**
   * Sets the in-memory Firestore data.
   * @param {Array} newClothingDocs - The clothing documents.
   * @param {Array} newOutfitsDocs - The outfit documents.
   */
  const __setFirestoreData = (newClothingDocs, newOutfitsDocs) => {
    clothingDocs = newClothingDocs;
    outfitsDocs = newOutfitsDocs;
  };

  const firestoreMock = {
    collection: jest.fn((name) => {
      if (name === "clothing") {
        return createQuery(clothingDocs);
      } else if (name === "outfits") {
        return {
          add: jest.fn(async (data) => {
            const id = "outfit" + Math.random().toString(36).substr(2, 5);
            const doc = { id, data };
            outfitsDocs.push(doc);
            return { id };
          }),
          doc: jest.fn((id) => ({
            get: jest.fn(async () => {
              const doc = outfitsDocs.find(d => d.id === id);
              return { exists: !!doc, data: () => (doc ? doc.data : null) };
            }),
            delete: jest.fn(async () => {
              const index = outfitsDocs.findIndex(d => d.id === id);
              if (index === -1) throw new Error("Document not found");
              outfitsDocs.splice(index, 1);
              return Promise.resolve();
            }),
            update: jest.fn(async (updates) => {
              const doc = outfitsDocs.find(d => d.id === id);
              if (!doc) throw new Error("Document not found");
              doc.data = { ...doc.data, ...updates };
              return Promise.resolve();
            }),
          })),
          where: jest.fn().mockReturnThis(),
          get: jest.fn(async () => ({
            docs: outfitsDocs.map(doc => ({
              id: doc.id,
              data: () => doc.data,
            })),
            forEach: function(callback) {
              this.docs.forEach(callback);
            },
          })),
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
    __resetFirestoreData,
    __setFirestoreData,
  };

  return {
    getFirestore: jest.fn(() => firestoreMock),
  };
});

/**
 * Test suite for the /api/search endpoint.
 */
describe("Search Routes API Tests", () => {
  const { getFirestore } = require("firebase-admin/firestore");
  const db = getFirestore();

  beforeEach(() => {
    db.__resetFirestoreData();
    db.__setFirestoreData(
      [
        { id: "cloth1", data: { name: "casual red shirt", category: "Top", color: "Red", image: "url1" } },
        { id: "cloth2", data: { name: "formal blue shirt", category: "Top", color: "Blue", image: "url2" } },
        { id: "cloth3", data: { name: "casual green pants", category: "Bottom", color: "Green", image: "url3" } },
      ],
      [
        { id: "outfit1", data: { name: "casual look", items: ["cloth1", "cloth2"] } },
        { id: "outfit2", data: { name: "formal look", items: ["cloth2", "cloth3"] } },
      ]
    );
  });

  /**
   * Tests that a GET request with no query parameters returns all clothing and outfits.
   */
  test("GET /api/search with no query params returns all clothing and outfits", async () => {
    const res = await request(app).get("/api/search");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.clothing)).toBe(true);
    expect(res.body.clothing).toHaveLength(3);
    expect(Array.isArray(res.body.outfits)).toBe(true);
    expect(res.body.outfits).toHaveLength(2);
  });

  /**
   * Tests that a GET request with a search query filters outfits by name.
   */
  test("GET /api/search with search query filters outfits by name", async () => {
    const res = await request(app).get("/api/search").query({ q: "casual" });
    expect(res.status).toBe(200);
    expect(res.body.outfits).toHaveLength(1);
    expect(res.body.outfits[0].name.toLowerCase()).toContain("casual");
  });

  /**
   * Tests that a GET request with category and color filters returns the expected clothing item and outfit items.
   */
  test("GET /api/search with category and color filters", async () => {
    const res = await request(app).get("/api/search").query({ category: "Top", color: "Red" });
    expect(res.status).toBe(200);
    expect(res.body.clothing).toHaveLength(1);
    expect(res.body.clothing[0].category).toBe("Top");
    expect(res.body.clothing[0].color).toBe("Red");
    const outfit1 = res.body.outfits.find(o => o.id === "outfit1");
    expect(outfit1).toBeDefined();
    expect(outfit1.items).toHaveLength(1);
    expect(outfit1.items[0].id).toBe("cloth1");
  });
});

afterAll(() => {
  jest.clearAllMocks();
});
