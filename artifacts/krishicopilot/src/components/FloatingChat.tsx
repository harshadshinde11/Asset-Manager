import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot } from "lucide-react";
import { api } from "@/lib/api";

interface Message { role: "user" | "bot"; text: string; }

export default function FloatingChat({ t }: { t: (k: string) => string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "🙏 Namaste! I'm KrishiBot. Ask me about crops, weather, pests, market prices, or any farming question!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState(["Best crops for kharif season?", "How to control aphids?", "Check wheat prices", "Government schemes"]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await api.post<{ response: string }>("/chatbot/message", { message: msg, session_id: "floating" });
      setMessages((m) => [...m, { role: "bot", text: res.response }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally { setLoading(false); }
  }

  function clearChat() {
    setMessages([{ role: "bot", text: "🙏 Namaste! I'm KrishiBot. Ask me about crops, weather, pests, or farming!" }]);
    api.delete("/chatbot/history?session_id=floating").catch(() => {});
  }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-green-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center">
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden" style={{ maxHeight: "500px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">KrishiBot</p>
                <p className="text-green-200 text-xs">Your Farming Assistant</p>
              </div>
            </div>
            <button onClick={clearChat} className="text-green-200 hover:text-white transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50" style={{ minHeight: "250px", maxHeight: "300px" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot shadow-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot shadow-sm px-3 py-2">
                  <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1 overflow-x-auto">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="shrink-0 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about farming..."
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200" />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 disabled:opacity-40 transition-colors">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
