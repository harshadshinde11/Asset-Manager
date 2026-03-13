import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { Camera, Upload, Bug, AlertTriangle, Loader2, CheckCircle } from "lucide-react";

interface PestResult { detectedPest: string; confidence: number; organicTreatment: string[]; chemicalTreatment: string[]; preventionTips: string[]; severity: string; scanId: number; }

const CROP_TYPES = ["Rice", "Wheat", "Cotton", "Tomato", "Onion", "Potato", "Sugarcane", "Maize", "Soybean", "Groundnut", "Chilli", "Brinjal"];
const SEVERITY_CONFIG: Record<string, { color: string; label: string }> = {
  high: { color: "bg-red-50 border-red-200 text-red-700", label: "High Severity" },
  medium: { color: "bg-yellow-50 border-yellow-200 text-yellow-700", label: "Medium Severity" },
  low: { color: "bg-green-50 border-green-200 text-green-700", label: "Low Severity" },
};

export default function PestCameraPage({ t }: { t: (k: string) => string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState("Tomato");
  const [location, setLocation] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  }

  async function handleDetect() {
    if (!preview) return;
    setLoading(true);
    try {
      const base64 = preview.split(",")[1] || preview;
      const data = await api.post<PestResult>("/pest/detect", { imageBase64: base64.substring(0, 500), cropType, location });
      setResult(data);
    } catch { } finally { setLoading(false); }
  }

  const sev = result ? SEVERITY_CONFIG[result.severity] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Bug className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">AI Pest Detection</h1>
        </div>
        <p className="text-red-100">Capture or upload a crop image to instantly detect pests and get treatment recommendations.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload area */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-4">Capture Crop Image</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400">
                  {CROP_TYPES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nashik" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400" />
              </div>
            </div>

            {/* Upload zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${preview ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50"}`}>
              {preview ? (
                <div>
                  <img src={preview} alt="Crop" className="max-h-48 mx-auto rounded-xl object-cover mb-3" />
                  <p className="text-sm text-green-600 font-medium">✓ Image ready for analysis</p>
                  <p className="text-xs text-gray-400 mt-1">Click to choose a different image</p>
                </div>
              ) : (
                <div>
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-600 mb-1">Click to capture or upload</p>
                  <p className="text-sm text-gray-400">Supports camera capture on mobile</p>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

            <div className="flex gap-3 mt-4">
              <button onClick={() => { const i = document.createElement("input"); i.type="file"; i.accept="image/*"; i.capture="environment"; i.onchange=(e:any) => { const f = e.target?.files?.[0]; if(f) { const r = new FileReader(); r.onload = (ev) => { setPreview(ev.target?.result as string); setResult(null); }; r.readAsDataURL(f); }}; i.click(); }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                <Camera className="w-4 h-4" /> Use Camera
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" /> Upload Image
              </button>
            </div>

            <button onClick={handleDetect} disabled={!preview || loading}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-40">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Analyzing...</> : <><Bug className="w-5 h-5" />{t("detect_pest")}</>}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <h3 className="font-semibold text-yellow-800 mb-2">📸 Photography Tips</h3>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Capture the affected leaves/stem in clear focus</li>
              <li>• Use natural daylight for best results</li>
              <li>• Show the pest if visible in the frame</li>
              <li>• Avoid blurry or dark images</li>
              <li>• Include both healthy and affected plant parts</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center">
              <Bug className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Detection results will appear here</p>
              <p className="text-sm text-gray-400 mt-1">Upload a crop image to begin analysis</p>
            </div>
          )}
          {loading && (
            <div className="bg-gray-50 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Analyzing image...</p>
              <p className="text-sm text-gray-400 mt-1">AI is detecting pests and diseases</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              {/* Pest identified */}
              <div className={`rounded-2xl p-6 border ${sev?.color}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium opacity-70">Detected Pest</p>
                    <h3 className="text-2xl font-bold">{result.detectedPest}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70 mb-1">Confidence</p>
                    <p className="text-2xl font-bold">{result.confidence}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium"><AlertTriangle className="w-4 h-4" />{sev?.label}</span>
                  <span className="text-xs opacity-60">Scan ID: #{result.scanId}</span>
                </div>
                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div className="bg-current h-2 rounded-full" style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>
              </div>

              {/* Organic Treatment */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">🌿 Organic Treatment</h4>
                <ul className="space-y-2">
                  {result.organicTreatment.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">⚗️ Chemical Treatment</h4>
                <ul className="space-y-2">
                  {result.chemicalTreatment.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-bold text-orange-700 mb-3 flex items-center gap-2">🛡️ Prevention Tips</h4>
                <ul className="space-y-2">
                  {result.preventionTips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
