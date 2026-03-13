import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Send, Trash2, Bot, User, Loader2 } from "lucide-react";

interface Message { id: number; role: "user" | "bot"; text: string; }

const SUGGESTIONS = ["Best crops for kharif?", "How to control aphids organically?", "Today's wheat price?", "PM Kisan scheme details", "Drip vs flood irrigation", "Soil testing tips"];

export default function ChatbotPage({ t }: { t: (k: string) => string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: "🙏 Namaste! I'm KrishiBot, your intelligent farming assistant!\n\nI can help you with:\n• 🌾 Crop recommendations\n• 🌦️ Weather advice\n• 🐛 Pest & disease control\n• 📊 Market prices\n• 🌱 Fertilizer guidance\n• 🏛️ Government schemes\n\nWhat would you like to know today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextId, setNextId] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg: Message = { id: nextId, role: "user", text: msg };
    setNextId((n) => n + 2);
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await api.post<{ response: string; suggestions?: string[] }>("/chatbot/message", { message: msg, session_id: "main" });
      setMessages((m) => [...m, { id: nextId + 1, role: "bot", text: res.response }]);
    } catch {
      setMessages((m) => [...m, { id: nextId + 1, role: "bot", text: "Sorry, I couldn't connect. Please check your internet and try again." }]);
    } finally { setLoading(false); }
  }

  async function clearChat() {
    setMessages([{ id: 0, role: "bot", text: "🙏 Chat cleared. How can I help you with farming today?" }]);
    setNextId(1);
    try { await api.delete("/chatbot/history?session_id=main"); } catch { }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-3xl p-6 mb-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">KrishiBot</h1>
            <p className="text-green-200 text-sm">Your AI Farming Assistant • Available 24/7</p>
          </div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-sm">
          <Trash2 className="w-4 h-4" /> {t("clear")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Messages */}
        <div className="h-[450px] overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
              {m.role === "bot" && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-green-700" />
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-green-700" /></div>
              <div className="chat-bubble-bot px-4 py-3">
                <span className="flex gap-1 items-center">
                  {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                  <span className="text-xs text-gray-400 ml-1">KrishiBot is thinking...</span>
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-4 bg-white border-t border-gray-100 flex gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about crops, weather, pests, market prices..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 text-sm" />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 disabled:opacity-40 transition-colors shrink-0">
            {loading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Send className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
