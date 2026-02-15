'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/lib/directus';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await registerUser(email, password, firstName, lastName);
            if (result.success) {
                // Successfully registered, now redirect to login
                alert('Kaydınız başarıyla oluşturuldu. Giriş yapabilirsiniz.');
                router.push('/login');
            } else {
                setError('Kayıt oluşturulamadı. Bu e-posta adresi zaten kullanımda olabilir.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
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
                        Hemen Başla
                    </h1>
                    <p className="text-[#9ca7ba] mt-2">MeliScribe Pro dünyasına katılın</p>
                </div>

                {/* Register Form */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#9ca7ba] ml-1">Ad</label>
                                <Input
                                    type="text"
                                    placeholder="Ahmet"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#9ca7ba] ml-1">Soyad</label>
                                <Input
                                    type="text"
                                    placeholder="Yılmaz"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#9ca7ba] ml-1">E-posta</label>
                            <Input
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#9ca7ba] ml-1">Şifre</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-xl h-12"
                                required
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
                                    <span>Hesap Oluşturuluyor...</span>
                                </div>
                            ) : (
                                <span className="group-hover:scale-105 transition-transform duration-300">Ücretsiz Kayıt Ol</span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-[#9ca7ba]">
                            Zaten hesabınız var mı?{' '}
                            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Giriş Yapın
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
