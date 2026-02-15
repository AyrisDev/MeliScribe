'use client';

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Users,
  Shield,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background-dark text-white selection:bg-primary/30">
      {/* Radial Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              New: Whisper v3 Integration
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Transcribe <span className="text-white">Audio</span> to Text in{' '}
              <span className="italic text-white">Minutes</span>, Not Hours.
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-[#9ca7ba] max-w-xl leading-relaxed">
              The industry-standard AI engine for journalists, creators, and legal pros. Get human-level accuracy in over 90 languages instantly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-base font-semibold px-7 py-3 rounded-lg transition-all glow-blue flex items-center justify-center gap-2">
                  Start Transcribing Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/10 text-white text-base font-semibold px-7 py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-sm text-[#9ca7ba] mt-2">
              <div className="flex -space-x-2">
                <Image
                  className="w-7 h-7 rounded-full border-2 border-background-dark bg-gray-800 object-cover"
                  alt="user avatar 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJW9kjRL_VPZkldNC28ykH6CGXKzBB8lj5Pb9LFR_hZNz0oPfJlCUkOr-emXWwARHvxrPq1QKkXOHgIrbyDE3v8_RkL3uC6jIRDelnavzz1ARVbCgnDAVpZja62Wl-ZZwouWV47E9ewsHxEsQQw5VMdfByF9co2yMW2VRIB3rzH8DGkmDGr-0su_iOE6ayGw91nz3NiKqRW5PKnj-FjAvvR1uSziURdiw3eF1eliGk4t-3HQua7hKchD1eP5plVMMoL5BmXcFfUUrU"
                  width={28}
                  height={28}
                />
                <Image
                  className="w-7 h-7 rounded-full border-2 border-background-dark bg-gray-800 object-cover"
                  alt="user avatar 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzRvKGhGcKxm8nh7NAOr8jmbYD-qG5RZJXmwhXFLneqQtmwsxdCorddlFmfS13DB3yRXV_R4duwS1XVts7pCt1tJ8NSVUEjIJLyxLRpVcA9C7TjKCwiAl9dMW8OZsFQlJ5BvrNei-u8-lug3DkBFWbHVVifc95Tu5fKsOvzo8dmqsp44smT9YkuZG5HzY9Bo_NdxxzZ7uU4IOTkr_fxs-QKIM05SGJJuV1TsVpGjsUZ0M5RcexpRFkK8tm7jRYLnfWiXEKfKqLv8VT"
                  width={28}
                  height={28}
                />
                <Image
                  className="w-7 h-7 rounded-full border-2 border-background-dark bg-gray-800 object-cover"
                  alt="user avatar 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPyaMKuAXMlbAVgRrJZCXowRADLhXeOou6WTQjKiLbbWOAPYkRGb3XPnIwH9n0nyfI8kSx-hvK8LgsgnR2UqvqzcxRHfDRUJ1PnQlf2IDumWpqTXnTzrprNQm_W9GVskZDczqtMBxZlxi3mlCK8pXc0mVWoHoxsNx63bfra4Ku_eavcXlI-LPhhoUINq__XZPX8cyaZvEkE53jNtZjDLVwYPdKTpvy2mLeBJ7d0BDAkygZMvm7AiPqlIMi5SNk9YdZUG5hNUFXEC-A"
                  width={28}
                  height={28}
                />
              </div>
              <span className="text-xs">Joined by 10,000+ professionals</span>
            </div>
          </div>

          {/* Hero Visual - Bar Chart */}
          <div className="relative group hidden lg:block">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative bg-[#0a1628] border border-white/5 rounded-2xl p-8 overflow-hidden aspect-square flex items-end justify-center shadow-2xl">
              {/* Animated Bar Chart */}
              <div className="w-full h-48 flex items-end justify-center gap-3">
                <div className="w-12 bg-primary/30 rounded-t-lg h-[40%] transition-all duration-300 hover:h-[45%]" />
                <div className="w-12 bg-primary/50 rounded-t-lg h-[55%] transition-all duration-300 hover:h-[60%]" />
                <div className="w-12 bg-primary/70 rounded-t-lg h-[70%] transition-all duration-300 hover:h-[75%]" />
                <div className="w-12 bg-primary rounded-t-lg h-[90%] glow-blue transition-all duration-300 hover:h-[95%]" />
                <div className="w-12 bg-primary/80 rounded-t-lg h-[65%] transition-all duration-300 hover:h-[70%]" />
                <div className="w-12 bg-primary/40 rounded-t-lg h-[50%] transition-all duration-300 hover:h-[55%]" />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Logos */}
        <section className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5">
          <p className="text-center text-xs font-medium text-[#9ca7ba] mb-6 uppercase tracking-widest">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="text-lg font-bold">FORBES</div>
            <div className="text-lg font-bold">REUTERS</div>
            <div className="text-lg font-bold">WIRED</div>
            <div className="text-lg font-bold">VOX</div>
            <div className="text-lg font-bold">THE VERGE</div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col gap-3 mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Engineered for Precision</h2>
            <p className="text-[#9ca7ba] max-w-2xl mx-auto text-base leading-relaxed">
              Experience the power of high-end AI transcription with our professional-grade toolset designed for high-stakes workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large Feature: Accuracy */}
            <div className="md:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between group overflow-hidden relative min-h-[280px]">
              <div className="absolute -right-20 -top-20 size-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all" />

              <div className="relative z-10">
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">99% Human-Level Precision</h3>
                <p className="text-[#9ca7ba] text-sm max-w-xs">
                  Advanced neural engines ensure industry-leading accuracy even in noisy environments.
                </p>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="w-full h-24 flex items-end gap-1.5">
                  <div className="flex-1 bg-primary/20 h-[40%] rounded-t" />
                  <div className="flex-1 bg-primary/40 h-[55%] rounded-t" />
                  <div className="flex-1 bg-primary/60 h-[70%] rounded-t" />
                  <div className="flex-1 bg-primary h-full rounded-t glow-blue" />
                  <div className="flex-1 bg-primary/80 h-[80%] rounded-t" />
                  <div className="flex-1 bg-primary/50 h-[60%] rounded-t" />
                </div>
              </div>
            </div>

            {/* Speaker Diarization */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group min-h-[280px]">
              <div>
                <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Speaker Diarization</h3>
                <p className="text-[#9ca7ba] text-sm">
                  Automatically identify and label different speakers throughout your recordings.
                </p>
              </div>
              <div className="flex -space-x-2 mt-4">
                <div className="size-10 rounded-full border-4 border-card-dark bg-blue-500 flex items-center justify-center font-bold text-sm">A</div>
                <div className="size-10 rounded-full border-4 border-card-dark bg-purple-500 flex items-center justify-center font-bold text-sm">B</div>
                <div className="size-10 rounded-full border-4 border-card-dark bg-emerald-500 flex items-center justify-center font-bold text-sm">C</div>
              </div>
            </div>

            {/* Secure & Private */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[200px]">
              <div className="size-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1.5">Secure & Private</h3>
                <p className="text-sm text-[#9ca7ba]">SOC2 Type II compliant, AES-256 encrypted at rest.</p>
              </div>
            </div>

            {/* Universal Export */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[200px]">
              <div className="size-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1.5">Universal Export</h3>
                <p className="text-sm text-[#9ca7ba]">SRT, VTT, DOCX, TXT. Seamless integrations with your stack.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f1a2e] border border-white/10 rounded-2xl p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 size-64 bg-primary/20 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to stop typing?</h2>
              <p className="text-[#9ca7ba] text-base max-w-xl">
                Join thousands of professionals who save 5+ hours a week on transcription. No credit card required to start.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/register">
                  <button className="bg-primary hover:bg-primary/90 text-white text-base font-semibold px-8 py-3 rounded-lg transition-all glow-blue">
                    Get Started Free
                  </button>
                </Link>
                <button className="bg-transparent hover:bg-white/5 border border-white/10 text-white text-base font-semibold px-8 py-3 rounded-lg transition-all">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
