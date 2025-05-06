// screens/FinalConfirmationScreen.jsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SignupContext } from '../context/SignupContext';

export default function FinalConfirmationScreen() {
  const { formData, nextStep, prevStep, darkMode } = useContext(SignupContext);

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textLight]}>
        Final Confirmation
      </Text>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Personal Info:</Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            Name: {formData.first_name} {formData.last_name}
          </Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            Email: {formData.email}
          </Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            Phone: {formData.phone}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Country Info:</Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            Country: {formData.country.name}
          </Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            Region: {formData.country.region}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Password:</Text>
          <Text style={[styles.detail, darkMode && styles.textLight]}>
            {formData.password ? 'Password set' : 'Password not set'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={nextStep}
        >
          <Text style={styles.btnText}>Submit</Text>
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
  scrollContainer: { flex: 1 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  detail: { fontSize: 16, color: '#333' },
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
