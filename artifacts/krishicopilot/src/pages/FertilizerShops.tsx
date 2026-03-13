import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Phone, MapPin, Star, Loader2 } from "lucide-react";

interface Shop { id: number; name: string; type: string; category: string; address: string; district: string; state: string; phone: string; distance: string; rating: number; timings?: string; }

const CATEGORIES = ["All", "Organic Fertilizers", "NPK & Micronutrients", "Biofertilizer", "Inorganic Fertilizers", "Mixed Fertilizers"];
const CAT_COLORS: Record<string, string> = { "Organic Fertilizers": "bg-green-100 text-green-700", "NPK & Micronutrients": "bg-blue-100 text-blue-700", "Biofertilizer": "bg-teal-100 text-teal-700", "Inorganic Fertilizers": "bg-orange-100 text-orange-700", "Mixed Fertilizers": "bg-purple-100 text-purple-700" };

export default function FertilizerShopsPage({ t }: { t: (k: string) => string }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    api.get<Shop[]>("/shops/nearby?type=fertilizer").then((data) => {
      setShops(data);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const filtered = category === "All" ? shops : shops.filter((s) => s.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🌱</div>
          <h1 className="text-2xl font-bold">Fertilizer Shops</h1>
        </div>
        <p className="text-green-100">Find organic, inorganic, and biofertilizer shops across India.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-green-300"}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-green-600"><Loader2 className="w-6 h-6 animate-spin inline mr-2" />Finding shops...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((shop) => (
            <div key={shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 feature-card-hover">
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CAT_COLORS[shop.category] || "bg-gray-100 text-gray-700"}`}>{shop.category}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-gray-600">{shop.rating}</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">{shop.name}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span>{shop.address}, {shop.state}</span>
                </div>
                <p>📞 {shop.phone}</p>
                {shop.timings && <p className="text-xs text-gray-400">🕐 {shop.timings}</p>}
                <p className="text-xs bg-gray-50 px-2 py-1 rounded-lg w-fit">📍 {shop.distance} away</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${shop.phone}`} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a href={`https://maps.google.com?q=${encodeURIComponent(shop.name + " " + shop.state)}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Locate
                </a>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              <p>No shops found for this category. Try "All" to see all fertilizer shops.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
