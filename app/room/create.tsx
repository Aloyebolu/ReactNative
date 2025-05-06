import host from '@/constants/Env';
import { CommonActions } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CreateRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const { t } = useTranslation();


  async function createRoom(){
    console.log('Room Created:', roomName, roomDescription);
    // You can pass data back or update the backend here
        fetch(`http://${host}/api/rooms/create`, {
            method: 'post',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({title: roomName, description: roomDescription, hostId: '10000010'})
        })
        .then(res => res.json())
        .then(data =>{
            console.log(data[0])
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'RoomScreen',
                    params: {
                      roomId: data[0].id,
                      roomName: data[0].name,
                    },
                  },
                ],
              })
            );
          })
        .catch(err=> console.log('Error', err.message))
        
          
  
      
     // Return to LiveRooms
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background_2.jpg')} // Local image
      resizeMode="cover" // or 'contain', 'stretch'
      style={{ flex: 1 }} // Full screen
      >

      
    <View style={styles.container}>
      <Text style={styles.label}>{t("room_name")}</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
        placeholder={t("enter_room_name")}
      />
      <Text style={styles.label}>{t("description")}</Text>
      <TextInput
        style={styles.input}
        value={roomDescription}
        onChangeText={setRoomDescription}
        placeholder={t("enter_description")}
      />
      <Button title={t("create_room")} onPress={createRoom} />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
});
