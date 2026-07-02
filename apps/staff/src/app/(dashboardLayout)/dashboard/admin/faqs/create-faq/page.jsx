"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { 
  HelpCircle, ChevronDown, Check, Loader2, Sparkles, 
  Eye, FileText, ChevronUp, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

// Color mapper for FAQ categories in preview
const getCategoryBadgeStyles = (categoryName) => {
  const styles = [
    { bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { bg: "bg-amber-50 text-amber-700 border-amber-100" },
    { bg: "bg-sky-50 text-sky-700 border-sky-100" },
    { bg: "bg-rose-50 text-rose-700 border-rose-100" },
  ];
  if (!categoryName) return styles[0];
  const hash = categoryName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return styles[hash % styles.length];
};

const CreateFaq = () => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [cat, setCat] = useState("")
  const [category, setCategory] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(true) // Live accordion toggle state

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${API_BASE}/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.reverse()))
      .catch((err) => console.error("Error fetching categories:", err))
  }, [API_BASE])

  const handleCreateFaq = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question title")
      return
    }
    if (!cat) {
      toast.error("Please select a category")
      return
    }
    if (!answer.trim()) {
      toast.error("Please enter the answer")
      return
    }

    const data = {
      question: question.trim(),
      answer: answer.trim(),
      category: cat
    }

    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/faq`, data)
      if (response.status === 200 || response.status === 201) {
        toast.success("FAQ created successfully!")
        setQuestion("")
        setAnswer("")
        setCat("")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to create FAQ. Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5";

  const faqCategories = category[0]?.FAQ || [];
  const badgeStyle = getCategoryBadgeStyles(cat).bg;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-8 h-8 text-emerald-600 animate-pulse" />
          Create FAQ
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Compose Frequently Asked Questions to support learners and website visitors.
        </p>
      </div>

      {/* ── Split Panel Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          
          {/* Question / Title */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Question Title *</label>
              <span className={`text-[10px] font-bold ${question.length > 100 ? 'text-amber-500' : 'text-slate-400'}`}>
                {question.length} / 100 chars
              </span>
            </div>
            <input
              type="text"
              placeholder="e.g. Can I change my class schedule?"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 120))}
              className={inputStyles}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className={labelStyles}>Category / Tag *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className={cat ? "text-slate-800 font-semibold truncate" : "text-slate-400 truncate"}>
                  {cat || "Select category location"}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute z-40 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1.5 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                    {faqCategories.length > 0 ? (
                      faqCategories.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCat(option.category);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${
                            cat === option.category ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                          }`}
                        >
                          <span className="truncate">{option.category}</span>
                          {cat === option.category && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">No FAQ categories found</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Answer Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Answer *</label>
              <span className="text-[10px] font-bold text-slate-400">
                {answer.length} characters
              </span>
            </div>
            <textarea
              placeholder="Write a clear, structured response..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              className={`${inputStyles} resize-none`}
            />
          </div>

          {/* Tips box */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 text-slate-600 text-xs">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-700">Writing Tip</p>
              <p className="mt-0.5 leading-relaxed">
                Aim to keep questions under 100 characters. Use lists or paragraphs in the answer to make it easy for students to scan.
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCreateFaq}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/15 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish FAQ"
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Interactive Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              Live Landing Preview
            </h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Interactive
            </span>
          </div>

          {/* Accordion Card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
            
            {/* Header / Click trigger */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-2 flex-1 min-w-0">
                {/* Category tag */}
                <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${badgeStyle}`}>
                  {cat || "CATEGORY TAG"}
                </span>
                
                {/* Question */}
                <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug break-words">
                  {question.trim() || "Your question title will appear here..."}
                </h4>
              </div>

              {/* Arrow */}
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 mt-0.5">
                {isPreviewOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {/* Answer body */}
            <div className={`overflow-hidden transition-all duration-300 border-slate-50 ${
              isPreviewOpen ? 'max-h-[300px] border-t p-5' : 'max-h-0'
            }`}>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                {answer.trim() || "Your detailed answer response will be rendered here. Click the header to collapse/expand this preview card."}
              </p>
            </div>

          </div>

          {/* Extra motivation block */}
          <div className="border border-dashed border-slate-200 rounded-2xl p-5 text-center text-slate-400 space-y-1">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto animate-spin" style={{ animationDuration: '4s' }} />
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Real-time Rendering</p>
            <p className="text-[10px] leading-relaxed max-w-xs mx-auto">
              Preview matches exactly how students view questions in the support section.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateFaq
