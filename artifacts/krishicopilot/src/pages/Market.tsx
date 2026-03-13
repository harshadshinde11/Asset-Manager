import { useState } from "react";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart2, Loader2 } from "lucide-react";

interface MandiPrice { market: string; district: string; currentPrice: number; minPrice: number; maxPrice: number; unit: string; distance: string; }
interface MarketResult { crop: string; state: string; currentPrice: number; prediction5Day: number; prediction10Day: number; trend: string; trendPercent: number; unit: string; nearbyMandis: MandiPrice[]; bestMarket: string; advice: string; }

const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Madhya Pradesh"];
const CROPS_BY_STATE: Record<string, string[]> = {
  Maharashtra: ["Tomato", "Onion", "Cotton", "Grape", "Soybean", "Wheat"],
  Karnataka: ["Tomato", "Jowar", "Cotton", "Rice", "Ragi"],
  "Tamil Nadu": ["Tomato", "Rice", "Banana", "Groundnut"],
  Kerala: ["Banana", "Coconut", "Rubber", "Pepper"],
  "West Bengal": ["Rice", "Jute", "Potato", "Tea"],
  "Uttar Pradesh": ["Wheat", "Sugarcane", "Rice", "Potato"],
  "Madhya Pradesh": ["Soybean", "Wheat", "Chickpea", "Maize"],
};

export default function MarketPage({ t }: { t: (k: string) => string }) {
  const [form, setForm] = useState({ state: "Maharashtra", district: "", market: "", crop_name: "Tomato", quantity: "" });
  const [result, setResult] = useState<MarketResult | null>(null);
  const [loading, setLoading] = useState(false);

  const availableCrops = CROPS_BY_STATE[form.state] || CROPS_BY_STATE["Maharashtra"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { const data = await api.post<MarketResult>("/market/prices", form); setResult(data); }
    catch { } finally { setLoading(false); }
  }

  const chartData = result ? [
    { day: "Today", price: result.currentPrice },
    { day: "5 Days", price: result.prediction5Day },
    { day: "10 Days", price: result.prediction10Day },
  ] : [];

  const trendConfig = { rising: { color: "text-green-700 bg-green-100", icon: <TrendingUp className="w-4 h-4" />, arrow: "↑" }, falling: { color: "text-red-700 bg-red-100", icon: <TrendingDown className="w-4 h-4" />, arrow: "↓" }, stable: { color: "text-gray-700 bg-gray-100", icon: <Minus className="w-4 h-4" />, arrow: "→" } };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BarChart2 className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">Market Intelligence</h1>
        </div>
        <p className="text-blue-100">Real-time mandi prices, price predictions, and nearby market comparison.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-5 text-lg">Search Market</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value, crop_name: CROPS_BY_STATE[e.target.value]?.[0] || "Tomato" })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 text-sm">
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="e.g. Nashik, Pune" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market/Mandi</label>
                <input value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} placeholder="e.g. Lasalgaon APMC" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop *</label>
                <select value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 text-sm">
                  {availableCrops.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (quintal)</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 10" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400 text-sm" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Fetching...</> : "📊 Analyze Market"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {!result && !loading && (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">Select your state, crop, and click "Analyze Market" to see prices and predictions.</p>
            </div>
          )}
          {result && (
            <>
              {/* Price cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Current Price", value: result.currentPrice, tag: "Today", color: "bg-white border-gray-200" },
                  { label: "5-Day Prediction", value: result.prediction5Day, tag: "5 Days", color: "bg-blue-50 border-blue-200" },
                  { label: "10-Day Prediction", value: result.prediction10Day, tag: "10 Days", color: "bg-indigo-50 border-indigo-200" },
                ].map((p) => (
                  <div key={p.label} className={`${p.color} border rounded-2xl p-4 text-center`}>
                    <p className="text-xs text-gray-500 mb-1">{p.label}</p>
                    <p className="text-xl font-bold text-gray-900">₹{p.value}</p>
                    <p className="text-xs text-gray-400">per {result.unit}</p>
                    <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.tag}</span>
                  </div>
                ))}
              </div>

              {/* Trend & Advice */}
              <div className={`rounded-2xl p-5 border ${result.trend === "rising" ? "bg-green-50 border-green-200" : result.trend === "falling" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${trendConfig[result.trend as keyof typeof trendConfig]?.color}`}>
                      {trendConfig[result.trend as keyof typeof trendConfig]?.icon}
                      {result.trend === "rising" ? "Rising" : result.trend === "falling" ? "Falling" : "Stable"} {result.trendPercent}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">Best Market: <strong>{result.bestMarket}</strong></span>
                </div>
                <p className="text-sm text-gray-700">{result.advice}</p>
              </div>

              {/* Price trend chart */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Price Trend Forecast (₹/{result.unit})</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => `₹${v}`} />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: "#3b82f6" }} name="Price" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Nearby mandis comparison */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Nearby Mandi Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600">
                        <th className="text-left px-4 py-2.5 rounded-l-xl">Market</th>
                        <th className="text-left px-4 py-2.5">District</th>
                        <th className="text-right px-4 py-2.5">Min Price</th>
                        <th className="text-right px-4 py-2.5">Current</th>
                        <th className="text-right px-4 py-2.5">Max Price</th>
                        <th className="text-right px-4 py-2.5 rounded-r-xl">Distance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.nearbyMandis.map((m, i) => (
                        <tr key={i} className={`border-b border-gray-50 ${i === 0 ? "font-semibold" : ""}`}>
                          <td className="px-4 py-3">{m.market}{i === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Best</span>}</td>
                          <td className="px-4 py-3 text-gray-500">{m.district}</td>
                          <td className="px-4 py-3 text-right text-gray-500">₹{m.minPrice}</td>
                          <td className="px-4 py-3 text-right text-green-700 font-bold">₹{m.currentPrice}</td>
                          <td className="px-4 py-3 text-right text-gray-500">₹{m.maxPrice}</td>
                          <td className="px-4 py-3 text-right text-gray-400">{m.distance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
