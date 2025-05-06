// screens/WelcomeScreen.jsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { SignupContext } from '../context/SignupContext';

export default function WelcomeScreen() {
  const { nextStep, toggleDarkMode, darkMode } = useContext(SignupContext);

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')} // Replace with your image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={[styles.container, darkMode && styles.dark]}>
        <Text style={[styles.title, darkMode && styles.textLight]}>
          Welcome to MyApp
        </Text>
        <Text style={[styles.subtitle, darkMode && styles.textLight]}>
          Let’s create your account and start your journey!
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => console.log('Navigate to Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleDarkMode}>
          <Text style={[styles.toggleText, darkMode && styles.textLight]}>
            Switch to {darkMode ? 'Light' : 'Dark'} Mode
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.versionText}>Version 1.0.0</Text> {/* Add version text */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker semi-transparent overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay for dark mode
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 30,
    textAlign: 'center',
  },
  textLight: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#28a745', // Green color for the login button
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  toggleText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#007bff',
    marginTop: 10,
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    fontSize: 12,
    color: '#aaa',
  },
});
