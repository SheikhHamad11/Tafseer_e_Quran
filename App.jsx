import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { QuranContextApi } from './src/hook/contextApi';
export default function App() {
  return (
    <NavigationContainer>
      <QuranContextApi>
        <AppNavigator />
      </QuranContextApi>
    </NavigationContainer>
  );
}
