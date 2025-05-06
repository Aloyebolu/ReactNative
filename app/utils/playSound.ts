import { Audio } from 'expo-av';
import soundMap from '../sound-config/sounds';

export const playSound = async (soundName: string) => {
  const soundFile = soundMap[soundName];
  if (!soundFile) return;

  const { sound } = await Audio.Sound.createAsync(soundFile);
  await sound.playAsync();

  // Optional: unload after playing to save memory
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
};
