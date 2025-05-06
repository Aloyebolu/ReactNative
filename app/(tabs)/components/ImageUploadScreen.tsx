import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import host from '@/constants/Env';

export default function ImageUploader() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No image selected!');
      return;
    }

    setLoading(true);
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    const fileUri = fileInfo.uri;
    const fileName = fileUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    const formData = new FormData();
    formData.append('image', {
      uri: fileUri,
      name: fileName,
      type: `image/${fileType}`,
    });
    formData.append('json', JSON.stringify('10000012'));

    try {
      const response = await axios.post(`http://${host}/api/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Upload Successful', `Image ID: ${response.data.imageId}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <AntDesign name="pluscircleo" size={50} color="#999" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.uploading]}
        onPress={uploadImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>Upload Image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#990',
    borderRadius: 10,
    width: 200,
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    backgroundColor: '#990',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#660',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploading: {
    opacity: 0.7,
  },
});
