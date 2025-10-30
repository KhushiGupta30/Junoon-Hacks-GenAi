// frontend/src/context/TranslationContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase/config';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      if (!language) return;
      
      const docRef = doc(db, 'translations', language);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTranslations(docSnap.data());
      } else {
        console.warn(`Translations for language "${language}" not found in Firestore. Falling back to English.`);
        // Fallback to English if the selected language doesn't exist
        const enDocRef = doc(db, 'translations', 'en');
        const enDocSnap = await getDoc(enDocRef);
        if (enDocSnap.exists()) {
          setTranslations(enDocSnap.data());
        }
      }
    };

    fetchTranslations();
  }, [language]); // Re-fetch when the language changes

  // The 't' function (for "translate")
  const t = (key) => {
    return translations[key] || key; // Return the translation or the key itself
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  return useContext(TranslationContext);
};