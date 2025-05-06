// screens/CountrySelectScreen.jsx
import React, { useContext, useState, useEffect } from 'react';
import { flagImages } from '../../utils/loadFlagFiles';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, StyleSheet, TextInput
} from 'react-native';
import { SignupContext } from '../../context/SignupContext';
import countriesData from '../../country/countries.json'; // your JSON file
import { t } from '@/app/i18n';
export default function CountrySelectScreen() {
  const { updateFormData, nextStep, prevStep, darkMode } = useContext(SignupContext);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  useEffect(() => {
    setFiltered(countriesData);
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = countriesData.filter(
      country => country.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filtered);
  };

  const handleSelect = (item) => {
    setSelectedCountryId(item.id);
    updateFormData({
      country: {
        id: item.id,
        name: item.name,
        region: item.region,
        flag: item.url
      }
    });
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <Text style={[styles.title, darkMode && styles.textLight]}>
      {t("select_your_country")}
      </Text>

      <TextInput
        style={[styles.input, darkMode && styles.inputDark]}
        placeholder={t("search")}
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={[
              styles.item,
              darkMode && styles.itemDark,
              selectedCountryId === item.id && styles.selected
            ]}
          >
            <Image source={flagImages[item.alpha2]} style={styles.flag} />
            <View>
              <Text style={[styles.name, darkMode && styles.textLight]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextBtn,
            { opacity: selectedCountryId ? 1 : 0.5 }
          ]}
          disabled={!selectedCountryId}
          onPress={nextStep}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  dark: { backgroundColor: '#111' },
  title: { fontSize: 22, marginBottom: 10, textAlign: 'center', color: '#000' },
  textLight: { color: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8,
    marginBottom: 10, color: '#000'
  },
  inputDark: { backgroundColor: '#222', color: '#fff', borderColor: '#444' },
  item: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    borderBottomWidth: 1, borderBottomColor: '#ddd'
  },
  itemDark: { borderBottomColor: '#444' },
  selected: { backgroundColor: '#e6f7ff' },
  flag: { width: 40, height: 25, marginRight: 15, borderRadius: 4 },
  name: { fontSize: 16 },
  region: { fontSize: 12, color: '#666' },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 10
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
