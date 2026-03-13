import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Store, Phone, MapPin, Star, Loader2, Filter } from "lucide-react";

interface Shop { id: number; name: string; type: string; category: string; address: string; district: string; state: string; phone: string; distance: string; rating: number; timings?: string; }

const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Madhya Pradesh"];
const TYPE_COLORS: Record<string, string> = { equipment: "bg-blue-100 text-blue-700", fertilizer: "bg-green-100 text-green-700", seeds: "bg-yellow-100 text-yellow-700", pesticides: "bg-red-100 text-red-700" };

export default function NearbyShopsPage({ t }: { t: (k: string) => string }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [shopType, setShopType] = useState("all");

  async function fetchShops() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (state) params.set("state", state);
      if (district) params.set("district", district);
      if (shopType !== "all") params.set("type", shopType);
      const data = await api.get<Shop[]>(`/shops/nearby?${params.toString()}`);
      setShops(data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { fetchShops(); }, [state, district, shopType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Store className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">Nearby Farm Shops</h1>
        </div>
        <p className="text-slate-200">Find farm equipment, fertilizer, seeds, and pesticide shops near you.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Filter by:</span>
        </div>
        <select value={state} onChange={(e) => setState(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-slate-400 bg-white">
          <option value="">All States</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District..." className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-slate-400 w-40" />
        <div className="flex gap-2">
          {[["all", "All Shops"], ["equipment", "Equipment"], ["fertilizer", "Fertilizer"]].map(([val, lbl]) => (
            <button key={val} onClick={() => setShopType(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${shopType === val ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-600"><Loader2 className="w-6 h-6 animate-spin inline mr-2" />Finding shops...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 feature-card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[shop.type] || "bg-gray-100 text-gray-700"}`}>{shop.category}</span>
                  <h3 className="font-bold text-gray-900 mt-2">{shop.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-gray-600">{shop.rating}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <span>{shop.address}, {shop.district}, {shop.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{shop.phone}</span>
                </div>
                {shop.timings && <p className="text-xs text-gray-400">🕐 {shop.timings}</p>}
                <p className="text-xs bg-gray-50 px-2 py-1 rounded-lg w-fit">📍 {shop.distance} away</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${shop.phone}`} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a href={`https://maps.google.com?q=${encodeURIComponent(shop.address + " " + shop.state)}`} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
