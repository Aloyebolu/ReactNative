import React, { useState } from 'react';
import { StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanGestureHandler } from 'react-native-gesture-handler';
import emitter from "@/app/utils/eventEmitter";

import Animated, {
    useSharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { getUserImageUrl } from '@/app/utils/getUserImageUrl';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 120;
const EDGE_MARGIN = 30;
const TOP_PROTECTED = 200;

const FloatingDraggableButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentRoom, setCurrentRoom] = useState();

    const translateX = useSharedValue(SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN);
    const translateY = useSharedValue(SCREEN_HEIGHT / 2);

    // Refresh when screen focuses
    useFocusEffect(
        React.useCallback(() => {
            const checkCurrentRoom = async () => {
                try {
                    console.log("Room change")
                    const currentRoomObject = await AsyncStorage.getItem('currentRoom');
                    const currentRoom = currentRoomObject ? JSON.parse(currentRoomObject) : null;

                    console.log(currentRoom);
                    setCurrentRoom(currentRoom);
                    setIsVisible(!!currentRoom); 
                } catch (err) {
                    console.error('Error checking currentRoom:', err);
                }
            };

            checkCurrentRoom();
            emitter.on('roomChanged', checkCurrentRoom)
        }, [])
    );

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            let newX = ctx.startX + event.translationX;
            let newY = ctx.startY + event.translationY;

            // Clamp horizontal movement
            newX = Math.max(EDGE_MARGIN, Math.min(SCREEN_WIDTH - BUTTON_SIZE - EDGE_MARGIN, newX));
            // Clamp vertical movement and protect top 200px
            newY = Math.max(TOP_PROTECTED, Math.min(SCREEN_HEIGHT - BUTTON_SIZE - EDGE_MARGIN, newY));

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

    const onPress = () =>{
        router.push('room')
        console.log("Hello")
    }
    if (!isVisible) return null;

    return (
            <PanGestureHandler onGestureEvent={gestureHandler} >
        {/* <TouchableOpacity onPress={onPress} style={{zIndex: 999}}> */}

                <Animated.View style={[styles.button, animatedStyle]}>
                    <Image
                        source={{ uri: getUserImageUrl(currentRoom?.holderId) }}
                        style={styles.image}
                    />
                </Animated.View>
        {/* </TouchableOpacity> */}
            </PanGestureHandler>
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
        padding: 3,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
    },
});

export default FloatingDraggableButton;
