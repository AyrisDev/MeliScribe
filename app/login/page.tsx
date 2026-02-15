'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/lib/directus';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await loginUser(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-4 transition-transform hover:scale-110 duration-300">
                        <Image 
                            src="/logo.png" 
                            alt="MeliScribe Pro Logo" 
                            width={80}
                            height={80}
                            className="w-full h-full object-contain" 
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        MeliScribe <span className="text-indigo-500">Pro</span>
                    </h1>
                    <p className="text-[#9ca7ba] mt-2">Ses ve video dosyalarınızı metne çevirin</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#9ca7ba] ml-1">E-posta</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-[#9ca7ba]">Şifre</label>
                                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Şifremi Unuttum</a>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/20 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Giriş Yapılıyor...</span>
                                </div>
                            ) : (
                                <span className="group-hover:scale-105 transition-transform duration-300">Giriş Yap</span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-[#9ca7ba]">
                            Henüz hesabınız yok mu?{' '}
                            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Ücretsiz Kayıt Olun
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Copyright */}
                <p className="text-center text-xs text-[#9ca7ba]/50 mt-8">
                    © 2026 MeliScribe Pro. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    );
}
