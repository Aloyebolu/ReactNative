import { t } from '@/app/i18n';
import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

const LiveRipple = ({ size = 40 }) => {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const dotSize = size * 0.3;
  const fadeAnim = new Animated.Value(0);
  useEffect(() => {
    // Create a continuous fade in/out animation
    const fadeInOut = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,   // Fade to fully visible
          duration: 400,  // Duration of fade-in (1 second)
          useNativeDriver: true,  // Use native driver for better performance
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,   // Fade to invisible
          duration: 700,  // Duration of fade-out (1 second)
          useNativeDriver: true,
        }),
      ]).start(() => fadeInOut());  // Repeat the sequence once it finishes
    };

    fadeInOut();  // Start the animation when the component mounts
  }, [fadeAnim]);


  return (
    <View style={[styles.container, {  height: size }]}>
      <Animated.View style={{opacity: fadeAnim}}>

      <Text style={{fontWeight: 'bold', color: '#ff0606', fontSize: size, textAlign: 'center' }}>{t('live')}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dot: {
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 999
  },text : {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    // transform: [{ translateX: -50 }, { translateY: -50 }],
  }
});

export default LiveRipple;
