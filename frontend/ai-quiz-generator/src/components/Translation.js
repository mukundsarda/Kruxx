import React, { useState } from 'react';
import { FaLanguage } from 'react-icons/fa';

const Translation = ({ text, onTranslate, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    ko: 'Korean',
    hi: 'Hindi',
    ar: 'Arabic'
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleTranslate = async () => {
    try {
      if (selectedLanguage === 'en') {
        onTranslate('');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          target_language: selectedLanguage
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onTranslate(data.translated_text);
      } else {
        console.error('Translation failed:', data.message);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
      >
        {Object.entries(languages).map(([code, name]) => (
          <option key={code} value={code} className="text-black">
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={handleTranslate}
        className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors"
      >
        <FaLanguage className="text-lg" />
        Translate
      </button>
    </div>
  );
};

export default Translation; 