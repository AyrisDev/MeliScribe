'use client';

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background-dark py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-3">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Image 
                            src="/logo.png" 
                            alt="MeliScribe Pro Logo" 
                            width={24}
                            height={24}
                            className="size-6 object-contain" 
                        />
                        <h2 className="text-base font-bold tracking-tight text-white">MeliScribe Pro</h2>
                    </Link>
                    <p className="text-[#9ca7ba] text-sm leading-relaxed max-w-xs">
                        Advanced AI transcription for the modern professional workflow. Precise, secure, and blazingly fast.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold text-white text-sm">Product</h4>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Transcription</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Diarization</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">API Access</Link>
                </div>

                <div className="flex flex-col gap-3">
                    <h4 className="font-semibold text-white text-sm">Company</h4>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">About Us</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Security</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Privacy Policy</Link>
                </div>

                <div className="flex flex-col gap-3 ">
                    <h4 className="font-semibold text-white text-sm">Support</h4>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Help Center</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Contact</Link>
                    <Link className="text-sm text-[#9ca7ba] hover:text-white transition-colors" href="#">Status</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-[#9ca7ba] text-xs">© 2026 MeliScribe.</p>

                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[#9ca7ba] text-[10px]">
                        Created by <a href="https://ayris.tech" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold text-white/80">ayris.tech</a>
                    </p>
                </div>

                <div className="flex items-center gap-4 text-[#9ca7ba] text-xs">
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
