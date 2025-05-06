import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, RouteProp, useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import host, { host2 } from '@/constants/Env';
import { io, Socket } from 'socket.io-client';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Modal, ToastAndroid, ActivityIndicator } from 'react-native';
import Animated, { BounceInDown, BounceOutDown, Layout, SlideInDown, SlideOutLeft } from 'react-native-reanimated';
import CustomHeaderTitle from './components/HeaderTitle';
import MessageBubble from '@/app/Components/MessageBubble';
import * as Clipboard from 'expo-clipboard';
import { LayoutAnimation, UIManager } from 'react-native';
import { t } from '../i18n';
import { playSound } from '../utils/playSound';
import { Ionicons } from '@expo/vector-icons';
import { getUserImageUrl } from '../utils/getUserImageUrl';
import { getSocket } from '../utils/socket';
import { fetchUser } from '../utils/user';
import emitter from "@/app/utils/eventEmitter";
// import arrayToObject from "@/app/functions/arraytoobject"

export default function Messages() {
  // Enable on Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  function arrayToObject(array, keyField) {
    return array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});
  }
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [participants, setParticipants] = useState<{ id: string, name: string }[] | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null | false>(null)
  const [otherParticipant, setOtherParticipant] = useState('')
  const [reply, setReply] = useState<string | null>(null);
  const [edit, setEdit] = useState<string | null>(null)
  const navigation = useNavigation()
  const route = useRoute<Object[{}]>();
  const isFocused = useIsFocused();
  const conversation: string = route.params?.conversationId
  const [messages, setMessages] = useState<Message[]>([]);
  const messageMap = useMemo(() => arrayToObject(messages, "id"), [messages]);
  const socketRef = useRef<Socket | null>(null);
  const [page, setPage] = useState(1); // Start from page 1
  const [loading, setLoading] = useState(false); // Prevent multiple loading triggers
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [end, setEnd] = useState(false)

  const onContentSizeChange = (contentWidth: number, contentHeight: number) => {
    // If content is taller than screen, enable loadMore
    if (contentHeight > screenHeight) {
      setCanLoadMore(true);
    }
  };
  const onScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    // If we're not at the top (for inverted list), we can load more
    if (contentOffsetY <= -50 && !loading) { // -50 allows for a buffer
      setCanLoadMore(true);
    } else {
      setCanLoadMore(false);
    }
  };
  
  const preparedMessages = useMemo(() => {
    const sorted = Object.values(messages).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  
    const enhanced = sorted.map((msg, index) => {
      const prev = index > 0 ? sorted[index - 1] : null;
  
      const currentTime = new Date(msg.created_at);
      const prevTime = prev ? new Date(prev.created_at) : null;
  
      const isDifferentSender = !prev || msg.sender_id !== prev.sender_id;
      const timeGap = prevTime
        ? (currentTime - prevTime) / (1000 * 60) // in minutes
        : Infinity;
  
      const showAvatar = isDifferentSender || timeGap >= 10;
  
      // Calculate the time to show (null if timeGap < 10 mins)
      let time = null;
  
      if (!prevTime || timeGap >= 10) {
        const now = new Date();
        const current = new Date(currentTime);
      
        const isToday = current.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = current.toDateString() === yesterday.toDateString();
      
        const timePart = current.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      
        if (isToday) {
          time = timePart;
        } else if (isYesterday) {
          time = `Yesterday ${timePart}`;
        } else {
          const datePart = current.toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          time = `${datePart} ${timePart}`;
        }
      }
      
  
      return {
        ...msg,
        showAvatar,
        time, // ← attach formatted time
      };
    });
  
    return enhanced.reverse(); // Newest first
  }, [messages]);
  
  
  const dbUpdateHandler = (payload) => {
    if (payload.data.conversation_id != conversation) return;

    console.log('🔔 Database update received in messages:');
    emitter.emit('updateUnreadMessages', {
      conversationId: conversation,
      unreadMessages: 0,
    });

    if (payload.type === 'insert') {
      console.log('📥 Insert operation detected');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, payload.data]);

    } else if (payload.type === 'update') {
      console.log('🔄 Update operation detected');
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === String(payload.data.id) ? payload.data : msg
        )
      );

    } else if (payload.type === 'delete') {
      console.log('🗑️ Delete operation detected');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== String(payload.data.id))
      );
    } else {
      console.warn('⚠️ Unknown operation type:', payload.type);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversation) return;

    if (conversation) {
      socket.emit('join_conversation', { conversationId: conversation });
      emitter.on("connected", () => {
        socket.emit('get_unread_messages', { conversationId: conversation });
        console.log("Connected");
      });

      socket.on('new_message', (msg) => {
        console.log('📩 Message:', msg);
      });

      socket.on("unread_messages", (payload) => {
        console.log(payload);
        payload?.array.forEach((m: { id: any; }) => {
          setMessages((prev) => {
            const updatedMessages = { 
              ...prev, 
              [m.id]: m
            };
            console.log('Updated messages after insert:', updatedMessages);
            return updatedMessages;
          });
        });
      });
      


      emitter.on('db_update', dbUpdateHandler);
    }

    return () => {
      socket.off('new_message');
      emitter.off('db_update', dbUpdateHandler);
    };
  }, [conversation]);
  
  const loadMoreMessages = async (initialLoad = false) => {
    if (loading || (initialLoad && page > 1)) return; // Prevent multiple simultaneous fetches or duplicate initial load
    setLoading(true);
  
    try {
      const user = await fetchUser();
      setUser(user);
  
      const response = await fetch(`http://${host}/api/messages/fetch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: route.params?.conversationId, page }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (data.messages.length > 0) {
        setMessages((prev) => {
          const newMessages = data.messages.filter(
            (msg) => !prev.some((existingMsg) => existingMsg.id === msg.id)
          ); // Filter out duplicates
          return [...newMessages, ...prev]; // Prepend new messages
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setEnd(true);
      }
    } catch (err) {
      console.log('Error loading more messages:', err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMoreMessages(true); // Ensure this is only called once during the initial render
  }, [conversation]);
  

  const imageUrl = getUserImageUrl(otherParticipant.id)
  type RootStackParamList = {
    Messages: { conversationId: string }
  }
  type MessagesRouteProp = RouteProp<RootStackParamList, 'Messages'>;
  interface Message {
    id: string;
    sender_id: string;
    message: string;
    reply?: string;
  }


  // A function to send messages
  async function sendMessage() {
    console.log(message)
    if (edit) {
      fetch(`http://${host}/api/messages`, {
        method: 'put',
        headers: { 'Authorization': `Bearer ${user?.token}`, 'Content-type': 'application/json' },
        body: JSON.stringify([edit, message])
      }).then((data) => data.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
    } else {
      try {
        console.log({ token: user?.token, conversationId: conversation, senderId: user?.userId, message, reply: reply });

        const response = await fetch(`http://${host}/api/messages`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user?.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: conversation, senderId: user?.userId, message: message, reply: reply }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Message sent successfully:', data);
          playSound('success')
        } else {
          console.error('Error response:', data);
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
    setReply(null)
    setEdit(null)
    setMessage('')
  }
  // Functions to update message state
  function likeMessage(messageId: string) {
    fetch('../../api/messages/react', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify([messageId, '👍'])
    }).then((data) => data.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    console.log(messages)
    // Close the modal
    setSelectedMessage('')


  }
  function replyMessage(messageId: string) {
    setReply(messageId)
    setSelectedMessage(null)
  }
  function editMessage(messageId: string) {

    setEdit(selectedMessage)
    setSelectedMessage(false)
    console.log(selectedMessage)

  }
  function deleteMessage(messageId: string) {
    fetch(`http://${host}/api/messages`, {
      method: 'delete',

      headers: { 'Content-type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
      body: JSON.stringify(messageId)
    }).then((data) => data.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err))

    //Close the modal
    setSelectedMessage(null)
  }
  //Change the header to the user name
  useLayoutEffect(() => {


  }, [navigation])


  const renderMessage = ({ item }) => (
    <View key={item.id}>
    {/* Show timestamp if it exists */}
    {item.time && (
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    )}
    <View
      key={item.id}
      style={[
        item?.sender_id === user?.userId ? styles?.myMessage : styles?.theirMessage,
      ]}
    >
      {(() => {
        const replyName = messageMap?.[item.reply]
          ? participants?.[messageMap[item.reply]?.sender_id]?.name || null
          : null;
        return (
          <View>
            {preparedMessages[item.id]}
            <TouchableOpacity onLongPress={() => setSelectedMessage(item.id)}>
              <MessageBubble
                item={item}
                reply={messageMap?.[item.reply]?.message || null}
                replyName={replyName}
              />
            </TouchableOpacity>
            <Modal
              transparent
              visible={selectedMessage == item.id}
              animationType="slide"
              onRequestClose={() => setSelectedMessage(false)}
            >
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setSelectedMessage(false)}
              >
                <View style={styles.popup}>
                  <TouchableOpacity onPress={() => replyMessage(item.id)}>
                    <Text style={styles.option}>Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editMessage(item.id)}>
                    <Text style={styles.option}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteMessage(item.id)}>
                    <Text style={styles.option}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copy(item.message)}>
                    <Text style={styles.option}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        );
      })()}
    </View>
    </View>
  );

  

  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
