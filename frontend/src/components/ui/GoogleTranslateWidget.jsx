import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 

const GoogleTranslateWidget = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (document.getElementById('google-translate-script')) {
      return;
    }
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          includedLanguages: 'en,hi,bn,te,mr,ta,gu,kn,ml,pa', // Example list
          pageLanguage: 'en', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element' 
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.googleTranslateElementInit = undefined;
    };
  }, []);

  useEffect(() => {
    const setLanguageCookie = () => {
      if (user && user.settings?.language) {
        const langCode = user.settings.language.split('-')[0];
        document.cookie = `googtrans=/en/${langCode}; path=/`;
      }
    };
    
    setLanguageCookie();
    
  }, [user]);
  return <div id="google_translate_element" style={{ position: 'fixed', top: '20px', right: '120px', zIndex: 100 }}></div>;
};

export default GoogleTranslateWidget;