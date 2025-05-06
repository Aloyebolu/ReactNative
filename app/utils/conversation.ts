import { Alert } from 'react-native';
import { router } from 'expo-router';
import host from '@/constants/Env';
import { fetchUser } from './user';
import { t } from '../i18n';

export const startConversation = async (
  input: string | string[],
  currentUserId: string | null
) => {
  try {
    const user = await fetchUser()
    currentUserId = user.userId
    // Normalize to array if single user ID is passed
    const otherParticipants = Array.isArray(input) ? input : [input];

    // Combine currentUserId with others
    const allParticipants = [currentUserId, ...otherParticipants];

    const payload = allParticipants.map((userId, index) => ({
      userId,
      role: allParticipants.length > 2 && index === 0 ? 'admin' : 'member',
    }));

    const type = allParticipants.length > 2 ? 'group' : 'private';

    const response = await fetch(`http://${host}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants: payload, type }),
    });

    const data = await response.json();

    if (response.ok) {
        router.push({
            pathname: '/chat/Messages',
            params: {
              conversationId: data.conversationId,
            //   user: JSON.stringify(participantId),
            },
          });
    } else {
      console.log(t(data.code))
    }
    console.log(payload)
  } catch (error) {
    console.error('❌ Conversation start error:', error);
    Alert.alert('Error', 'Something went wrong');
  }
};
