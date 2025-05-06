// screens/PasswordScreen.jsx
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SignupContext } from '../../context/SignupContext';
import { t } from '@/app/i18n';

const validatePasswordStrength = (password) => {
  // Password strength rules (e.g., at least 8 characters, one number, one letter)
  const lengthCheck = password.length >= 8;
  const numberCheck = /\d/.test(password);
  const letterCheck = /[a-zA-Z]/.test(password);
  
  return lengthCheck && numberCheck && letterCheck;
};

export default function PasswordScreen() {
  const { updateFormData, nextStep, prevStep, darkMode } = useContext(SignupContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (!validatePasswordStrength(password)) {
      setError(t("password_error_1"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("password_error_1"));
      return;
    }

    updateFormData({ password });
    setError('');
    nextStep();
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textLight]}>
        Create a Password
      </Text>

      <TextInput
        style={[styles.input, darkMode && styles.inputDark]}
        placeholder={t("password")}
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, darkMode && styles.inputDark]}
        placeholder={t("confirm_password")}
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassword}>
        <Text style={[styles.toggleText, darkMode && styles.textLight]}>
          {showPassword ? 'Hide' : 'Show'} Password
        </Text>
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
          <Text style={styles.btnText}>{t("back")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            { opacity: password && confirmPassword && !error ? 1 : 0.5 }
          ]}
          disabled={!password || !confirmPassword || error}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>{t("next")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  dark: { backgroundColor: '#111' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', color: '#000' },
  textLight: { color: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 10, marginBottom: 15, color: '#000'
  },
  inputDark: { borderColor: '#555', backgroundColor: '#222', color: '#fff' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  togglePassword: { alignItems: 'center', marginVertical: 10 },
  toggleText: { fontSize: 16, color: '#007bff' },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20
  },
  backBtn: {
    backgroundColor: '#aaa', padding: 15, borderRadius: 10, flex: 0.45
  },
  nextBtn: {
    backgroundColor: '#007bff', padding: 15, borderRadius: 10, flex: 0.45
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
