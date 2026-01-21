import { createDirectus, rest, authentication, readItems, createItem, updateItem, uploadFiles, registerUser as directusRegisterUser } from '@directus/sdk';

// Directus Schema Types
export interface Transcription {
    id: string;
    status: 'uploaded' | 'processing' | 'completed' | 'error';
    user?: string;
    audio_file: string;
    title: string;
    language: string;
    duration?: number;
    assembly_id?: string;
    result_text?: string;
    speaker_data?: any;
    summary?: string;
    date_created: string;
}

export interface Credit {
    id: string;
    user: string;
    balance_seconds: number;
    plan_type: string;
}

export interface DirectusSchema {
    transcriptions: Transcription[];
    credits: Credit[];
}

// Directus Client Configuration
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus<DirectusSchema>(directusUrl)
    .with(rest())
    .with(authentication('cookie'));

// Helper Functions
export async function loginUser(email: string, password: string) {
    try {
        const result = await directus.login({ email, password });
        return { success: true, data: result };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error };
    }
}

export async function registerUser(email: string, password: string, first_name?: string, last_name?: string) {
    try {
        const result = await directus.request(
            directusRegisterUser(email, password, {
                first_name,
                last_name,
            })
        );
        return { success: true, data: result };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error };
    }
}

export async function logoutUser() {
    try {
        await directus.logout();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error };
    }
}

export async function getCurrentUser() {
    try {
        const user = await directus.request(
            readItems('directus_users' as any, {
                fields: ['id', 'email', 'first_name', 'last_name'],
                limit: 1,
            })
        );
        return { success: true, data: user };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getTranscriptions(userId?: string) {
    try {
        const filter = userId ? { user: { _eq: userId } } : {};
        const transcriptions = await directus.request(
            readItems('transcriptions', {
                filter,
                sort: ['-date_created'],
                limit: 100,
            })
        );
        return { success: true, data: transcriptions };
    } catch (error) {
        console.error('Get transcriptions error:', error);
        return { success: false, error };
    }
}

export async function createTranscription(data: Partial<Transcription>) {
    try {
        const result = await directus.request(
            createItem('transcriptions', data)
        );
        return { success: true, data: result };
    } catch (error) {
        console.error('Create transcription error:', error);
        return { success: false, error };
    }
}

export async function updateTranscription(id: string, data: Partial<Transcription>) {
    try {
        const result = await directus.request(
            updateItem('transcriptions', id, data)
        );
        return { success: true, data: result };
    } catch (error) {
        console.error('Update transcription error:', error);
        return { success: false, error };
    }
}

export async function uploadFile(file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await directus.request(uploadFiles(formData));
        return { success: true, data: result };
    } catch (error) {
        console.error('Upload file error:', error);
        return { success: false, error };
    }
}
