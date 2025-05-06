import React, { useState } from 'react';
import { View, Button } from 'react-native';
import CustomAlert from '../../../components/CustomAlert';

export default function AppScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Custom Alert" onPress={() => setVisible(true)} />

      <CustomAlert
        visible={visible}
        title="Warning"
        message="Are you sure you want to continue?"
        onClose={() => setVisible(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setVisible(true);
        }}
        confirmText="Log Out"
        cancelText="No"
      />
    </View>
  );
}
