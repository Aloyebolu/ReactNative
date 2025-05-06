import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // or use any icon set

const HeaderActions = () => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity onPress={() => setOpen(prev => !prev)}>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.item} onPress={() => console.log('Settings')}>
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => console.log('Logout')}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    elevation: 5,
    zIndex: 1000
  },
  item: {
    paddingVertical: 5
  }
});

export default HeaderActions;