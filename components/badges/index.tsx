import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { badgeMap } from './badgeData';

interface Props {
  type: keyof typeof badgeMap;
  size?: number;
}

const Badge: React.FC<Props> = ({ type, size = 7 }) => {
    const [childWidth, setChildWidth] = useState(0);
  const badge = badgeMap[type];
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === 'vvip') {
      Animated.loop(
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [type]);

  if (!badge) return null;

  const sparkleStyle = {
    transform: [
      {
        rotate: sparkleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
    opacity: 0.5,
    position: 'absolute',
    top: -5,
    right: -5,
  };

  return (
    <View style={[styles.badge, { backgroundColor: badge.color, height: size + 12, borderRadius: 50}]}>
      {type === 'vvip' && (
        <Animated.View style={sparkleStyle}>
          <Icon name="sparkles-outline" size={size * 1.2} color="#fff" />
        </Animated.View>
      )}

      <Icon name={badge.icon} size={size} color="white" />
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 1.3,
            textShadowColor: '#fff',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          },
        ]}
        onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            setChildWidth(width);
          }}
      >
        {badge.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 4,
    position: 'relative',
    width: 'auto',
  },
  text: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default Badge;
