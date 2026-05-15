import { ArrowLeft, Sparkles, Check, ChevronRight, ChevronLeft, Palette, Shirt, User, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SKIN_TONES = ['#FFE0BD', '#FFCD94', '#EAC08A', '#D5A6BD', '#956C5A', '#6B4C41', '#452F28'];
const HAIR_COLORS = ['#000000', '#4B2C20', '#7B3F00', '#D4AF37', '#F5F5DC', '#B22222', '#800080', '#FF69B4'];
const OUTFIT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#000000', '#FFFFFF'];

const FEATURES = {
  hairstyles: ['Short', 'Long', 'Curly', 'Bald', 'Spiky', 'Ponytail', 'Bun', 'Mohawk', 'Pigtails', 'Braids', 'Wavy'],
  expressions: ['Neutral', 'Focus', 'Smile', 'Think', 'Wink', 'Cool', 'Happy', 'Blush'],
  accessories: ['None', 'Glasses', 'Mask', 'Headphones', 'Hat', 'Crown', 'Ribbon', 'Earrings'],
  personalityTraits: [
    { label: 'Empathetic', value: 'Kind, understanding, and emotionally supportive' },
    { label: 'Strict', value: 'Disciplined, focused on efficiency, and highly organized' },
    { label: 'Cheerful', value: 'Upbeat, high energy, and uses lots of emojis' },
    { label: 'Sarcastic', value: 'Witty, uses dry humor, but stays focused on the goal' },
    { label: 'Academic', value: 'Professional, sophisticated language, and intellectual' },
    { label: 'Chill', value: 'Laid back, non-judgmental, and comforting' }
  ]
};

export default function HumanAvatarSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Appearance, 1: Style, 2: Accessory, 3: Personality
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [hairStyle, setHairStyle] = useState('Short');
  const [outfitColor, setOutfitColor] = useState(OUTFIT_COLORS[0]);
  const [expression, setExpression] = useState('Smile');
  const [accessory, setAccessory] = useState('None');
  const [selectedTrait, setSelectedTrait] = useState(FEATURES.personalityTraits[0]);
  const [personalityTraining, setPersonalityTraining] = useState('');

  const handleFinish = () => {
    const avatarData = {
      type: 'human',
      skinTone,
      hairColor,
      hairStyle,
      outfitColor,
      expression,
      accessory
    };
    localStorage.setItem('userAssistant', JSON.stringify({
      name: 'Nova',
      role: 'Virtual Companion',
      personality: `${selectedTrait.value}. Additional training: ${personalityTraining || 'None'}`,
      avatar: avatarData
    }));
    navigate('/hub');
  };

  const renderAvatarPreview = () => {
    // Simple human shape without emoji
    return (
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-linear-to-tr from-indigo-400 to-slate-400 blur-[80px] rounded-full opacity-30"
        />
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Head */}
          <div 
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl relative overflow-hidden"
            style={{ backgroundColor: skinTone }}
          >
            {/* Simple face features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-4">
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-80" />
              </div>
              {expression === 'Smile' && <div className="w-8 h-4 border-b-2 border-slate-800 rounded-full" />}
              {expression === 'Think' && <div className="w-6 h-1 bg-slate-800 rounded-full" />}
              {expression === 'Focus' && <div className="w-4 h-4 border-2 border-slate-800 rounded-full" />}
              {expression === 'Neutral' && <div className="w-6 h-0.5 bg-slate-800 rounded-full opacity-50" />}
              {expression === 'Wink' && (
                <div className="flex items-center gap-4">
                  <div className="w-8 h-4 border-b-2 border-slate-800 rounded-full mt-2" />
                </div>
              )}
            </div>

            {/* Hair */}
            <div className="absolute top-0 inset-x-0 flex justify-center">
              {hairStyle === 'Short' && <div className="w-full h-8 rounded-t-full" style={{ backgroundColor: hairColor }} />}
              {hairStyle === 'Long' && <div className="w-full h-full -mt-2 rounded-b-xl" style={{ backgroundColor: hairColor }} />}
              {hairStyle === 'Curly' && <div className="w-[120%] h-12 -ml-[10%] rounded-full opacity-90" style={{ backgroundColor: hairColor }} />}
              {hairStyle === 'Ponytail' && <div className="w-full h-8 rounded-t-full relative" style={{ backgroundColor: hairColor }}><div className="absolute top-4 right-0 w-8 h-12 rounded-full skew-x-12" style={{ backgroundColor: hairColor }} /></div>}
              {hairStyle === 'Bun' && <div className="w-12 h-12 rounded-full absolute -top-4 left-1/2 -translate-x-1/2" style={{ backgroundColor: hairColor }} />}
              {hairStyle === 'Pigtails' && (
                <>
                  <div className="w-8 h-8 rounded-full absolute -left-2 top-4" style={{ backgroundColor: hairColor }} />
                  <div className="w-8 h-8 rounded-full absolute -right-2 top-4" style={{ backgroundColor: hairColor }} />
                </>
              )}
            </div>
            
            {/* Accessories */}
            {accessory === 'Glasses' && <div className="absolute top-10 inset-x-4 h-6 border-y-2 border-slate-800/20" />}
            {accessory === 'Headphones' && <div className="absolute inset-0 border-x-8 rounded-full border-slate-900/30" />}
            {accessory === 'Hat' && <div className="absolute -top-1 inset-x-0 h-4 bg-slate-900/20 rounded-t-full" />}
          </div>
          
          {/* Outfit */}
          <div 
            className="w-32 h-20 rounded-t-[3rem] border-4 border-white shadow-lg mt-[-15px] relative z-0"
            style={{ backgroundColor: outfitColor }}
          />
        </div>
      </div>
    );
  };

  const steps = [
    { title: 'Appearance', icon: <User size={18} /> },
    { title: 'The Style', icon: <Palette size={18} /> },
    { title: 'Accessory', icon: <Shirt size={18} /> },
    { title: 'Personality', icon: <Sparkles size={18} /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-center z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm transition-transform active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex bg-white rounded-2xl p-1 shadow-sm gap-1">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${step === i ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              onClick={() => setStep(i)}
            >
              {s.icon}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-8">
          {renderAvatarPreview()}
        </div>

        <div className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Virtual Companion Setup</h1>
            <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-1">{steps[step].title}</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 h-[280px] overflow-y-auto no-scrollbar">
             {step === 0 && (
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Skin Tone</p>
                   <div className="flex flex-wrap gap-3">
                     {SKIN_TONES.map(color => (
                       <button
                         key={color}
                         onClick={() => setSkinTone(color)}
                         className={`w-10 h-10 rounded-full border-2 transition-all ${skinTone === color ? 'border-indigo-500 scale-110 shadow-md' : 'border-transparent'}`}
                         style={{ backgroundColor: color }}
                       />
                     ))}
                   </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hair Style</p>
                    <div className="flex flex-wrap gap-2">
                       {FEATURES.hairstyles.map(style => (
                         <button
                           key={style}
                           onClick={() => setHairStyle(style)}
                           className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all ${hairStyle === style ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                         >
                           {style}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Hair Color</p>
                    <div className="flex flex-wrap gap-3">
                      {HAIR_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setHairColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${hairColor === color ? 'border-indigo-500 scale-110 shadow-md' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                 </div>
               </div>
             )}

             {step === 1 && (
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Outfit Color</p>
                   <div className="flex flex-wrap gap-3">
                     {OUTFIT_COLORS.map(color => (
                       <button
                         key={color}
                         onClick={() => setOutfitColor(color)}
                         className={`w-10 h-10 rounded-full border-2 transition-all ${outfitColor === color ? 'border-indigo-500 scale-110 shadow-md' : 'border-transparent'}`}
                         style={{ backgroundColor: color }}
                       />
                     ))}
                   </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Facial Expression</p>
                    <div className="flex flex-wrap gap-2">
                       {FEATURES.expressions.map(exp => (
                         <button
                           key={exp}
                           onClick={() => setExpression(exp)}
                           className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all ${expression === exp ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                         >
                           {exp}
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Extras</p>
                   <div className="flex flex-wrap gap-2">
                      {FEATURES.accessories.map(acc => (
                        <button
                          key={acc}
                          onClick={() => setAccessory(acc)}
                          className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all ${accessory === acc ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                        >
                          {acc}
                        </button>
                      ))}
                   </div>
                 </div>
               </div>
             )}

             {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Personality</p>
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURES.personalityTraits.map(trait => (
                        <button
                          key={trait.label}
                          onClick={() => setSelectedTrait(trait)}
                          className={cx(
                            "p-3 rounded-2xl text-left border-2 transition-all",
                            selectedTrait.label === trait.label 
                              ? "bg-indigo-50 border-indigo-200" 
                              : "bg-white border-slate-100"
                          )}
                        >
                          <div className={cx(
                            "text-[10px] font-black uppercase tracking-widest",
                            selectedTrait.label === trait.label ? "text-indigo-600" : "text-slate-400"
                          )}>
                            {trait.label}
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1 line-clamp-2">
                            {trait.value}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Custom Training</p>
                    <textarea 
                      value={personalityTraining}
                      onChange={(e) => setPersonalityTraining(e.target.value)}
                      placeholder="e.g., 'remind me of my goals', 'be like a strict mentor', 'always use my name'..."
                      className="w-full h-24 bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 placeholder-slate-300 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                    />
                  </div>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="p-8 pb-12 flex gap-4">
        {step < 3 ? (
          <button
            onClick={() => setStep(prev => prev + 1)}
            className="flex-1 bg-white border-4 border-indigo-50 text-slate-800 font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Next Stage</span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-xl hover:bg-indigo-700"
          >
            <span>Train AI & Finish</span>
            <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

function cx(...args: (string | undefined | null | false)[]) {
  return args.filter(Boolean).join(' ');
}
