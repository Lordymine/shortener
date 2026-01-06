import { UrlShortenerForm } from "@/components/url-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-navy flex flex-col font-sans selection:bg-brand-orange selection:text-white">

      {/* Navbar Simple */}
      <header className="sticky top-0 left-0 w-full z-50 bg-brand-navy/80 backdrop-blur-md border-b border-white/5 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg rounded-lg">
              <rect width="32" height="32" rx="8" fill="#0b1736" />
              <path d="M10 16C10 12.6863 12.6863 10 16 10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
              <path d="M22 16C22 19.3137 19.3137 22 16 22" stroke="#2a5bd7" strokeWidth="4" strokeLinecap="round" />
              <circle cx="16" cy="16" r="2" fill="white" />
            </svg>
            <span className="text-2xl font-bold text-white tracking-tight">Shortener</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-slate-300 font-medium">
            <a href="#" className="hover:text-white transition-colors">Platform</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-32 md:pb-48 overflow-hidden px-4">
        {/* Abstract Background Elements (Restored) */}
        <div className="absolute top-20 right-[10%] w-20 h-20 text-brand-light-navy opacity-50 animate-pulse pointer-events-none">
          <svg viewBox="0 0 100 100" className="fill-current w-full h-full"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
        </div>
        <div className="absolute top-40 left-[5%] w-12 h-12 text-brand-orange opacity-40 animate-bounce delay-700 pointer-events-none">
          <svg viewBox="0 0 100 100" className="fill-current w-full h-full"><circle cx="50" cy="50" r="50" /></svg>
        </div>

        <div className="container mx-auto px-0 md:px-4 text-center relative z-10 w-full max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm leading-tight">
            Build stronger <br className="hidden md:block" />
            <span className="text-brand-orange">digital connections</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed px-4">
            Use our URL shortener, QR Codes, and landing pages to engage your audience.
          </p>

          {/* Form Component */}
          <div className="flex justify-center w-full">
            <UrlShortenerForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer Simple */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Shortener. Made with ❤️</p>
        </div>
      </footer>

      <Toaster position="top-center" />
    </main>
  )
}
