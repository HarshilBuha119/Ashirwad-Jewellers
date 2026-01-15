import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import AppImage from "./AppImage";
import FastImage from "@d11/react-native-fast-image";

export default function CategoryItem({ item, isSelected, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.imageWrapper, 
        isSelected && styles.imageWrapperSelected
      ]}>
        <AppImage 
          source={item.image} 
          style={styles.image} 
          resizeMode={FastImage.resizeMode.cover} 
        />
      </View>
      <Text style={[
        styles.text, 
        isSelected && styles.textSelected
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  imageWrapper: {
    padding: 3, // Space for the border
    borderRadius: 120,
    borderWidth: 2,
    borderColor: "transparent", // Default invisible border
    marginBottom: 6,
  },
  imageWrapperSelected: {
    borderColor: "#D4AF37", // Gold border when selected
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 120,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  textSelected: {
    color: "#111827",
    fontWeight: "800",
  },
});