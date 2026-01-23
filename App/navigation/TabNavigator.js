/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomFabBar } from 'rn-wave-bottom-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../theme/Colors';
import Animated from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

const tabBarIcon = (name) => ({ focused }) => (
  <Ionicons
    name={name}
    size={26}
    color={'#FFFFFF'}
  />
);

export default function MainTabs() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'black',
        tabBarActiveBackgroundColor: Colors.text,
        tabBarHideOnKeyboard: true,
        headerShadowVisible: false
      }}
      tabBar={(props) => {
        if (isKeyboardVisible) return null;

        return (
          <BottomFabBar
            mode="default"
            focusedButtonStyle={styles.fabShadow}
            bottomBarContainerStyle={styles.bottomBarContainer}
            {...props}
            springConfig={Animated.SpringConfig}
          />
        );
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: tabBarIcon('home-outline'),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarIcon: () => (
            <Feather
                name="shopping-bag"
                size={24}
                color={"#FFF"}
              />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
         tabBarIcon: () => (
            <Feather
                name="user"
                size={24}
                color={"#FFF"}
              />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#FFF',
  },
  fabShadow: {
    backgroundColor: Colors.text,
  },
})