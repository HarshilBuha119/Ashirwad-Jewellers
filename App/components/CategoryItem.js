import React, { memo } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import AppImage from "./AppImage";
import FastImage from "@d11/react-native-fast-image";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

// We wrap the component in memo() right at the definition
const CategoryItem = memo(({ item, isSelected, onPress }) => {
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
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  imageWrapper: {
    padding: 3, 
    borderRadius: 100, 
    borderWidth: 2,
    borderColor: "transparent", 
    marginBottom: Spacing.xs,
  },
  imageWrapperSelected: {
    borderColor: Colors.text, 
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 100,
    backgroundColor: Colors.border, 
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted, 
  },
  textSelected: {
    color: Colors.text,
    fontWeight: "800",
  },
});

export default CategoryItem;