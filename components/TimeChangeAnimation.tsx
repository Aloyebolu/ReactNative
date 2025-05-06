import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useTimeAgo } from '@/app/utils/useTimeAgo';
import { MaterialIcons } from '@expo/vector-icons'; // Clock icon library

export default function TimeAgoText({ timestamp }) {
  const timeAgo = useTimeAgo(timestamp);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [timeAgo]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="access-time" size={20} color="#888" />
      <Animated.Text style={[styles.timeText, { opacity: fadeAnim }]}>
        {timeAgo}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5, 
    fontSize: 16, 
    color: '#333',
  }
});