<FlatList
  inverted
  data={preparedMessages}
  renderItem={renderMessage}
  keyExtractor={(item) => String(item.id)}
  style={styles.chatArea}
  contentContainerStyle={{ padding: 10 }}
  onEndReached={!end ? () => loadMoreMessages(false) : () => {}} // Trigger loading more messages
  onEndReachedThreshold={0.1} // Trigger when 10% of the list is visible
  ListFooterComponent={
    loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    ) : null
  } // Show loading animation
/>


      {edit ? <MessageBubble item={messageMap[edit]} /> : null}
      <View style={styles.inputArea}>
        <TouchableOpacity style={{ padding: 20 }} onPress={()=>{}}>
          <Text>Hi</Text>
        </TouchableOpacity>
        <View style={styles.inputAreaInner}>
          {reply ? (
            <View
              style={{
                backgroundColor: "rgba(0, 13, 255, 0.17)",
                borderRadius: 10,
                padding: 5,
              }}
            >
              <Text style={{ color: "red", fontSize: 12 }}>Hello world</Text>
              <Text style={{ fontSize: 12 }}>{messageMap[reply].message}</Text>
            </View>
          ) : null}
          <TextInput
            placeholder={t("type_a_message")}
            value={message}
            onChangeText={setMessage}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "white" }}>{t("send")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  chatArea: { flex: 1 },
  messageBubble: {
    backgroundColor: '#e5e5ea',
    borderRadius: 10,
    margin: 5,
    alignSelf: 'flex-start',
  },
  myMessage: {
    alignSelf: 'flex-end',
    width: 'auto'
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  inputAreaInner: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20, paddingHorizontal: 5,
    paddingVertical: 10,
    marginRight: 10,
  },
  textInput: {
    outlineColor: '#ffffff',
    padding: 5

  },
  sendButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  }, image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageOptions: {
    // position: 'absolute',
    zIndex: 5,
    left: '100%',
    flex: 1
  }, overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 13, 255, 0.17)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    width: 150,
  },
  option: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
    timeWrapper: {
      alignItems: 'center',
      marginVertical: 10,
    },
    timeText: {
      fontSize: 12,
      color: '#888',
      backgroundColor: '#EEE',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    loadingContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  
});

function copy(message: string): void {
  if (message) {
    Clipboard.setStringAsync(message)
      .then(() => {
        ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
      })
      .catch((err) => {
        console.error('Failed to copy message:', err);
        alert('Failed to copy message.');
      });
  }
}
