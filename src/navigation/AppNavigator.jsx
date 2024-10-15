import React, {useState} from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Home from '../screens/Home';
import About from '../screens/About';
import Details from '../screens/Details';
import Contact from '../screens/Contact';
import Translation from '../screens/Translation';
import VolumePage from '../screens/VolumePage';
import PlayAudio from '../screens/PlayAudio';
export default function AppNavigator() {
  const Stack = createStackNavigator();

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS, // Smooth transition
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="PlayAudio" component={PlayAudio} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Translation" component={Translation} />
        <Stack.Screen name="VolumePage" component={VolumePage} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </>
  );
}
