// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import * as Localization from 'react-native-localize';
// import { I18nManager } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import en from './locales/en.json';
// import cn from './locales/cn.json';
// import es from './locales/es.json';
// import fr from './locales/fr.json';
// import de from './locales/de.json';
// import ja from './locales/ja.json';
// import ko from './locales/ko.json';
// import it from './locales/it.json';
// import pt from './locales/pt.json';
// import ru from './locales/ru.json';

// import { Resource } from 'i18next';

// const resources: Resource = {
//   en: { translation: en },
//   cn: { translation: cn },
//   es: { translation: es },
//   fr: { translation: fr },
//   de: { translation: de },
//   ja: { translation: ja },
//   ko: { translation: ko },
//   it: { translation: it },
//   pt: { translation: pt },
//   ru: { translation: ru },
// };

// const setRTL = (languageCode: string) => {
//   const isRTL = ['ar', 'he'].includes(languageCode);
//   if (I18nManager.isRTL !== isRTL) {
//     I18nManager.forceRTL(isRTL);
//     I18nManager.allowRTL(isRTL);
//   }
// };

//  i18n
//       .use(initReactI18next)
//       .init({
//         resources,
//         fallbackLng: 'en',
//         lng: 'cn', // Dynamically set the language
//         interpolation: { escapeValue: false },
//       });

//     setRTL(i18n.language);
  

// export default i18n;
// export const t = i18n.t.bind(i18n);


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageDetectorAsync from 'i18next-browser-languagedetector'; // This detects the language async
import { Resource } from 'i18next'; // Import Resource type

// Import language JSON files
import en from './locales/en.json';
import cn from './locales/cn.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';

i18n
  .use(initReactI18next) // Pass the i18n instance to react-i18next.
  .use(LanguageDetectorAsync) // Detect the language asynchronously
  .init({
    resources:{
      en: { translation: en },
      cn: { translation: cn },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      ja: { translation: ja },
      ko: { translation: ko },
      it: { translation: it },
      pt: { translation: pt },
      ru: { translation: ru },
    },
    lng: 'cn', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      async: true,
      order: ['asyncStorage'],
      lookupAsyncStorage: async () => {
        try {
          const lang = await AsyncStorage.getItem('userLanguage');
          console.log('Stored language:', lang);
          return 'cn' ; // Default to 'en' if no language is set
        } catch (e) {
          console.log(e);
          return 'cn';
        }
      },
    },
  });

export default i18n;
export const t = i18n.t.bind(i18n);
