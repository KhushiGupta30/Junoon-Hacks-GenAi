import React, { createContext, useState, useEffect, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../backend/firebase/config";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const fetchTranslations = async () => {
      if (!language) return;

      const docRef = doc(db, "translations", language);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTranslations(docSnap.data());
      } else {
        console.warn(
          `Translations for language "${language}" not found in Firestore. Falling back to English.`
        );
        const enDocRef = doc(db, "translations", "en");
        const enDocSnap = await getDoc(enDocRef);
        if (enDocSnap.exists()) {
          setTranslations(enDocSnap.data());
        }
      }
    };

    fetchTranslations();
  }, [language]);

  const t = (key) => {
    return translations[key] || key;
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
