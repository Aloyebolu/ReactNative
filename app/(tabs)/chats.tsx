import { Dimensions, FlatList, Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import host from '@/constants/Env';
import Animated, { SlideInDown, SlideOutLeft } from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getSocket } from '../utils/socket';
import emitter from "@/app/utils/eventEmitter";

const { width, height } = Dimensions.get('window');


// ✅ Interface outside component
interface Conversation {
  conversationId: string;
  unreadMessages: number;
  name: string;
  lastMessage: string;
  imageURL: string;
  participantId: string;
}

export default function Conversations() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const socket = getSocket();

  useEffect(() => {
    const handleDbUpdate = (payload: any) => {
      console.log('🔔 Database update received in Chats:', payload);

      if (payload.type === 'insert' && payload.data?.conversation_id) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setConversations((prev) =>
          prev.map((conv) =>
            conv.conversationId === String(payload.data.conversation_id)
              ? { ...conv, unreadMessages: conv.unreadMessages + 1 }
              : conv
          )
        );
      }
    };
    const handleUnreadConversations = (data : any) =>{
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, unreadMessages: (conv.unreadMessages || 0) + 1 }
            : conv
        )
      );
      
    }

    emitter.on('db_update', handleDbUpdate);
    return () => emitter.off('db_update', handleDbUpdate);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : {};
      setUserId(user.userId);
      setToken(user.token);
  
      fetch(`http://${host}/api/conversations/${user.userId}`)
        .then((data) => data.json())
        .then((res) => {
          const updatedConvos = res.map((c) => ({
            ...c,
            unreadMessages: parseInt(c.unreadMessages || '0', 10),
          }));
          console.log(updatedConvos);
          setConversations(updatedConvos);
        })
        .catch((err) => console.error('❌ Fetch error:', err));
    };
  
    fetchUser();
  
    const handler = () => {
      console.log("📡 Emitter triggered: refresh conversations");
      fetchUser();
    };
  
    emitter.on('unread_messages', handler);
  
    return () => {
      emitter.off('refreshConversations', handler);
    };
  }, []);
  

  useEffect(() => {
    const listener = ({ conversationId, unreadMessages }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === conversationId
            ? { ...conv, unreadMessages }
            : conv
        )
      );
    };

    emitter.on('updateUnreadMessages', listener);
    return () => emitter.off('updateUnreadMessages', listener);
  }, []);

  const goToMessages = (conversationId: string, participantId: string) => {
    router.push({
      pathname: '/chat/Messages',
      params: {
        conversationId,
        user: JSON.stringify(participantId),
      },
    });
  };

  const Header = () => {
    const { t } = useTranslation();
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('chats')}</Text>
        <TouchableOpacity onPress={() => router.push('/chat/CreateChat')} style={styles.headerIcon}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      key={item.conversationId}
      onPress={() => goToMessages(item.conversationId, item.participantId)}
    >
      <Animated.View entering={SlideInDown} exiting={SlideOutLeft} style={styles.messageBubble}>
        <Image source={{ uri: item.imageURL }} style={styles.image} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageText}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unreadMessages !== 0 && (
          <Text style={styles.unread}>{item.unreadMessages}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <Header />
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.conversationId}
          style={styles.chatArea}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>There is nothing here</Text>
        </View>
      )}
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
  headerIcon: {
    position: 'absolute',
    right: 20,
    marginTop: 300,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  unread: {
    fontSize: 13,
    color: '#eae7e7',
    backgroundColor: 'red',
    width: 18,
    height: 18,
    textAlign: 'center',
    borderRadius: 999
  }
});
