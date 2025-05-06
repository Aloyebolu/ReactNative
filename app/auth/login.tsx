import host from '@/constants/Env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import { t } from 'i18next';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false)
const navigation = useNavigation();
  async function handleLogin(): Promise<void> {
      // Get the navigation object
    try {
      // Replace with your API endpoint
      const apiEndpoint = `http://${host}/api/auth/login`;
  
      // Example payload, replace with actual input values
      const payload = {
        email: email, 
        password: password // Replace with actual email input value
      };
  
      setLoggingIn(true);  // Set loading state to true
  
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      const data = await response.json();
      
      // Check if the login was successful
      if (data.status === 'success') {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(data.data));
        setLoggingIn(false);  // Set loading state to false
  
        // Redirect to the Home screen after successful login
         router.push('(tabs)'); // Assuming your home screen is named 'Home'
  
        console.log('User logged in successfully:', data.data);
      } else {
        throw new Error('Login failed: ' + data.message); // You can add custom error message
      }
  
    } catch (error) {
      Alert.alert('Login Error', error.message || 'An error occurred during login.');
      console.error('Login error:', error);
      setLoggingIn(false);  // Set loading state to false in case of error
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t('password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.btnText}>{loggingIn? (<ActivityIndicator color={'red'}></ActivityIndicator>) : 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.switchScreen}>
        <Text>{t('dont_have_account')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.switchText}>{t('sign_up')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, marginBottom: 10, borderRadius: 5 },
  loginBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  switchScreen: { marginTop: 15, alignItems: 'center' },
  switchText: { color: '#007bff' }
});
