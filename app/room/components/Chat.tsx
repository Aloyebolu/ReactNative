import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ScrollView } from 'react-native';
import Badge from '@/components/badges';
import host from '@/constants/Env';
const chatMessages = [
  {
    id: '1',
    sender: 'Cat',
    avatar: `http://${host}/api/image/10000012`,
    message: 'Hi everyone 👋',
  },
  {
    id: '2',
    sender: '😏✋김석진✋😏',
    avatar: `http://${host}/api/image/10000010`,
    message: 'Can you all hear me?',
  },
  {
    id: '3',
    sender: '🦁',
    avatar: `http://${host}/api/image/10000010`,
    message: 'Yessir 🔊',
  },{
    id: '4',
    sender: '😼',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Hi everyone 👋',
  },
  {
    id: '5',
    sender: '😏✋김석진✋😏',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Can you all hear me?',
  },
  {
    id: '6',
    sender: '🦁',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Yessir 🔊',
  },{
    id: '7',
    sender: '😼',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Hi everyone 👋',
  },
  {
    id: '8',
    sender: '😏✋김석진✋😏',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Can you all hear me?',
  },
  {
    id: '9',
    sender: '🦁',
    avatar: `http://${host}/api/image/10000008`,
    message: 'Yessir 🔊',
  },
];

const Chat = () => {
  return (
    <View style={styles.container}>
      <FlatList
      style={styles.list}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.bubble}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Badge type='vip' />
              </View>
              
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // Optional: adds bottom space
      />

      
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    bottom: '0%',
    height: '40%',
    width: '100%',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    marginRight: 10,
    marginLeft: 10
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: screenWidth * 0.7,
    backgroundColor: '#2228',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sender: {
    fontWeight: 'bold',
    color: '#00f5ff',
    fontSize: 12,
    marginBottom: 3,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Chat;
