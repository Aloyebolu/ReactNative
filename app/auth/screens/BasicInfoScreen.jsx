// screens/BasicInfoScreen.jsx
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SignupContext } from '../../context/SignupContext';
import { t } from '@/app/i18n';

export default function BasicInfoScreen() {
  const { nextStep, prevStep, updateFormData, darkMode } = useContext(SignupContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name');
      return;
    }

    updateFormData({ first_name: firstName, last_name: lastName });
    setError('');
    nextStep();
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textLight]}>
      {t("enter_your_basic_info")}
      </Text>

      <TextInput
        placeholder={t("first_name")}
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        style={[styles.input, darkMode && styles.inputDark]}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder={t("last_name")}
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        style={[styles.input, darkMode && styles.inputDark]}
        value={lastName}
        onChangeText={setLastName}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
          <Text style={styles.btnText}>{t("back")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.btnText}>{t("next")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: 'center',
    backgroundColor: '#fff'
  },
  dark: {
    backgroundColor: '#111'
  },
  title: {
    fontSize: 22, marginBottom: 20, textAlign: 'center', color: '#000'
  },
  textLight: {
    color: '#fff'
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 15,
    borderRadius: 10, marginBottom: 15, color: '#000'
  },
  inputDark: {
    borderColor: '#555', backgroundColor: '#222', color: '#fff'
  },
  error: {
    color: 'red', marginBottom: 10, textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between'
  },
  backBtn: {
    backgroundColor: '#aaa', padding: 15, borderRadius: 10, flex: 0.45
  },
  nextBtn: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 10, flex: 0.45
  },
  btnText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold'
  }
});
