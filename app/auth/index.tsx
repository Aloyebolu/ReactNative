import { Link, Stack } from 'expo-router';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import host from '@/constants/Env';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';

export default function NotFoundScreen() {
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const navigation = useNavigation()

    async function login(event): Promise<void> {
      try {
        // Replace with your API endpoint
        const apiEndpoint = `http://${host}/api/auth/login`;

        // Example payload, replace with actual input values
        const payload = {
          email: 'muuna@gmail.com',
          password: 'nicki' // Replace with actual email input value
        };
        setLoggingIn(true)
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error('Failed to login');
        }

        const data = await response.json();
        if(data.status == 'success'){
          await AsyncStorage.setItem('user', JSON.stringify(data.data));
          setLoggingIn(false)
        }
        // Store user data in AsyncStorage

        console.log('User logged in successfully:', data.data);
        
      } catch (error) {
        console.error('Login error:', error);
      }
    }
    useEffect(()=>{
      async function checkUser(){
        let d : string | null = await AsyncStorage.getItem('user')
        d  = JSON.parse(d)
        if(d){
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: '(tabs)'}]
            })
          )
        }
      }
      checkUser()
    }, [])
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Input Your Email</Text>
        <TextInput style={styles.input}></TextInput>
        <TouchableOpacity style={styles.button} onPress={login} disabled={loggingIn}>
          {loggingIn?(
            <ActivityIndicator color="#fff"/>
           ) :
           <Text style={styles.text}>Login</Text>

          }
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    color: 'white'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },text : {
    color: 'white'
  },input : {
    color: 'white',
    borderColor: 'white',
    borderWidth: 2,
    padding:4,
    borderRadius: 10
  }, button : {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center'
  }
});
