import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { getUserImageUrl } from "../utils/getUserImageUrl";
import {fetchUser} from "../utils/user";
interface MessageBubbleProps {
  item: { message: string };
  reply?: string | null;
  replyName?: string | null;
}

const MessageBubble = ({ item, reply, replyName }: MessageBubbleProps) => {
  const currentStyle = bubbleStyles.find(style => style.id === 'dark-5');
  const [user, setUser] = useState()
  const { t } = useTranslation();

  // console.log(reply, replyName)
  useEffect(()=>{
    const get = async() =>{
      const user = await fetchUser()
      setUser(user)
    }
    get()
  }, [])


  return (
    <View style={styles.container}>
      <View style={{width: 40, height: 40}}>
{
        user?.userId == item?.sender_id ? null : item.showAvatar && (<Image source={{ uri: getUserImageUrl(item?.sender_id) }} style={styles.image}/>)
      }
      </View>
      
      
      <View
      style={[
        styles.messageBubble,
        currentStyle
          ? {
              backgroundColor: currentStyle.backgroundColor,
              borderColor: currentStyle.borderColor,
            }
          : {},
      ]}
    >
      {replyName ? (
        <View style={styles.reply}>
          <Text style={styles.textName}>{t('reply_to')} {replyName}</Text>
          <Text style={styles.textMessage}>{reply || ''}</Text>
        </View>
      ) : null}

      <Text style={[styles.messageText, { color: currentStyle?.textColor }]}>
        {item?.message || ''}
      </Text>
    </View>
    <View style={{width: 40, height: 40}}>
    {
        user?.userId !== item?.sender_id ? null : item.showAvatar &&(<Image source={{ uri: getUserImageUrl(item?.sender_id) }} style={styles.image}/>)
      }
      </View>
    </View>
    
  );
};

const bubbleStyles = [
  {
    id: 'light-1',
    name: 'Mint Midnight',
    backgroundColor: '#E1F7F5',
    textColor: '#003B3B',
    borderColor: '#A2DED0',
  },
  {
    id: 'light-2',
    name: 'Lavender Dream',
    backgroundColor: '#F3E8FF',
    textColor: '#4B0082',
    borderColor: '#B47BFF',
  },
  {
    id: 'light-3',
    name: 'Champagne Gold',
    backgroundColor: '#FFF9E6',
    textColor: '#6E4B00',
    borderColor: '#FFD700',
  },
  {
    id: 'light-4',
    name: 'Sky Navy',
    backgroundColor: '#E6F0FF',
    textColor: '#003366',
    borderColor: '#66A3FF',
  },
  {
    id: 'light-5',
    name: 'Blush Rosewood',
    backgroundColor: '#FFE6EC',
    textColor: '#801336',
    borderColor: '#FF8FA3',
  },
  {
    id: 'dark-1',
    name: 'Midnight Blue',
    backgroundColor: '#1A1A2E',
    textColor: '#EAEAEA',
    borderColor: '#16213E',
  },
  {
    id: 'dark-2',
    name: 'Deep Charcoal',
    backgroundColor: '#2C2C2C',
    textColor: '#FFFFFF',
    borderColor: '#3D3D3D',
  },
  {
    id: 'dark-3',
    name: 'Smoky Gray',
    backgroundColor: '#3A3B3C',
    textColor: '#D1D1D1',
    borderColor: '#5A5A5A',
  },
  {
    id: 'dark-4',
    name: 'Cyber Purple',
    backgroundColor: '#2E003E',
    textColor: '#E0D4F7',
    borderColor: '#7D3C98',
  },
  {
    id: 'dark-5',
    name: 'Dark Emerald',
    backgroundColor: '#002B29',
    textColor: '#B8FFF2',
    borderColor: '#00A89C',
  },
  {
    id: 'dark-6',
    name: 'Vanta Black',
    backgroundColor: '#0B0C10',
    textColor: '#C5C6C7',
    borderColor: '#1F2833',
  },
  {
    id: 'dark-7',
    name: 'Obsidian Shadow',
    backgroundColor: '#1E1E1E',
    textColor: '#EEEEEE',
    borderColor: '#2F2F2F',
  },
  {
    id: 'dark-8',
    name: 'Ash Violet',
    backgroundColor: '#2C1A2E',
    textColor: '#F5E6FF',
    borderColor: '#593C75',
  },
];

const styles = StyleSheet.create({
  messageBubble: {
    borderRadius: 10,
    margin: 5,
    alignSelf: 'flex-start',
    borderWidth: 2,
    zIndex: 20
  },
  messageText: {
    fontSize: 16,
    padding: 10,
  },
  reply: {
    backgroundColor: '#fefefef8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    padding: 5,
    elevation: 5,
  },
  textName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  textMessage: {
    fontSize: 12,
    color: '#140505',
    lineHeight: 10,
  },container : {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 10
  }, image : {
    width : "100%",
    height: "100%",
    borderRadius: 999
  }
});

export default MessageBubble;
