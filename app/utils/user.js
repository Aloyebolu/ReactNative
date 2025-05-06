// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUser = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return {};
  }
};
