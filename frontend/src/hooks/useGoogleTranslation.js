import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// A simple in-memory cache for translations
const translationCache = {};

export const useGoogleTranslation = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const t = useCallback(async (textToTranslate) => {
        const targetLanguage = user?.settings?.language || 'en-IN';

        // If the target is English, no need to translate
        if (targetLanguage.startsWith('en')) {
            return textToTranslate;
        }

        const cacheKey = `${targetLanguage}|${textToTranslate}`;
        if (translationCache[cacheKey]) {
            return translationCache[cacheKey];
        }

        setLoading(true);
        try {
            const response = await api.post('/ai/translate', {
                text: textToTranslate,
                targetLanguage: targetLanguage,
            });
            const { translatedText } = response.data;
            translationCache[cacheKey] = translatedText; // Store in cache
            return translatedText;
        } catch (error) {
            console.error("Translation failed:", error);
            return textToTranslate; // Fallback to original text on error
        } finally {
            setLoading(false);
        }
    }, [user]);

    return { t, isTranslating: loading };
};