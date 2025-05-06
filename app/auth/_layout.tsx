import React, { useContext, useEffect } from 'react';
import { SignupProvider, SignupContext } from '../context/SignupContext';
import WelcomeScreen from './screens/WelcomeScreen';
import BasicInfoScreen from './screens/BasicInfoScreen';
import CountrySelectScreen from './screens/CountrySelectScreen';
import PasswordScreen from './screens/PasswordScreen';
import FinalConfirmationScreen from './screens/FinalConfirmationScreen';
import {  useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import SignUp from './signUp';
import LoginScreen from './login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import more screens...

function MainFlow() {
  const { step } = useContext(SignupContext);

  switch (step) {
    case 0: return <WelcomeScreen />;
  case 1: return <BasicInfoScreen />;
  case 2: return <CountrySelectScreen />;
  case 3: return <PasswordScreen />;
  case 4: return <FinalConfirmationScreen />;

    default:
      return <WelcomeScreen />;
  }
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </NavigationIndependentTree>
  );
}
