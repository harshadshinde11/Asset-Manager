import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShoppingBag, Phone, MessageCircle, Plus, Filter, Loader2, X } from "lucide-react";

interface Listing { id: number; crop: string; quantity: number; unit: string; price: number; location: string; state: string; contact: string; farmerName: string; harvestDate: string; quality?: string; description?: string; createdAt: string; }

const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Punjab"];
const CROPS = ["Tomato", "Onion", "Wheat", "Rice", "Cotton", "Mango", "Banana", "Groundnut", "Soybean", "Potato", "Grape", "Sugarcane"];
const UNITS = ["kg", "quintal", "ton", "dozen", "box"];

export default function FarmerMarketPage({ t }: { t: (k: string) => string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCrop, setFilterCrop] = useState("");
  const [filterState, setFilterState] = useState("");
  const [form, setForm] = useState({ crop: "Tomato", quantity: "", unit: "kg", price: "", location: "", state: "Maharashtra", contact: "", farmerName: "", harvestDate: "", quality: "Grade A", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCrop) params.set("crop", filterCrop);
      if (filterState) params.set("state", filterState);
      const data = await api.get<Listing[]>(`/farmer-market/listings${params.toString() ? "?" + params.toString() : ""}`);
      setListings(data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { fetchListings(); }, [filterCrop, filterState]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/farmer-market/listings", { ...form, quantity: parseFloat(form.quantity), price: parseFloat(form.price) });
      setShowForm(false);
      fetchListings();
    } catch { } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><ShoppingBag className="w-5 h-5" /></div>
            <div>
              <h1 className="text-2xl font-bold">Farmer to Customer Marketplace</h1>
              <p className="text-orange-100">Buy directly from farmers. Fresh produce, better prices.</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filterCrop} onChange={(e) => setFilterCrop(e.target.value)} className="outline-none text-sm text-gray-700 bg-transparent">
            <option value="">All Crops</option>
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="outline-none text-sm text-gray-700 bg-transparent">
            <option value="">All States</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {(filterCrop || filterState) && (
          <button onClick={() => { setFilterCrop(""); setFilterState(""); }} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-orange-600"><Loader2 className="w-6 h-6 animate-spin inline mr-2" />Loading listings...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden feature-card-hover">
              <div className="bg-gradient-to-br from-green-50 to-orange-50 p-5 text-center">
                <p className="text-4xl mb-2">🌾</p>
                <h3 className="font-bold text-gray-900 text-lg">{l.crop}</h3>
                {l.quality && <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{l.quality}</span>}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-green-700">₹{l.price}</span>
                  <span className="text-sm text-gray-500">per {l.unit}</span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                  <p>📦 {l.quantity} {l.unit}</p>
                  <p>📍 {l.location}, {l.state}</p>
                  <p>👨‍🌾 {l.farmerName}</p>
                  <p>🗓️ Harvest: {l.harvestDate}</p>
                </div>
                {l.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{l.description}</p>}
                <div className="flex gap-2">
                  <a href={`tel:${l.contact}`} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <a href={`https://wa.me/91${l.contact}?text=Hi, I'm interested in your ${l.crop} listing on KrishiCopilot.`} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Listing Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">Add New Listing</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "crop", label: "Crop", type: "select", options: CROPS },
                  { key: "state", label: "State", type: "select", options: STATES },
                  { key: "unit", label: "Unit", type: "select", options: UNITS },
                ].map(({ key, label, type, options }) => (
                  <div key={key} className={key === "state" ? "col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" required>
                      {options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                {[["quantity", "Quantity", "number"], ["price", "Price (₹)", "number"]].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" required />
                  </div>
                ))}
              </div>
              {[["farmerName", "Farmer Name", "text"], ["contact", "Phone Number", "tel"], ["location", "Village/City", "text"], ["harvestDate", "Harvest Date", "date"]].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" required />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : "✓ Add Listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
