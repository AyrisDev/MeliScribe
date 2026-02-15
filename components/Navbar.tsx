'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image 
                        src="/logo.png" 
                        alt="MeliScribe Pro Logo" 
                        width={32}
                        height={32}
                        className="size-8 object-contain" 
                    />
                    <h2 className="text-base font-bold tracking-tight text-white">
                        MeliScribe <span className="text-primary">Pro</span>
                    </h2>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium text-[#9ca7ba] hover:text-white transition-colors" href="/#features">
                        Features
                    </a>
                    <a className="text-sm font-medium text-[#9ca7ba] hover:text-white transition-colors" href="/#pricing">
                        Pricing
                    </a>
                    <a className="text-sm font-medium text-[#9ca7ba] hover:text-white transition-colors" href="/#diarization">
                        Diarization
                    </a>
                    <a className="text-sm font-medium text-[#9ca7ba] hover:text-white transition-colors" href="/#api">
                        API
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <button className="text-sm font-semibold px-4 py-2 text-white hover:text-primary transition-colors">
                            Login
                        </button>
                    </Link>
                    <Link href="/register">
                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all glow-blue">
                            Try for Free
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
