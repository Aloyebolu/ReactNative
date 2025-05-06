import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Dimensions, StatusBar, ImageBackground } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {logEvent} from '../utils/logger';
import { logger } from 'react-native-reanimated/lib/typescript/logger';
import { useTranslation } from 'react-i18next';
import host from '@/constants/Env';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import {fetchUser} from '../utils/user';
import {fetchRoomData} from '../utils/room'
import AsyncStorage from '@react-native-async-storage/async-storage';
import emitter from "@/app/utils/eventEmitter"


type RootStackParamList = {
  RoomScreen: { roomId: string; roomName: string };
  // Add other routes here if needed
};




  const Header = () => {
    const { t } = useTranslation();

    return (
      <View style={[styles.headerContainer,{flexDirection: 'row'}]}>
      <View >
        <Text style={styles.headerTitle}>{t('rooms')}</Text>
      </View>
      <TouchableOpacity
                      onPress={() => router.push('/room/create')}
                      style={{ marginRight: 16 }}
                    >
                      <Text style={{ fontSize: 24, color: 'red' }}>＋</Text>
      </TouchableOpacity>
      </View>
    );
  };


const LiveRooms = () => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState([]);
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userId, setUserId] = useState() 

  useEffect(() => {
    const fetchRooms = async() => {
      const user = await fetchUser()

      setUserId(user.userId);
      const response = await fetch(`http://${host}/api/rooms`);
      const data = await response.json();
      console.log(data)
      setRooms(data);
    };

    fetchRooms();
  }, []);

  const handleRoomPress = async (roomId) => {
    //CHeck if user is in pressed room

    try {
      const roomData = await fetchRoomData(roomId);
      console.log('a', roomData)
      AsyncStorage.removeItem('currentRoom', () => {
        emitter.emit('roomChanged');
        router.push({
          pathname: '/room',
          params: {
            roomData: JSON.stringify(roomData),
            roomId
          },
        });


      });
    } catch (err) {
      console.log("Error: ", err)
    }
  };

  // Render participants images in a grid (max 4 per row)
  const renderParticipants = (participants) => {
    // Ensure participants is an array before trying to map over it
    if (!participants || participants.length === 0) {
      return <Text>No participants yet</Text>; // Optional: A fallback message when no participants are available
    }
  
    return (
      <View style={styles.participantsContainer}>
        {participants.map((participant, index) => (
          <Image
            key={index}
            source={{ uri: getUserImageUrl(participant.id) }}
            style={[
              styles.participantImage,
            ]}
          />
        ))}
      </View>
    );
  };
  

  return (
    <ImageBackground
     source={require('../../assets/images/background_3.jpg')} 
      resizeMode="cover" 
      style={{ flex: 1 }} >
     
    
    <View style={styles.container}>
      <Header />
      <FlatList
        data={rooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomItem}
            onPress={() => handleRoomPress(item.id)}
          >
            
            {renderParticipants(item.participants)}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  roomItem: {
    padding: 8,
    paddingVertical: 4
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  roomDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 150,
    borderRadius: 15,
    overflow: 'hidden'
  },
  participantImage: {
    flex: 1,
    height: '100%',
    

  },
    headerContainer: {
      width: '100%',
      paddingTop: StatusBar.currentHeight-20 || 40,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: '#007bff',
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
  
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'left',
    },
});

export default LiveRooms;
