import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

export default function CustomTabBar({ state, navigation }) {
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
            {/* ICON */}
            {route.name === "Products" ? (
              <Feather
                name="shopping-bag"
                size={24}
                color={isFocused ? "#000" : "#8e8e93"}
              />
            ) : (
              <Ionicons
                name={
                  route.name === "Home"
                    ? isFocused
                      ? "home"
                      : "home-outline"
                    : isFocused
                    ? "person"
                    : "person-outline"
                }
                size={26}
                color={isFocused ? "#000" : "#8e8e93"}
              />
            )}

            {/* LABEL */}
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
    color: "#000",
    fontWeight: "600",
  },
});
