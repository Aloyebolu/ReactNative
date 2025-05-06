// screens/WelcomeScreen.jsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SignupContext } from '../../context/SignupContext';
import { t } from '@/app/i18n';

export default function WelcomeScreen() {
  const { nextStep, toggleDarkMode, darkMode } = useContext(SignupContext);

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textLight]}>
        Let’s create your account!
      </Text>

      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>{t('get_started')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleDarkMode}>
        <Text style={[styles.toggleText, darkMode && styles.textLight]}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff'
  },
  dark: {
    backgroundColor: '#111'
  },
  title: {
    fontSize: 24, marginBottom: 20, color: '#000'
  },
  textLight: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 10, marginBottom: 20
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold'
  },
  toggleText: {
    textDecorationLine: 'underline', color: '#007bff'
  }
});
