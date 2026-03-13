import { Router, type IRouter } from "express";
import { db, landListingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const SAMPLE_LAND = [
  { id: 1, listingType: "sell", village: "Vadgaon", district: "Nashik", state: "Maharashtra", soilType: "Black Cotton", farmSize: 5, waterAvailability: "Borewell + Canal", price: 2500000, priceUnit: "total", contact: "9876543210", ownerName: "Ramchandra Patil", description: "Well-irrigated fertile land with borewell, near highway", createdAt: new Date().toISOString() },
  { id: 2, listingType: "rent", village: "Kapila", district: "Pune", state: "Maharashtra", soilType: "Red Loamy", farmSize: 3, waterAvailability: "Drip Irrigation", price: 15000, priceUnit: "per acre/year", contact: "9765432109", ownerName: "Surekha Jadhav", description: "Flat land with drip irrigation setup, suitable for vegetables", createdAt: new Date().toISOString() },
  { id: 3, listingType: "buy", village: "Sitapur", district: "Lucknow", state: "Uttar Pradesh", soilType: "Alluvial", farmSize: 8, waterAvailability: "Tubewell", price: 3200000, priceUnit: "total", contact: "9654321098", ownerName: "Raj Kumar Singh", description: "Highly fertile alluvial land near river, excellent for wheat and sugarcane", createdAt: new Date().toISOString() },
  { id: 4, listingType: "lease", village: "Thandalai", district: "Coimbatore", state: "Tamil Nadu", soilType: "Sandy Loam", farmSize: 10, waterAvailability: "Irrigation Canal", price: 20000, priceUnit: "per acre/year", contact: "9543210987", ownerName: "Selvam Murugan", description: "10 acres available for 5-year lease, groundwater available", createdAt: new Date().toISOString() },
  { id: 5, listingType: "sell", village: "Malvalli", district: "Mandya", state: "Karnataka", soilType: "Red Loamy", farmSize: 4, waterAvailability: "Canal Irrigation", price: 1800000, priceUnit: "total", contact: "9432109876", ownerName: "Narayana Gowda", description: "Sugarcane and paddy cultivation land with canal water rights", createdAt: new Date().toISOString() },
  { id: 6, listingType: "rent", village: "Palai", district: "Kottayam", state: "Kerala", soilType: "Clay", farmSize: 2, waterAvailability: "River and Rain", price: 25000, priceUnit: "per acre/year", contact: "9321098765", ownerName: "Jose Mathew", description: "Coconut and paddy land with good water availability", createdAt: new Date().toISOString() },
];

router.get("/land/listings", async (req, res) => {
  const { type, state, soil_type } = req.query;

  try {
    let dbListings = await db.select().from(landListingsTable).orderBy(desc(landListingsTable.createdAt)).limit(50);
    let all = [...SAMPLE_LAND, ...dbListings.map((l) => ({ ...l, createdAt: l.createdAt?.toISOString() }))];

    if (type) all = all.filter((l) => l.listingType === type);
    if (state) all = all.filter((l) => l.state === state);
    if (soil_type) all = all.filter((l) => l.soilType === soil_type);

    res.json(all);
  } catch {
    res.json(SAMPLE_LAND);
  }
});

router.post("/land/listings", async (req, res) => {
  const { listingType, village, district, state, soilType, farmSize, waterAvailability, price, priceUnit, contact, ownerName, description } = req.body;

  try {
    const [listing] = await db
      .insert(landListingsTable)
      .values({ listingType, village, district, state, soilType, farmSize, waterAvailability, price, priceUnit, contact, ownerName, description: description || null })
      .returning();

    res.status(201).json({ ...listing, createdAt: listing.createdAt?.toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

export default router;
