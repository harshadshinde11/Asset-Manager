import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Map, Phone, Plus, Filter, Loader2, X } from "lucide-react";

interface LandListing { id: number; listingType: string; village: string; district: string; state: string; soilType: string; farmSize: number; waterAvailability: string; price: number; priceUnit: string; contact: string; ownerName: string; description?: string; createdAt: string; }

const LISTING_TYPES = ["buy", "rent", "sell", "lease"];
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Madhya Pradesh"];
const SOIL_TYPES = ["Black Cotton", "Red Loamy", "Alluvial", "Sandy Loam", "Clay"];
const TYPE_LABELS: Record<string, string> = { buy: "For Sale", rent: "For Rent", sell: "Wanted to Buy", lease: "For Lease" };
const TYPE_COLORS: Record<string, string> = { buy: "bg-green-100 text-green-700", rent: "bg-blue-100 text-blue-700", sell: "bg-orange-100 text-orange-700", lease: "bg-purple-100 text-purple-700" };

export default function LandMarketplacePage({ t }: { t: (k: string) => string }) {
  const [activeTab, setActiveTab] = useState("buy");
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterState, setFilterState] = useState("");
  const [filterSoil, setFilterSoil] = useState("");
  const [form, setForm] = useState({ listingType: "sell", village: "", district: "", state: "Maharashtra", soilType: "Black Cotton", farmSize: "", waterAvailability: "", price: "", priceUnit: "total", contact: "", ownerName: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function fetchListings() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type: activeTab });
      if (filterState) params.set("state", filterState);
      if (filterSoil) params.set("soil_type", filterSoil);
      const data = await api.get<LandListing[]>(`/land/listings?${params.toString()}`);
      setListings(data);
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { fetchListings(); }, [activeTab, filterState, filterSoil]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/land/listings", { ...form, farmSize: parseFloat(form.farmSize), price: parseFloat(form.price) });
      setShowForm(false);
      fetchListings();
    } catch { } finally { setSubmitting(false); }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Map className="w-5 h-5" /></div>
            <div>
              <h1 className="text-2xl font-bold">Land Marketplace</h1>
              <p className="text-teal-100">Buy, rent, sell, or lease agricultural land across India</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-white text-teal-700 font-bold px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-colors">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        {LISTING_TYPES.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${activeTab === tab ? "bg-white text-teal-700 shadow-sm" : "text-gray-600 hover:text-teal-700"}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Land
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 bg-white">
          <option value="">All States</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterSoil} onChange={(e) => setFilterSoil(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 bg-white">
          <option value="">All Soil Types</option>
          {SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(filterState || filterSoil) && <button onClick={() => { setFilterState(""); setFilterSoil(""); }} className="text-sm text-red-600 flex items-center gap-1"><X className="w-4 h-4" />Clear</button>}
      </div>

      {loading ? (
        <div className="text-center py-16 text-teal-600"><Loader2 className="w-6 h-6 animate-spin inline mr-2" />Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No listings found. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden feature-card-hover">
              <div className="bg-gradient-to-br from-teal-50 to-green-50 p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLORS[l.listingType]}`}>{TYPE_LABELS[l.listingType]}</span>
                  <span className="text-xs text-gray-400">{l.farmSize} acres</span>
                </div>
                <p className="font-bold text-gray-900">{l.village}, {l.district}</p>
                <p className="text-sm text-gray-500">{l.state}</p>
              </div>
              <div className="p-5">
                <p className="text-2xl font-bold text-teal-700 mb-3">₹{l.price.toLocaleString()} <span className="text-sm text-gray-400 font-normal">{l.priceUnit}</span></p>
                <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                  <p>🪱 Soil: {l.soilType}</p>
                  <p>💧 Water: {l.waterAvailability}</p>
                  <p>👤 {l.ownerName}</p>
                </div>
                {l.description && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{l.description}</p>}
                <a href={`tel:${l.contact}`} className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                  <Phone className="w-4 h-4" /> Contact Owner
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">Add Land Listing</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                <select value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required>
                  {LISTING_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["village", "Village/Town"], ["district", "District"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required />
                  </div>
                ))}
              </div>
              {[
                { key: "state", label: "State", type: "select", options: STATES },
                { key: "soilType", label: "Soil Type", type: "select", options: SOIL_TYPES },
              ].map(({ key, label, type, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <select value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required>
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (acres)</label>
                  <input type="number" value={form.farmSize} onChange={(e) => setForm({ ...form, farmSize: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required />
                </div>
              </div>
              {[["waterAvailability", "Water Availability"], ["ownerName", "Owner Name"], ["contact", "Phone Number"]].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" required />
                </div>
              ))}
              <button type="submit" disabled={submitting} className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : "✓ Add Land Listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
