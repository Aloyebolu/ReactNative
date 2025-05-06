import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const initiateConversation = async (
  userIds: string[], // Array of participant user IDs
  token: string,
  navigation: any
) => {
  try {
    const response = await fetch('http://<your-backend>/api/conversations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participants: userIds }),
    });

    const data = await response.json();

    if (response.ok) {
      // Navigate to Chat screen with new conversation ID
      navigation.navigate('messages', { conversationId: data.conversationId });
    } else {
      Alert.alert('Error', data.error || 'Failed to create conversation');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong');
    console.error(error);
  }
};
