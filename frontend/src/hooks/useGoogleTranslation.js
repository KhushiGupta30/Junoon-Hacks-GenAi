import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosConfig";

const translationCache = {};

export const useGoogleTranslation = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const t = useCallback(
    async (textToTranslate) => {
      const targetLanguage = user?.settings?.language || "en-IN";

      if (targetLanguage.startsWith("en")) {
        return textToTranslate;
      }

      const cacheKey = `${targetLanguage}|${textToTranslate}`;
      if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
      }

      setLoading(true);
      try {
        const response = await api.post("/ai/translate", {
          text: textToTranslate,
          targetLanguage: targetLanguage,
        });
        const { translatedText } = response.data;
        translationCache[cacheKey] = translatedText;
        return translatedText;
      } catch (error) {
        console.error("Translation failed:", error);
        return textToTranslate;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return { t, isTranslating: loading };
};
