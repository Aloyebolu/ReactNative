import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import host from '@/constants/Env';
import Header from './components/Header';
import Participants from './components/Participants';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import { useFocusEffect } from 'expo-router';
import emitter from "@/app/utils/eventEmitter";

const RoomScreen = () => {
  const route = useRoute();
  const { roomData } = route.params;
  const {roomId} = route.params
  const [userId, setUserId] = useState()
  const [token, setToken] = useState()
  const [participants, setParticipants] = useState([]);
  const screenWidth = Dimensions.get('window').width;
  const isGreaterThan4 = participants?.length > 3;
  const avatarSize = !isGreaterThan4 ? screenWidth / 4.5 : screenWidth / 5.1;


  useFocusEffect(
    useCallback(() => {
      console.log('🟢 Screen focused');
  
      return () => {
        const leave = async() =>{
        roomId &&AsyncStorage.setItem('currentRoom', JSON.stringify({holderId: participants[0]?.id, roomId }), ()=>{console.log(participants)})
        emitter.emit('roomChanged');
        console.log('🔴 Screen unfocused — user left this page!');
        }
        leave()
      };
    }, [participants])
  );
  useEffect(() => {
    roomData ? setParticipants(JSON.parse(roomData)) : '';
  }, [])






  const renderParticipant = ({ item }) => (
    <View style={styles.participantBox}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/room_background.jpg')} // Local image
      resizeMode="cover" // or 'contain', 'stretch'
      style={styles.background} // Full screen
    >
      <View style={styles.container}>
        <Header />
        
        <View style={{paddingTop : 150}}>
          <FlatList
          data={participants}
          numColumns={isGreaterThan4 ? 4 : 4}
          key={isGreaterThan4 ? 'grid' : 'single'}
          columnWrapperStyle={isGreaterThan4 && styles.columnWrapper}
          contentContainerStyle={{
            alignItems: true ? 'center' : 'flex-start',
            justifyContent: true ? 'center' : 'flex-start',
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.avatarContainer, { width: avatarSize + 10 }]}>
              <Image source={{ uri: getUserImageUrl(item.id) }} style={[styles.avatar, { width: avatarSize, height: avatarSize }]} />

              <View style={styles.indicator}>
                <Text style={styles.pos}>{item.position}</Text>
                <Text style={styles.nameText}>{item.name}</Text>
                <FontAwesome
                  name={item.micStatus === 'on' ? 'microphone' : 'microphone-slash'}
                  size={15}
                  color={item.micStatus === 'on' ? 'green' : '#000000'}
                  style={{ marginTop: 5 }}
                />
              </View>


            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        </View>
        

        <Text style={styles.headerText}> </Text>


      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  participantsGrid: {
    alignItems: 'center',
  },
  participantBox: {
    alignItems: 'center',
    margin: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#00BFFF',
  },
  name: {
    fontSize: 14,
    color: '#ff0000',
    textAlign: 'center',
  },


  columnWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
  avatarContainer: {
    alignItems: 'center',
  },

  micStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 20,
    right: 15,
    borderColor: '#000',
    borderWidth: 1,
  },
  nameText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    margin: 5
  }, indicator: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  }
  , pos: {
    backgroundColor: 'green',
    padding: 2,
    borderRadius: 100,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',

  }
});

export default RoomScreen;
