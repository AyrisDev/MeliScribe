'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadFile, createTranscription } from '@/lib/directus';
import { formatFileSize } from '@/lib/utils';

export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('tr');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'video/mp4', 'video/webm'];

        if (!validTypes.some(type => selectedFile.type.includes(type.split('/')[1]))) {
            alert('Lütfen geçerli bir ses veya video dosyası seçin (MP3, WAV, M4A, MP4, WebM)');
            return;
        }

        setFile(selectedFile);
        if (!title) {
            setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        setProgress(10);

        try {
            // Upload file to Directus
            setProgress(30);
            const uploadResult = await uploadFile(file);

            if (!uploadResult.success || !uploadResult.data) {
                throw new Error('Dosya yüklenemedi');
            }

            setProgress(60);

            // Create transcription record
            const transcriptionResult = await createTranscription({
                title,
                language,
                audio_file: (uploadResult.data as any).id,
                status: 'uploaded',
            });

            if (!transcriptionResult.success) {
                throw new Error('Transkript kaydı oluşturulamadı');
            }

            setProgress(100);

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 500);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Dashboard'a Dön
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Yeni Transkript</h1>
                    <p className="text-gray-600">Ses veya video dosyanızı yükleyin</p>
                </div>

                <Card className="backdrop-blur-sm bg-white/80 border-2">
                    <CardHeader>
                        <CardTitle>Dosya Yükleme</CardTitle>
                        <CardDescription>
                            MP3, WAV, M4A, MP4 veya WebM formatında dosya yükleyebilirsiniz
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* File Drop Zone */}
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : file
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="audio/*,video/*"
                                    onChange={handleFileInputChange}
                                    disabled={uploading}
                                />

                                {file ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFile(null)}
                                            disabled={uploading}
                                        >
                                            Dosyayı Değiştir
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900 mb-1">
                                                Dosyayı sürükleyip bırakın
                                            </p>
                                            <p className="text-sm text-gray-500">veya</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Dosya Seç
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                        Proje Adı *
                                    </label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Örn: Pazarlama Toplantısı"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={uploading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="language" className="text-sm font-medium text-gray-700">
                                        Dil
                                    </label>
                                    <select
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        disabled={uploading}
                                        className="flex h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                    >
                                        <option value="tr">Türkçe</option>
                                        <option value="en">İngilizce</option>
                                        <option value="de">Almanca</option>
                                        <option value="fr">Fransızca</option>
                                        <option value="es">İspanyolca</option>
                                    </select>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {uploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Yükleniyor...</span>
                                        <span className="font-medium text-indigo-600">{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Link href="/dashboard" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full" disabled={uploading}>
                                        İptal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={!file || !title || uploading}
                                >
                                    {uploading ? 'Yükleniyor...' : 'Yükle ve İşle'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-1">İşlem Süreci</h3>
                                <p className="text-sm text-blue-700">
                                    Dosyanız yüklendikten sonra, AssemblyAI altyapısı ile otomatik olarak işlenecektir.
                                    İşlem tamamlandığında size bildirim gönderilecektir. Genellikle dosya uzunluğunun
                                    yarısı kadar sürer (10 dakikalık ses için ~5 dakika).
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
