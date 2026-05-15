import { ArrowLeft, MoreVertical, Sparkles, Mic, Send, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";

const LANG_MAP: Record<string, string> = {
  'en': 'en-US',
  'hi': 'hi-IN',
  'mr': 'mr-IN',
  'ta': 'ta-IN',
  'te': 'te-IN',
  'ml': 'ml-IN',
  'kn': 'kn-IN',
  'bn': 'bn-IN',
  'gu': 'gu-IN',
  'pa': 'pa-IN',
  'ur': 'ur-PK'
};

export default function NovaChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [pet, setPet] = useState<any>({ name: 'Assistant', role: 'Virtual Companion' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en');
  const [lastDetectedLangCode, setLastDetectedLangCode] = useState('en');
  const [speakingText, setSpeakingText] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const chatRef = useRef<any>(null);

  const [messages, setMessages] = useState<{ id: string, text: string, sender: 'Assistant' | 'You', isTyping?: boolean, lang?: string }[]>(() => {
    try {
      const saved = localStorage.getItem('chatMessages');
      return saved ? JSON.parse(saved) : [
        { id: '1', text: "Hello! ✨ I'm your Virtual Companion. I'm here to support your journey and help you stay focused on your goals. How are you feeling today?", sender: 'Assistant' }
      ];
    } catch (e) {
      return [{ id: '1', text: "Hello! ✨ I'm ready to help you.", sender: 'Assistant' }];
    }
  });

  useEffect(() => {
    const toSave = messages.filter(m => !m.isTyping);
    localStorage.setItem('chatMessages', JSON.stringify(toSave));
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition || 
                            (window as any).mozSpeechRecognition || 
                            (window as any).msSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
    }

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) setVoices(v);
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const primeVoice = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      setIsAudioUnlocked(true);
    }
  };

  const createRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                            (window as any).webkitSpeechRecognition || 
                            (window as any).mozSpeechRecognition || 
                            (window as any).msSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = false; // Stop listening once a phrase is finished
    rec.interimResults = true; // Show live results while speaking
    rec.lang = LANG_MAP[detectedLang] || 'en-US'; // Dynamic language support

    rec.onstart = () => {
      setIsRecording(true);
      primeVoice();
    };

    rec.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => (result as any)[0].transcript)
        .join('');
      setLastTranscript(transcript); // Updates the UI with what you're saying
      
      if (event.results[0].isFinal) {
        handleSend(transcript); // Automatically sends to AI once you stop talking
      }
    };

    rec.onend = () => {
      setIsRecording(false);
      setLastTranscript('');
    };

    return rec;
  }, [pet, detectedLang]);

  const startRecording = (e?: any) => {
    e?.preventDefault();
    if (isRecording) {
      stopRecording();
      return;
    }
    
    if (!isSpeechSupported) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "Oops, your browser doesn't support voice sync yet! 🥺", sender: 'Assistant' }]);
      return;
    }

    const rec = createRecognition();
    if (rec) {
      recognitionRef.current = rec;
      rec.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const speak = (text: string, langCode?: string) => {
    if (isSilentMode) return;
    
    // Stop any existing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      setIsSpeaking(true);
      setSpeakingText(text);

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Dynamic Voice Selection
        const currentLangCode = langCode ? (LANG_MAP[langCode] || langCode) : (LANG_MAP[detectedLang] || detectedLang);
        utterance.lang = currentLangCode;

        // Try to find a high quality Google voice for the specific language
        const availableVoices = window.speechSynthesis.getVoices();
        const googleVoice = availableVoices.find(v => 
          v.lang.startsWith(currentLangCode.split('-')[0]) && 
          (v.name.includes('Google') || v.name.includes('Natural'))
        );

        if (googleVoice) {
          utterance.voice = googleVoice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingText('');
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setSpeakingText('');
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Speech Error:", error);
      setIsSpeaking(false);
      setSpeakingText('');
    }
  };

  useEffect(() => {
    try {
      const savedAssistant = JSON.parse(localStorage.getItem('userAssistant') || '{}');
      if (savedAssistant.name) {
        setPet(savedAssistant);
        if (!localStorage.getItem('chatMessages')) {
          setMessages([{ id: '1', text: `Hello! ✨ I'm your ${savedAssistant.role || 'Virtual Companion'}. I'm here to support your journey and help you stay focused. How are you feeling today?`, sender: 'Assistant' }]);
        }
      }
    } catch (e) {
      console.error("Error loading assistant", e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setMessage('');
    
    // Stop existing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), text: userMessage, sender: 'You', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    
    // Add typing indicator
    setMessages(prev => [...prev, { id: 'typing', text: "...", sender: 'Assistant', isTyping: true }]);
    
    try {
      const history = (messages || [])
        .filter(m => !m.isTyping)
        .slice(-8) // Last 8 messages for context
        .map(m => ({
          role: m.sender === 'You' ? 'user' : 'assistant',
          content: m.text
        }));

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing or invalid. Please check your Settings > Secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey });

      let subList = 'None';
      try {
        const subs = JSON.parse(localStorage.getItem('studySubmissions') || '[]');
        subList = subs.filter((s: any) => !s.completed)
                      .map((s: any) => `${s.title} (Due: ${s.dueDate})`)
                      .join(', ');
      } catch (e) {
        console.error("Error reading submissions", e);
      }

      const systemPrompt = `You are Nova, an empathetic and organized virtual companion.
      Persona: ${pet.personality || 'Kind and helpful'}.
      Missions: ${subList}.
      Task: Support the user's emotional and academic life.
      Language: Respond in the user's detected language.
      Output Format: JSON with "text" (string) and "lang" (ISO code).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              lang: { type: Type.STRING }
            },
            required: ["text", "lang"]
          }
        }
      });

      const responseData = JSON.parse(response.text || "{}");
      const responseText = responseData.text;
      const langCode = responseData.lang || 'en';
      
      // Update detected language
      if (LANG_MAP[langCode]) {
        setDetectedLang(langCode);
        setLastDetectedLangCode(langCode);
        if (recognitionRef.current) {
          recognitionRef.current.lang = LANG_MAP[langCode];
        }
      }

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, { id: Date.now().toString(), text: responseText, sender: 'Assistant', lang: langCode, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      });
      
      setTimeout(() => speak(responseText, langCode), 400);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const isQuotaError = error.message?.includes('429');
      const isAuthError = error.message?.includes('API Key') || error.message?.includes('401') || error.message?.includes('403');
      
      let errorText = "I'm having a connection glitch. Could you try saying that again?";
      if (isQuotaError) errorText = "I'm a bit overwhelmed right now! 😅 Can we talk again in a minute?";
      if (isAuthError) errorText = "My AI circuits are disconnected! 🔌 (API Key issue detected). Check your Settings > Secrets.";
        
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        return [...filtered, { id: Date.now().toString(), text: errorText, sender: 'Assistant' }];
      });
      speak(errorText);
    }
  };

  const toggleSilentMode = () => {
    setIsSilentMode(!isSilentMode);
    if (!isSilentMode && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const renderPetAvatar = (size: 'sm' | 'lg' = 'sm') => {
    if (pet.avatar && pet.avatar.type === 'human') {
      const { skinTone, hairColor, hairStyle, outfitColor, expression, accessory } = pet.avatar;
      
      const headSize = size === 'lg' ? 'w-24 h-24' : 'w-10 h-10';
      const bodyWidth = size === 'lg' ? 'w-32 h-14' : 'w-14 h-6';
      
      return (
        <div className="flex flex-col items-center">
          <div 
            className={cx("rounded-full border-2 border-white shadow-sm relative overflow-hidden", headSize)}
            style={{ backgroundColor: skinTone }}
          >
            {/* Simple face features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-1 scale-50">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-800 opacity-80" />
                <div className="w-2 h-2 rounded-full bg-slate-800 opacity-80" />
              </div>
              {expression === 'Smile' && <div className="w-8 h-4 border-b-2 border-slate-800 rounded-full" />}
              {expression === 'Think' && <div className="w-6 h-1 bg-slate-800 rounded-full" />}
              {expression === 'Focus' && <div className="w-4 h-4 border-2 border-slate-800 rounded-full" />}
              {expression === 'Neutral' && <div className="w-6 h-0.5 bg-slate-800 rounded-full opacity-50" />}
            </div>

            <div className="absolute -top-1 -inset-x-0.5 flex justify-center">
               {hairStyle === 'Short' && <div className="w-full h-1/2 rounded-t-full" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Long' && <div className="w-full h-full rounded-b-lg -mt-1" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Curly' && <div className="w-[110%] h-[60%] rounded-full opacity-80" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Ponytail' && <div className="w-full h-1/2 rounded-t-full relative" style={{ backgroundColor: hairColor }}><div className="absolute top-1 right-0 w-4 h-6 rounded-full" style={{ backgroundColor: hairColor }} /></div>}
            </div>
            {accessory === 'Glasses' && <div className="absolute top-[40%] inset-x-2 h-2 border-y-[1px] border-slate-800/20" />}
          </div>
          <div 
            className={cx("rounded-t-full mt-[-8px]", bodyWidth)}
            style={{ backgroundColor: outfitColor }}
          />
        </div>
      );
    }
    
    return (
      <motion.div 
         animate={isSpeaking ? { scale: [1, 1.1, 1], rotate: [-2, 2, -2] } : {}}
         transition={{ repeat: Infinity, duration: 1 }}
         className={cx("filter drop-shadow-lg", size === 'lg' ? "text-6xl" : "text-3xl")}
      >
        {pet.emoji}
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-6 bg-white/80 backdrop-blur-md border-b border-orange-50 z-30 sticky top-0">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 active:scale-95 transition-all cursor-pointer hover:bg-slate-50">
          <ArrowLeft size={18} />
        </button>
        
        <div className="flex flex-col items-center">
            {renderPetAvatar('sm')}
            <div className="flex items-center gap-1.5 justify-center mt-1">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 hover:bg-slate-50 px-2 py-0.5 rounded-full transition-colors"
              >
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{pet?.name}</span>
                <AnimatePresence>
                  {lastDetectedLangCode !== 'en' && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-indigo-100 text-indigo-600 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1"
                    >
                      <Sparkles size={8} />
                      {lastDetectedLangCode.toUpperCase()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            {isSpeaking && (
               <div className="flex gap-0.5 mt-1">
                 {[...Array(3)].map((_, i) => (
                   <motion.div
                     key={i}
                     animate={{ height: [2, 6, 2] }}
                     transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                     className="w-0.5 bg-orange-400 rounded-full"
                   />
                 ))}
               </div>
            )}
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 grid grid-cols-2 gap-1 w-48"
                >
              {Object.entries(LANG_MAP).map(([code]) => (
                <button
                  key={code}
                  onClick={() => {
                    setDetectedLang(code);
                    setLastDetectedLangCode(code);
                    setShowLangMenu(false);
                  }}
                  className={cx(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    detectedLang === code ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-50 text-slate-400"
                  )}
                >
                  {code}
                </button>
              ))}
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        <button 
          onClick={() => {
            if (!isAudioUnlocked) {
              primeVoice();
            } else {
              toggleSilentMode();
            }
          }}
          className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center active:scale-95 transition-all cursor-pointer hover:bg-slate-50 relative"
        >
          {isSilentMode ? <VolumeX size={18} className="text-slate-300" /> : <Volume2 size={18} className={cx(isAudioUnlocked ? "text-orange-500" : "text-slate-400 animate-pulse")} />}
          {!isAudioUnlocked && !isSilentMode && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
          )}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pt-24 pb-32 flex flex-col gap-6 no-scrollbar relative z-10">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id} 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cx("flex flex-col gap-1 w-full max-w-[85%]", msg.sender === 'You' ? "self-end items-end" : "self-start")}
          >
            <div className={cx(
              "p-5 text-[13px] font-bold tracking-tight shadow-sm leading-relaxed flex flex-col gap-2 whitespace-pre-wrap",
              msg.sender === 'Assistant' 
                ? "bg-white border-2 border-orange-100 text-slate-800 rounded-[1.8rem] rounded-tl-lg shadow-orange-50/50" 
                : "bg-slate-900 text-white rounded-[1.8rem] rounded-tr-lg shadow-indigo-100/50"
            )}>
              {msg.isTyping ? (
                 <div className="flex gap-1 items-center h-2 py-1">
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-orange-300 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-orange-300 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-orange-300 rounded-full" />
                 </div>
              ) : (
                <>
                  {msg.text}
                  {msg.timestamp && (
                    <span className={cx(
                      "text-[9px] font-medium opacity-50 mt-1 self-end",
                      msg.sender === 'Assistant' ? "text-slate-400" : "text-white/60"
                    )}>
                      {msg.timestamp}
                    </span>
                  )}
                </>
              )}
            </div>
            <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest px-2 mt-0.5">
              {msg.sender === 'Assistant' ? pet.name : 'You'}
            </span>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Live Captions */}
      <AnimatePresence>
        {isSpeaking && speakingText && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-32 left-6 right-6 z-50 pointer-events-none"
          >
            <div className="bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-center">
              <p className="text-xs font-bold leading-relaxed">{speakingText}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [2, 8, 2] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <div className="px-6 pb-10 pt-4 bg-white/80 backdrop-blur-xl border-t border-orange-50 z-40 flex flex-col items-center">
        {/* Dynamic Waveform when recording */}
        <AnimatePresence>
          {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center gap-4 mb-6 w-full max-w-sm"
          >
            <div className="bg-slate-900 border border-white/10 text-white/90 p-4 rounded-2xl shadow-xl w-full text-center">
              <p className="text-[13px] font-bold leading-relaxed italic">
                {lastTranscript || "Say something..."}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-red-50/80 px-6 py-3 rounded-full border border-red-100 shadow-sm">
              <div className="flex items-end gap-1 h-6 px-2">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 20, 6, 24, 4].map(v => (v * (0.5 + Math.random()))) }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    className="w-1 bg-[#FF6B6B] rounded-full"
                  />
                ))}
              </div>
              <span className="text-red-500 font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                Auto-Detecting {detectedLang.toUpperCase()}...
              </span>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        <div className="w-full flex items-center gap-3 bg-[#FFF9F2] border-2 border-orange-100 rounded-[2rem] p-2 shadow-inner group focus-within:border-orange-200 transition-all">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(message);
            }}
            placeholder={isRecording ? "Listening..." : detectedLang === 'hi' ? "Kuch likho..." : detectedLang === 'te' ? "ఏదైనా వ్రాయండి..." : "Message your Orb..."}
            className="bg-transparent border-none outline-none flex-1 pl-4 font-bold text-slate-800 placeholder-slate-400 text-[13px]"
            disabled={isRecording}
          />
          
          <div className="flex items-center gap-2 pr-1">
            <button 
              onMouseDown={(e) => { e.preventDefault(); startRecording(); }}
              onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
              className={cx(
                "w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm active:scale-95",
                isRecording ? "bg-red-500 text-white shadow-red-200" : "bg-white text-slate-400 border border-slate-100"
              )}
            >
              <Mic size={18} className={isRecording ? "animate-pulse" : ""} />
            </button>

            <button 
              onClick={() => handleSend(message)}
              disabled={!message.trim() || isRecording}
              className={cx(
                "w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-slate-900 shadow-sm active:scale-95 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed",
                message.trim() && !isRecording ? "text-white" : "text-slate-500"
              )}
            >
               <Send size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-2.5 w-full overflow-x-auto no-scrollbar pt-6 shrink-0 justify-center">
          {["Feeling stuck", "I'm proud of...", "Motivation?"].map(s => (
            <button 
              key={s}
              onClick={() => handleSend(s)}
              className="bg-white border border-slate-100 text-slate-500 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-orange-200 active:scale-95 transition-all whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,107,107,0.1)_0,transparent_70%)]"
        />
      </div>
    </div>
  );
}

function cx(...args: (string | undefined | null | false)[]) {
  return args.filter(Boolean).join(' ');
}
