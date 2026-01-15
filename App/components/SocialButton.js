import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Colors from "../theme/Colors";

export default function SocialButton({
  icon,
  text,
  backgroundColor,
  textColor,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.icon}>{icon}</View>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  icon: {
    position: "absolute",
    left: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
