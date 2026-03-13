import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, Globe } from "lucide-react";
import { api } from "@/lib/api";

const VOICE_LANGS = [
  { code: "hi-IN", label: "हिन्दी", name: "Hindi" },
  { code: "mr-IN", label: "मराठी", name: "Marathi" },
  { code: "en-US", label: "English", name: "English" },
  { code: "ta-IN", label: "தமிழ்", name: "Tamil" },
  { code: "ml-IN", label: "മലയാളം", name: "Malayalam" },
  { code: "kn-IN", label: "ಕನ್ನಡ", name: "Kannada" },
  { code: "te-IN", label: "తెలుగు", name: "Telugu" },
  { code: "bn-IN", label: "বাংলা", name: "Bengali" },
];

interface Message { role: "user" | "bot"; text: string; }

export default function VoiceAssistantPage({ t }: { t: (k: string) => string }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [langCode, setLangCode] = useState("hi-IN");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setSupported(false);
    }
    synthRef.current = window.speechSynthesis;
  }, []);

  function startListening() {
    if (!supported) return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.lang = langCode;
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = Array.from(e.results).map((r) => r[0].transcript).join("");
      setTranscript(text);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
    setTranscript("");
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function speakText(text: string) {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    synthRef.current.speak(utterance);
  }

  async function sendToBot() {
    if (!transcript.trim()) return;
    const msg = transcript;
    setTranscript("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await api.post<{ response: string }>("/chatbot/message", { message: msg, session_id: "voice" });
      setMessages((m) => [...m, { role: "bot", text: res.response }]);
      speakText(res.response);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, couldn't connect." }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Mic className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
        </div>
        <p className="text-yellow-100">Talk to KrishiBot in your language. Speak and get farming advice by voice.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Voice Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-5">Voice Controls</h2>

          {/* Language selector */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"><Globe className="w-4 h-4" /> Language</label>
            <div className="grid grid-cols-2 gap-2">
              {VOICE_LANGS.map((l) => (
                <button key={l.code} onClick={() => setLangCode(l.code)}
                  className={`p-2.5 rounded-xl border text-sm text-left transition-colors ${langCode === l.code ? "bg-orange-50 border-orange-400 text-orange-700 font-medium" : "border-gray-200 text-gray-600 hover:border-orange-200"}`}>
                  <span className="block font-medium">{l.label}</span>
                  <span className="text-xs text-gray-400">{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mic button */}
          {!supported ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 text-sm">Voice recognition is not supported in this browser. Please use Chrome or Edge.</p>
            </div>
          ) : (
            <div className="text-center">
              <button onClick={isListening ? stopListening : startListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${isListening ? "bg-red-500 hover:bg-red-600 pulse-mic shadow-xl" : "bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl"}`}>
                {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
              </button>
              <p className="text-sm font-medium text-gray-700">{isListening ? "🔴 Listening... Speak now" : "Tap to start speaking"}</p>

              {/* Waveform */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[1,2,3,4,5,6,7].map((i) => (
                    <div key={i} className="w-2 bg-orange-400 rounded-full waveform-bar" style={{ height: "8px" }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-xs text-orange-600 mb-1 font-medium">Heard:</p>
              <p className="text-gray-800 text-sm">{transcript}</p>
              <button onClick={sendToBot} disabled={loading}
                className="mt-3 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors disabled:opacity-50 w-full justify-center">
                <Send className="w-4 h-4" /> Send to KrishiBot
              </button>
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs text-gray-500 text-center">💡 Try saying: "कपास की खेती कैसे करें?" or "What crops grow in black soil?"</p>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-800">Conversation</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: "300px", maxHeight: "400px" }}>
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Mic className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Start speaking to have a conversation</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2.5 text-sm rounded-xl whitespace-pre-wrap ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot shadow-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-bot px-3 py-2.5">
                  <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
