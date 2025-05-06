// utils/room.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '@/constants/Env';

export const fetchRoomData = async (roomId) => {
  try {
    // Get user from AsyncStorage
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};

    if (!user.userId || !user.token) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`http://${host}/api/rooms/fetch`, {
        method: "post",
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({userId : user.userId, roomId})
    });

    const data = await response.json();

    return data.participants
  } catch (err) {
    console.error('fetchRoomData error:', err);
    return null
  }
};
