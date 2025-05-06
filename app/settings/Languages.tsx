import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n'; // Make sure this is correctly set up
import { useTranslation } from 'react-i18next';

const Languages = () => {
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'cn', name: 'Chinese(中文)' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
    ];

    useEffect(() => {
        // Load language from AsyncStorage when the app starts
        const loadLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem('userLanguage');
            if (storedLanguage && storedLanguage !== i18n.language) {
                console.log('Stored language:', storedLanguage);
              if (!i18n.isInitialized) {
                await new Promise((resolve) => {
                  const interval = setInterval(() => {
                    if (i18n.isInitialized) {
                      clearInterval(interval);
                      resolve(true);
                    }
                  }, 100);
                });
              }
              await i18n.changeLanguage(storedLanguage);
              setSelectedLanguage(storedLanguage);
            }
          };
          
        loadLanguage();
    }, []);

    const handleLanguageChange = async (languageCode: string) => {
        if (!i18n.hasResourceBundle(languageCode, 'translation')) { // 🔥 Corrected function
            Alert.alert('Error', 'Selected language is not supported.');
            return;
        }

        const confirmChange = async () => {
            i18n.changeLanguage(languageCode);
            setSelectedLanguage(languageCode);
            await AsyncStorage.setItem('userLanguage', languageCode); // 🔥 Save language
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Are you sure you want to change the language?');
            if (confirmed) {
                await confirmChange();
            }
        } else {
            Alert.alert(
                'Confirm Language Change',
                'Are you sure you want to change the language?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'OK',
                        onPress: async () => {
                            await confirmChange();
                        },
                    },
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Language</Text>
            {languages.map((language) => (
                <TouchableOpacity
                    key={language.code}
                    style={[
                        styles.languageButton,
                        selectedLanguage === language.code && styles.selectedButton,
                    ]}
                    onPress={() => handleLanguageChange(language.code)}
                >
                    <Text
                        style={[
                            styles.languageText,
                            selectedLanguage === language.code && styles.selectedText,
                        ]}
                    >
                        {language.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    languageButton: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: '#007bff',
    },
    languageText: {
        fontSize: 18,
        textAlign: 'center',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Languages;
