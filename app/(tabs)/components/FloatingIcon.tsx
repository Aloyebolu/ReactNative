import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const EDGE_MARGIN = 30;
const TOP_PROTECTED = 200;

const FloatingDraggableButton = ({ onPress }) => {
  const translateX = useSharedValue(SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN);
  const translateY = useSharedValue(SCREEN_HEIGHT / 2);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      let newX = ctx.startX + event.translationX;
      let newY = ctx.startY + event.translationY;

      // Keep within horizontal bounds
      if (newX < EDGE_MARGIN) newX = EDGE_MARGIN;
      if (newX > SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN) newX = SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN;

      // Keep within vertical bounds and above 200px zone
      if (newY < TOP_PROTECTED) newY = TOP_PROTECTED;
      if (newY > SCREEN_HEIGHT - BUTTON_SIZE - EDGE_MARGIN) newY = SCREEN_HEIGHT - BUTTON_SIZE - EDGE_MARGIN;

      translateX.value = newX;
      translateY.value = newY;
    },
    onEnd: () => {
      translateX.value = withSpring(
        translateX.value < SCREEN_WIDTH / 2
          ? EDGE_MARGIN
          : SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView>
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.button, animatedStyle]}>
        <Ionicons name="add" size={28} color="#fff" onPress={onPress} />
      </Animated.View>
    </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
  },
});

export default FloatingDraggableButton;
