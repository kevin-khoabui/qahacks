// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  Send, 
  Clock, 
  AlertTriangle, 
  CreditCard,
  Building2,
  HelpCircle,
  Lightbulb,
  XCircle,
  Star,
  RefreshCcw
} from "lucide-react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({
    slug: slug,
  }));
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = PRODUCTS[slug];

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 pt-16 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <Zap className="w-3 h-3 fill-emerald-400" />
            Top-Tier QA Interview Assets
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
            {product.name}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Don't leave your next interview to chance. Master real-world scenarios and confidently conquer the toughest technical rounds with our premium guide.
          </p>
        </div>

        {/* Content & Pricing Grid */}
        <div className="grid md:grid-cols-5 gap-10">
          
          {/* Left Column: Benefits, Structure, Policy & Social Proof */}
          <div className="md:col-span-3 space-y-8">
            
            {/* Benefits Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">What's included in this pack?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  In-depth answers to {product.scenarios} real-world interview scenarios.
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  Tailored specifically for {product.level}-level {product.category} QA roles.
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  Lifetime access to our exclusive Private Telegram community.
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  Free continuous updates on the latest interview trends.
                </li>
              </ul>
            </div>

            {/* 🚀 NEW: CẤU TRÚC STAR VÀ BIG TECH */}
            <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building2 className="w-32 h-32 text-emerald-400" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400" /> Big Tech Framework
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Inside The Blueprint</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed relative z-10">
                Every scenario in this pack is strictly structured using the exact evaluation framework adopted by <strong>Google, Apple, Meta, X (Twitter), Amazon, TikTok</strong>, and <strong>QAHacks</strong> to hire top engineering talent.
              </p>
              
              <div className="space-y-4 relative z-10">
                <div className="flex gap-3 items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                  <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">The Question</h4>
                    <p className="text-xs text-slate-400 mt-1">Real-world production issues and tricky technical scenarios.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">The "Why"</h4>
                    <p className="text-xs text-slate-400 mt-1">The hidden intent behind the question. What the interviewer is <em>actually</em> looking for.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-rose-900/10 p-4 rounded-xl border border-rose-500/20">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200">Bad Answer (Red Flags)</h4>
                    <p className="text-xs text-rose-300/70 mt-1">Common amateur mistakes and generalized answers that will instantly fail candidates.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.05)]">
                  <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">Good Answer (STAR Method)</h4>
                    <p className="text-xs text-emerald-400/70 mt-1 leading-relaxed">
                      A perfectly crafted response broken down into:<br/>
                      <span className="text-emerald-200 font-semibold">S</span>ituation • <span className="text-emerald-200 font-semibold">T</span>ask • <span className="text-emerald-200 font-semibold">A</span>ction • <span className="text-emerald-200 font-semibold">R</span>esult
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 border-l-4 border-l-sky-500">
                  <RefreshCcw className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Follow-up Questions</h4>
                    <p className="text-xs text-slate-400 mt-1">Anticipated probing questions to keep you one step ahead when they try to dig deeper.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works & Policy Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
  <div className="absolute top-0 right-0 p-3 opacity-5">
    <Send className="w-32 h-32" />
  </div>
  
  <h3 className="text-xl font-bold text-white mb-6 relative z-10">Access Requirements & Policy</h3>
  
  <div className="space-y-6 relative z-10">
    {/* Step 1 */}
    <div className="flex gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-300 shrink-0">
        <CreditCard className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">1. Secure Checkout</h4>
        <p className="text-sm text-slate-400 mt-1">Complete your payment via Lemon Squeezy. Access instructions will be delivered immediately to your email.</p>
      </div>
    </div>

    {/* Step 2: ĐÃ SỬA CÓ THÊM LINK CÀI ĐẶT */}
    <div className="flex gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 shrink-0">
        <Send className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">2. Telegram Account Mandatory</h4>
        <p className="text-sm text-slate-400 mt-1">
          All premium content is hosted in a <strong>Private Telegram Channel</strong>. 
          <span className="block mt-2">
            Don't have Telegram yet? 
            <a 
              href="https://telegram.org/apps" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 border-b border-emerald-400/30"
            >
              Download & Install here
            </a>.
          </span>
        </p>
      </div>
    </div>

    {/* Step 3 */}
    <div className="flex gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 shrink-0">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">3. 7-Day Link Expiry</h4>
        <p className="text-sm text-slate-400 mt-1">Your unique invitation link is generated exclusively for you and will <strong className="text-amber-400">expire in exactly 7 days</strong>. Please ensure you join the channel promptly.</p>
      </div>
    </div>
  </div>

  {/* Warning Box */}
  <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 relative z-10">
    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
    <p className="text-xs text-rose-200 leading-relaxed">
      <strong>Strict Policy:</strong> Invite links are single-use. Sharing your link or attempting unauthorized access will result in an automated permanent ban without refund.
    </p>
  </div>
</div>
          </div>

          {/* Right Column: Pricing & CTA */}
          <div className="md:col-span-2">
            <div className="sticky top-24 bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(52,211,153,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              <div className="text-sm text-slate-400 mb-2 font-semibold tracking-wide uppercase">Invest in your career</div>
              <div className="text-5xl font-black text-white mb-6">{product.price}</div>
              
              <a 
                href="#" 
                className="w-full flex items-center justify-center py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all mb-4 hover:scale-105 shadow-lg shadow-emerald-500/20"
              >
                UNLOCK ACCESS NOW
              </a>

              <div className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-widest mb-4">
  ✓ One-time payment • Lifetime Telegram Access
</div>
              
              <div className="flex flex-col items-center justify-center gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Secure payment via Lemon Squeezy
                </div>
                <div className="text-slate-600 mt-2 flex items-center gap-1">
                  <Send className="w-3 h-3" /> Requires Telegram App
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}