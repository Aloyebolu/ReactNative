import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // 🔐 Clear stored token/user
      router.replace('/auth'); // 🚪 Redirect to login screen
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  return logout;
};
