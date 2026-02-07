import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {en: {translation: en}, es: {translation: es}, fr: {translation: fr}, de: {translation: de}},
        fallbackLng: 'en',
        interpolation: {escapeValue: false},
        detection: {order: ['navigator', 'htmlTag'], caches: ['localStorage']},
    });

export default i18n;
