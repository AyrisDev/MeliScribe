'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { directus } from '@/lib/directus';
import { readItem } from '@directus/sdk';
import type { Transcription } from '@/lib/directus';
import { Footer } from '@/components/Footer';

interface Speaker {
    speaker: string;
    text: string;
    start: number;
    end: number;
}

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [transcription, setTranscription] = useState<Transcription | null>(null);
    const [loading, setLoading] = useState(true);
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [speakerNames, setSpeakerNames] = useState<Record<string, string>>({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        loadTranscription();
    }, [params.id]);

    const loadTranscription = async () => {
        try {
            const result = await directus.request(
                readItem('transcriptions', params.id as string)
            );
            setTranscription(result as Transcription);

            if (result.speaker_data) {
                const speakersData = typeof result.speaker_data === 'string'
                    ? JSON.parse(result.speaker_data)
                    : result.speaker_data;
                setSpeakers(speakersData);

                // Initialize speaker names
                const uniqueSpeakers = [...new Set(speakersData.map((s: Speaker) => s.speaker))];
                const names: Record<string, string> = {};
                uniqueSpeakers.forEach((speaker) => {
                    names[speaker as string] = speaker as string;
                });
                setSpeakerNames(names);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading transcription:', error);
            router.push('/dashboard');
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const exportTXT = () => {
        if (!transcription) return;

        let content = `${transcription.title}\n\n`;

        if (speakers.length > 0) {
            speakers.forEach((speaker) => {
                const name = speakerNames[speaker.speaker] || speaker.speaker;
                content += `${name}: ${speaker.text}\n\n`;
            });
        } else {
            content += transcription.result_text || '';
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${transcription.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportSRT = () => {
        if (!transcription || speakers.length === 0) return;

        let content = '';
        speakers.forEach((speaker, index) => {
            const name = speakerNames[speaker.speaker] || speaker.speaker;
            const startTime = formatSRTTime(speaker.start);
            const endTime = formatSRTTime(speaker.end);

            content += `${index + 1}\n`;
            content += `${startTime} --> ${endTime}\n`;
            content += `${name}: ${speaker.text}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${transcription.title}.srt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatSRTTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);

        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
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

    if (!transcription) {
        return null;
    }

    const audioUrl = transcription.audio_file
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${transcription.audio_file}`
        : '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Dashboard'a Dön
                        </Link>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={exportTXT}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                TXT
                            </Button>
                            {speakers.length > 0 && (
                                <Button variant="outline" size="sm" onClick={exportSRT}>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    SRT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{transcription.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(transcription.date_created).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <span>{transcription.language?.toUpperCase()}</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transcription.status === 'completed' ? 'bg-green-100 text-green-700' :
                            transcription.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {transcription.status === 'completed' ? 'Tamamlandı' :
                                transcription.status === 'processing' ? 'İşleniyor' : 'Yüklendi'}
                        </span>
                    </div>
                </div>

                {transcription.status === 'processing' && (
                    <Card className="mb-6 bg-yellow-50 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
                                <div>
                                    <h3 className="font-semibold text-yellow-900">İşlem Devam Ediyor</h3>
                                    <p className="text-sm text-yellow-700">
                                        Dosyanız şu anda işleniyor. Bu işlem birkaç dakika sürebilir.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {transcription.status === 'completed' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Audio Player */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ses Oynatıcı</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />

                                {/* Waveform Placeholder */}
                                <div className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                    <div className="flex items-end gap-1 h-20">
                                        {[...Array(40)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-indigo-600 rounded-full transition-all"
                                                style={{
                                                    height: `${Math.random() * 100}%`,
                                                    opacity: currentTime > (duration / 40) * i ? 1 : 0.3
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        value={currentTime}
                                        onChange={(e) => handleSeek(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                        </svg>
                                    </Button>

                                    <Button
                                        size="lg"
                                        className="w-16 h-16 rounded-full"
                                        onClick={handlePlayPause}
                                    >
                                        {isPlaying ? (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                                        </svg>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transcript Editor */}
                        <Card className="lg:row-span-2">
                            <CardHeader>
                                <CardTitle>Transkript</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {speakers.length > 0 ? (
                                        speakers.map((speaker, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                                                onClick={() => handleSeek(speaker.start)}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-indigo-600">
                                                                {speakerNames[speaker.speaker]?.charAt(0) || speaker.speaker.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <input
                                                                type="text"
                                                                value={speakerNames[speaker.speaker] || speaker.speaker}
                                                                onChange={(e) => setSpeakerNames({
                                                                    ...speakerNames,
                                                                    [speaker.speaker]: e.target.value
                                                                })}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none focus:underline"
                                                            />
                                                            <span className="text-xs text-gray-500">
                                                                {formatTime(speaker.start)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            {speaker.text}
                                                        </p>
                                                    </div>
                                                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 rounded-lg bg-gray-50">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                {transcription.result_text || 'Transkript henüz hazır değil.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        {transcription.summary && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Özet</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {transcription.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
