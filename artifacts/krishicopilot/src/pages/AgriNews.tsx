import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Newspaper, ExternalLink, Loader2, CheckCircle } from "lucide-react";

interface Article { id: number; title: string; description: string; source: string; date: string; category: string; imageUrl?: string; url?: string; }
interface Scheme { id: number; name: string; description: string; benefit: string; eligibility: string; applicationUrl: string; ministry: string; category: string; }

const CAT_COLORS: Record<string, string> = { "Income Support": "bg-green-100 text-green-700", "Crop Insurance": "bg-blue-100 text-blue-700", "Soil Health": "bg-brown-100 text-yellow-800 bg-yellow-100", "Credit": "bg-purple-100 text-purple-700", "Marketing": "bg-orange-100 text-orange-700", "Irrigation": "bg-cyan-100 text-cyan-700", "Horticulture": "bg-teal-100 text-teal-700", "Organic Farming": "bg-emerald-100 text-emerald-700" };

export default function AgriNewsPage({ t }: { t: (k: string) => string }) {
  const [news, setNews] = useState<Article[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"news" | "schemes">("news");

  useEffect(() => {
    api.get<{ news: Article[]; schemes: Scheme[] }>("/news").then((d) => { setNews(d.news); setSchemes(d.schemes); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Newspaper className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">Agri News & Government Schemes</h1>
        </div>
        <p className="text-indigo-100">Stay updated with latest agriculture news and farmer welfare schemes.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        {[["news", "📰 Agriculture News"], ["schemes", "🏛️ Government Schemes"]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab as "news" | "schemes")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? "bg-white text-indigo-700 shadow-sm" : "text-gray-600 hover:text-indigo-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-indigo-600"><Loader2 className="w-6 h-6 animate-spin inline mr-2" />Loading...</div>
      ) : activeTab === "news" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {news.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden feature-card-hover">
              {article.imageUrl && (
                <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{article.source}</span>
                  <span className="text-xs text-gray-400">{new Date(article.date).toLocaleDateString("en-IN")}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-3 mb-4">{article.description}</p>
                <a href={article.url || "#"} className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:text-indigo-700">
                  Read More <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden feature-card-hover">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CAT_COLORS[scheme.category] || "bg-gray-100 text-gray-700"}`}>{scheme.category}</span>
                <h3 className="font-bold text-gray-900 mt-3 text-lg">{scheme.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{scheme.ministry}</p>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Benefit</p>
                    <p className="text-sm text-green-800">{scheme.benefit}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-700 mb-1">Eligibility</p>
                    <p className="text-xs text-blue-800">{scheme.eligibility}</p>
                  </div>
                </div>
                <a href={scheme.applicationUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors w-full">
                  {t("apply_now")} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
