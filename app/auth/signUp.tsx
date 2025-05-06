import React, { useContext, useEffect } from 'react';
import { SignupProvider, SignupContext } from '../context/SignupContext';
import WelcomeScreen from './screens/WelcomeScreen';
import BasicInfoScreen from './screens/BasicInfoScreen';
import CountrySelectScreen from './screens/CountrySelectScreen';
import PasswordScreen from './screens/PasswordScreen';
import FinalConfirmationScreen from './screens/FinalConfirmationScreen';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
export default function SignUp() {
  return (
    <SignupProvider>
      <MainFlow />
    </SignupProvider>
  );
}
