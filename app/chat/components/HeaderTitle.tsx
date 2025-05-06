import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
const CustomHeaderTitle = ({ data, imageUrl }: {  data?: { id: string; name: string }; imageUrl: string }) => {
    const navigation = useNavigation()
      const goToProfile = (userId: string) => {
        router.push({
              pathname: '/profile/Profile',
              params: {
                personId: data.id,// convert object to string
              },
            });
      };
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={goToProfile}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            
        </TouchableOpacity>
        <Text style={styles.title}>{data.name }</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});
export default CustomHeaderTitle