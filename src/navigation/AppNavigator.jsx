import React, { useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from '../screens/Home';
import About from '../screens/About';
import VolumeCat from '../screens/VolumeCat';
import Contact from '../screens/Contact';
import Translation from '../screens/Translation';
import VolumePage from '../screens/VolumePage';
import MediaPlayer from '../screens/MediaPlayer';
import { StatusBar } from 'react-native';

export default function AppNavigator() {
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar backgroundColor={'#F5FAFD'} barStyle={'dark-content'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // Smooth transition
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Translation" component={Translation} />
        <Stack.Screen name="VolumePage" component={VolumePage} />
        <Stack.Screen name="VolumeCat" component={VolumeCat} />
        <Stack.Screen name="MediaPlayer" component={MediaPlayer} />
      </Stack.Navigator>
    </>
  );
}
