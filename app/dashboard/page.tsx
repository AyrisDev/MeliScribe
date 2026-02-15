'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranscriptions, getCurrentUser, logoutUser, type Transcription } from '@/lib/directus';
import { formatDuration } from '@/lib/utils';
import { Footer } from '@/components/Footer';

export default function DashboardPage() {
    const router = useRouter();
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const userResult = await getCurrentUser();
        if (!userResult.success) {
            router.push('/login');
            return;
        }

        setUser(userResult.data);

        const result = await getTranscriptions();
        if (result.success) {
            setTranscriptions(result.data as Transcription[]);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await logoutUser();
        router.push('/login');
    };

    const getStatusBadge = (status: Transcription['status']) => {
        const styles = {
            uploaded: 'bg-blue-100 text-blue-700 border-blue-200',
            processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            error: 'bg-red-100 text-red-700 border-red-200',
        };

        const labels = {
            uploaded: 'Yüklendi',
            processing: 'İşleniyor',
            completed: 'Hazır',
            error: 'Hata',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image 
                                src="/logo.png" 
                                alt="MeliScribe Pro Logo" 
                                width={40}
                                height={40}
                                className="size-10 object-contain" 
                            />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                MeliScribe <span className="text-primary">Pro</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Hoş geldin, {user?.first_name || user?.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Çıkış
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                        <CardHeader>
                            <CardDescription className="text-indigo-100">Toplam Transkript</CardDescription>
                            <CardTitle className="text-4xl">{transcriptions.length}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                        <CardHeader>
                            <CardDescription className="text-green-100">Tamamlanan</CardDescription>
                            <CardTitle className="text-4xl">
                                {transcriptions.filter(t => t.status === 'completed').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0">
                        <CardHeader>
                            <CardDescription className="text-yellow-100">İşleniyor</CardDescription>
                            <CardTitle className="text-4xl">
                                {transcriptions.filter(t => t.status === 'processing').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Transkriptlerim</h2>
                    <Link href="/upload">
                        <Button size="lg" className="gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Yeni Yükle
                        </Button>
                    </Link>
                </div>

                {/* Transcriptions List */}
                {transcriptions.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz transkript yok</h3>
                        <p className="text-gray-600 mb-6">İlk ses dosyanızı yükleyerek başlayın</p>
                        <Link href="/upload">
                            <Button>İlk Dosyayı Yükle</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {transcriptions.map((transcription) => (
                            <Link key={transcription.id} href={`/project/${transcription.id}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {transcription.title}
                                                    </h3>
                                                    {getStatusBadge(transcription.status)}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(transcription.date_created).toLocaleDateString('tr-TR')}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                                        </svg>
                                                        {transcription.language?.toUpperCase() || 'TR'}
                                                    </span>
                                                </div>
                                            </div>
                                            <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
