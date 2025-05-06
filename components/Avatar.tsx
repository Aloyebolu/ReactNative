import { flagImages } from '@/app/utils/loadFlagFiles';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface AvatarProps {
    imageUrl: string;
    flagId: string;
    size?: number; // Optional size prop for avatar dimensions
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, flagId , size = 100 }) => {
    // const flag = require(`../assets/flags/${flagId}.png`); // Use require for static assets

    return (
        <View style={[styles.avatarContainer, { width: size, height: size }]}> {/* Use View for styling */}
            <Image
                source={{ uri: imageUrl }}
                style={[styles.avatarImage, { width: size, height: size }]}
            />
            <View style={styles.flagStyle }>
                <Image
                source={flagImages[flagId]} // Correctly use require for static assets
                style={[{ height: size * 0.28, width: size * 0.28 }]}
            />
            </View>
            
        </View>
    );
};

export default Avatar;

const styles = StyleSheet.create({
    avatarContainer: {
        position: 'relative',
        overflow: 'hidden',
    },
    avatarImage: {
        borderRadius: 999, // Circular image
        resizeMode: 'cover',
    },
    flagStyle: {
        position: 'absolute',
        bottom: '-1%',
        right: 0,
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
});