import { Router, type IRouter } from "express";
import { db, farmerMarketplaceTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const SAMPLE_LISTINGS = [
  { id: 1, crop: "Tomato", quantity: 500, unit: "kg", price: 1200, location: "Nashik", state: "Maharashtra", contact: "9876543210", farmerName: "Ramesh Patil", harvestDate: "2026-03-20", quality: "Grade A", description: "Fresh tomatoes directly from farm, no chemicals", createdAt: new Date().toISOString() },
  { id: 2, crop: "Onion", quantity: 2000, unit: "kg", price: 2500, location: "Pimpalgaon", state: "Maharashtra", contact: "9765432109", farmerName: "Suresh Jadhav", harvestDate: "2026-03-18", quality: "Grade A", description: "Red onions, properly dried and graded", createdAt: new Date().toISOString() },
  { id: 3, crop: "Wheat", quantity: 100, unit: "quintal", price: 2200, location: "Lucknow", state: "Uttar Pradesh", contact: "9654321098", farmerName: "Vijay Singh", harvestDate: "2026-04-01", quality: "FAQ", description: "High protein wheat, suitable for atta mills", createdAt: new Date().toISOString() },
  { id: 4, crop: "Rice", quantity: 50, unit: "quintal", price: 2000, location: "Bardhaman", state: "West Bengal", contact: "9543210987", farmerName: "Ananta Dey", harvestDate: "2026-03-25", quality: "Grade A", description: "Gobindobhog fragrant rice, freshly harvested", createdAt: new Date().toISOString() },
  { id: 5, crop: "Mango", quantity: 300, unit: "kg", price: 6000, location: "Ratnagiri", state: "Maharashtra", contact: "9432109876", farmerName: "Ganesh Sawant", harvestDate: "2026-05-15", quality: "Alphonso Grade 1", description: "Original Alphonso mangoes with GI tag certification", createdAt: new Date().toISOString() },
  { id: 6, crop: "Banana", quantity: 1000, unit: "kg", price: 2800, location: "Kochi", state: "Kerala", contact: "9321098765", farmerName: "Thomas Varghese", harvestDate: "2026-03-22", quality: "Grade A", description: "Nendran bananas, perfect for Kerala cuisine", createdAt: new Date().toISOString() },
  { id: 7, crop: "Groundnut", quantity: 200, unit: "quintal", price: 5500, location: "Junagadh", state: "Gujarat", contact: "9210987654", farmerName: "Bhavesh Patel", harvestDate: "2026-04-10", quality: "Bold", description: "Bold groundnuts with high oil content, aflatoxin tested", createdAt: new Date().toISOString() },
  { id: 8, crop: "Cotton", quantity: 50, unit: "quintal", price: 6200, location: "Akola", state: "Maharashtra", contact: "9109876543", farmerName: "Mahadev Deshmukh", harvestDate: "2026-03-30", quality: "Long Staple", description: "Long staple cotton with good fiber length", createdAt: new Date().toISOString() },
];

router.get("/farmer-market/listings", async (req, res) => {
  const { crop, state } = req.query;
  try {
    let dbListings = await db.select().from(farmerMarketplaceTable).orderBy(desc(farmerMarketplaceTable.createdAt)).limit(50);

    let filtered = [...SAMPLE_LISTINGS, ...dbListings.map((l) => ({ ...l, createdAt: l.createdAt?.toISOString() }))];
    if (crop) filtered = filtered.filter((l) => l.crop.toLowerCase().includes((crop as string).toLowerCase()));
    if (state) filtered = filtered.filter((l) => l.state === state);

    res.json(filtered);
  } catch {
    res.json(SAMPLE_LISTINGS);
  }
});

router.post("/farmer-market/listings", async (req, res) => {
  const { crop, quantity, unit, price, location, state, contact, farmerName, harvestDate, quality, description } = req.body;

  try {
    const [listing] = await db
      .insert(farmerMarketplaceTable)
      .values({ crop, quantity, unit: unit || "kg", price, location, state, contact, farmerName, harvestDate, quality: quality || null, description: description || null })
      .returning();

    res.status(201).json({ ...listing, createdAt: listing.createdAt?.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

export default router;
