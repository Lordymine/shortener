import { Zap, Shield, Sparkles, BarChart3, Globe2, Link2 } from "lucide-react"

export function FeaturesSection() {
    return (
        <section className="w-full pt-20 pb-16 md:pt-48 md:pb-32 bg-slate-50 relative overflow-hidden">

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 tracking-tight">
                        Why choose our <span className="text-brand-blue relative inline-block">
                            shortener
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-orange/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                            </svg>
                        </span>?
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Everything you need to control your links in one powerful dashboard.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Main Feature - Large */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-blue/10"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            <div className="p-4 bg-brand-blue rounded-2xl shadow-lg shadow-brand-blue/30 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-brand-navy mb-3">Lightning Fast Redirection</h3>
                                <p className="text-slate-500 text-lg leading-relaxed">
                                    Our infrastructure is optimized for speed. With edge caching and a global CDN, your links redirect instantly from anywhere in the world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 - Tall */}
                    <div className="md:row-span-2 bg-brand-navy rounded-3xl p-10 shadow-xl shadow-brand-navy/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-6 border border-white/10 group-hover:bg-white/20 transition-colors">
                                <Shield className="w-8 h-8 text-brand-orange" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Enterprise Grade Security</h3>
                            <p className="text-slate-300 leading-relaxed mb-8">
                                Every link is scanned for malware and phishing. HSTS and automatic HTTPS included.
                            </p>
                            <div className="mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
                                <Globe2 className="w-32 h-32 text-white/5 absolute -bottom-8 -right-8 rotate-12" />
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy">Analytics</h3>
                        </div>
                        <p className="text-slate-500">Real-time clicks tracking and geographic data.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Link2 className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy">Custom Alias</h3>
                        </div>
                        <p className="text-slate-500">Create meaningful links that people want to click.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
