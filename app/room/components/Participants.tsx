// components/Participants.js
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getUserImageUrl } from '@/app/utils/getUserImageUrl';

const participants = [
  {
    id: '1',
    name: 'Baby Kitty',
    micStatus: 'on',
    avatar: 'http://192.168.214.184:3000/api/image/10000138',
  },
  {
    id: '2',
    name: 'Breakthrough',
    micStatus: 'on',
    avatar: 'http://192.168.214.184:3000/api/image/10000008',
  },
  {
    id: '3',
    name: '006',
    micStatus: 'off',
    avatar: 'http://192.168.214.184:3000/api/image/10000010',
  },
  {
    id: '4',
    name: 'Cat',
    micStatus: 'on',
    avatar: 'http://192.168.214.184:3000/api/image/10000138',
  }
];

const screenWidth = Dimensions.get('window').width;

const Participants = (participants) => {
  console.log(getUserImageUrl('item.id'))
  const isGreaterThan4 = participants.length > 3;
  const avatarSize = !isGreaterThan4 ? screenWidth/4.5 : screenWidth / 5.1;

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 200,
    paddingHorizontal: 0,
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
  avatar: {
    borderRadius: 999,
    borderColor: '#fbf7f7',
    borderWidth: 2,
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
  }, indicator : {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  }
  ,pos : {
    backgroundColor : 'green',
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

export default Participants;
