import { Router, type IRouter } from "express";

const router: IRouter = Router();

const SHOPS = [
  { id: 1, name: "Krishi Seva Kendra", type: "equipment", category: "Farm Equipment", address: "Near APMC, Nashik Road", district: "Nashik", state: "Maharashtra", phone: "0253-2345678", distance: "3.2 km", rating: 4.5, timings: "9 AM - 7 PM" },
  { id: 2, name: "Sahyadri Agro Inputs", type: "fertilizer", category: "Organic Fertilizers", address: "Pimpalgaon Market, Nashik", district: "Nashik", state: "Maharashtra", phone: "9876512345", distance: "5.8 km", rating: 4.2, timings: "8 AM - 8 PM" },
  { id: 3, name: "Swami Agro Center", type: "equipment", category: "Tractors & Implements", address: "Baramati Industrial Area", district: "Pune", state: "Maharashtra", phone: "02112-234567", distance: "7.5 km", rating: 4.7, timings: "9 AM - 6 PM" },
  { id: 4, name: "Green Earth Fertilizers", type: "fertilizer", category: "Biofertilizer", address: "Hadapsar, Pune", district: "Pune", state: "Maharashtra", phone: "020-24567890", distance: "4.1 km", rating: 4.3, timings: "8 AM - 9 PM" },
  { id: 5, name: "Karnataka Agro Services", type: "equipment", category: "Seeds & Equipment", address: "Dharwad Agricultural Hub", district: "Dharwad", state: "Karnataka", phone: "0836-2456789", distance: "2.8 km", rating: 4.6, timings: "9 AM - 7 PM" },
  { id: 6, name: "Kisan Fertilizer Store", type: "fertilizer", category: "NPK & Micronutrients", address: "Belgaum Town, Near Bus Stand", district: "Belgaum", state: "Karnataka", phone: "0831-2234567", distance: "6.2 km", rating: 4.1, timings: "8 AM - 8 PM" },
  { id: 7, name: "Tamil Nadu Agro Depot", type: "equipment", category: "Irrigation Equipment", address: "Coimbatore Agricultural Zone", district: "Coimbatore", state: "Tamil Nadu", phone: "0422-2567890", distance: "4.5 km", rating: 4.4, timings: "9 AM - 6 PM" },
  { id: 8, name: "Kaveri Organic Hub", type: "fertilizer", category: "Organic Fertilizers", address: "Thanjavur Market Road", district: "Thanjavur", state: "Tamil Nadu", phone: "04362-234567", distance: "3.9 km", rating: 4.5, timings: "8 AM - 8 PM" },
  { id: 9, name: "Kerala Agri Service", type: "equipment", category: "Rubber & Spice Farming", address: "Kottayam Junction", district: "Kottayam", state: "Kerala", phone: "0481-2345678", distance: "2.5 km", rating: 4.3, timings: "9 AM - 7 PM" },
  { id: 10, name: "Malabar Fertilizer Center", type: "fertilizer", category: "Mixed Fertilizers", address: "Kozhikode Beach Road", district: "Kozhikode", state: "Kerala", phone: "0495-2456789", distance: "5.1 km", rating: 4.0, timings: "8 AM - 9 PM" },
  { id: 11, name: "UP Agro Solutions", type: "equipment", category: "Tractors & Accessories", address: "Lucknow Industrial Area", district: "Lucknow", state: "Uttar Pradesh", phone: "0522-2567890", distance: "6.8 km", rating: 4.5, timings: "9 AM - 6 PM" },
  { id: 12, name: "Ganga Fertilizers", type: "fertilizer", category: "Inorganic Fertilizers", address: "Allahabad Highway, UP", district: "Allahabad", state: "Uttar Pradesh", phone: "0532-2345678", distance: "8.2 km", rating: 4.2, timings: "7 AM - 9 PM" },
  { id: 13, name: "Bengal Agro Emporium", type: "equipment", category: "Jute & Rice Farming", address: "Kolkata Agricultural Hub", district: "Kolkata", state: "West Bengal", phone: "033-24567890", distance: "4.3 km", rating: 4.4, timings: "9 AM - 7 PM" },
  { id: 14, name: "Nadia Fertilizer Shop", type: "fertilizer", category: "Biofertilizer", address: "Bardhaman Road, Nadia", district: "Nadia", state: "West Bengal", phone: "03472-234567", distance: "7.5 km", rating: 4.1, timings: "8 AM - 8 PM" },
  { id: 15, name: "MP Agri Services", type: "equipment", category: "Soybean Farming Equipment", address: "Indore APMC Road", district: "Indore", state: "Madhya Pradesh", phone: "0731-2456789", distance: "3.7 km", rating: 4.6, timings: "9 AM - 6 PM" },
  { id: 16, name: "Narmada Fertilizer Center", type: "fertilizer", category: "NPK Fertilizers", address: "Bhopal Agriculture Zone", district: "Bhopal", state: "Madhya Pradesh", phone: "0755-2345678", distance: "5.4 km", rating: 4.3, timings: "8 AM - 8 PM" },
];

router.get("/shops/nearby", (req, res) => {
  const { state, district, type } = req.query;

  let filtered = [...SHOPS];
  if (state) filtered = filtered.filter((s) => s.state === state);
  if (district) filtered = filtered.filter((s) => s.district.toLowerCase().includes((district as string).toLowerCase()));
  if (type && type !== "all") filtered = filtered.filter((s) => s.type === type);

  if (filtered.length === 0) filtered = SHOPS.slice(0, 6);

  res.json(filtered);
});

export default router;
