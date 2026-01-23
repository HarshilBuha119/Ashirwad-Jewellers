import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Keyboard } from "react-native"; // Added Keyboard
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../theme/Colors";

export default function CustomTabBar({ state, navigation }) {
  // 1. Create a state to track keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // 2. Set up listeners
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // 3. If keyboard is visible, return null (renders nothing)
  if (keyboardVisible) return null;

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            {route.name === "Products" ? (
              <Feather
                name="shopping-bag"
                size={24}
                color={isFocused ? Colors.text : "#8e8e93"}
              />
            ) : (
              <Ionicons
                name={
                  route.name === "Home"
                    ? isFocused ? "home" : "home-outline"
                    : isFocused ? "person" : "person-outline"
                }
                size={26}
                color={isFocused ? Colors.text : "#8e8e93"}
              />
            )}

            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  labelFocused: {
    color: Colors.text,
    fontWeight: "600",
  },
});
