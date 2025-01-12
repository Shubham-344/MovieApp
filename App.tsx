/* eslint-disable react/no-unstable-nested-components */
import { Image, View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import './global.css';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen, { Show } from './HomeScreen';
import SearchScreen from './SearchScreen';
import Details from './Details';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// SplashScreen Component
const SplashScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Image source={require('./assets/video.png')} style={{ width: 100, height: 100 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Movie.Anytime.Anywhere</Text>
    </View>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/home.png')} className="h-5 w-5" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => (
            <Image source={require('./assets/search.png')} className="h-5 w-5" />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Hide the SplashScreen after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        {/* Details Screen */}
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
