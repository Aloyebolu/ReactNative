import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import host from '@/constants/Env';
import Animated, { SlideInDown, SlideOutLeft } from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function Conversations({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : {};
      setUserId(user.userId);
      setToken(user.token);
      fetch(`http://${host}/api/conversations/${user.userId}`)
      .then((data) => data.json())
      .then((res) => {setConversations(res); console.log(res)})
      .catch((err) => console.log(err));
    };
    fetchUser();
  }, []);


  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false }); // Disable default header
  });

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
    );
  };

  const goToMessages = (conversationId: string, conversationParticipant: string) => {
    navigation.navigate('Messages', { conversationId: conversationId, user: conversationParticipant });
  };

  const renderConversation = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => goToMessages(item.conversationId, item.participantId)}>
      <Animated.View entering={SlideInDown} exiting={SlideOutLeft} style={styles.messageBubble}>
        <Image source={{ uri: item.imageURL }} style={styles.image} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.messageText}>{item.lastMessage}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <Header />
      {conversations.length>0?
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        contentContainerStyle={{ padding: 10 }}
      /> : <Text>There is nothing here</Text>
    }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  // Header styles
  headerContainer: {
    width: '100%',
    paddingTop: StatusBar.currentHeight || 40,
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
  // Chat list styles
  chatArea: {
    flex: 1,
    marginTop: 10,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
});
