import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Images } from "../../assets/images";
import AppImage from "./AppImage";
import FastImage from "@d11/react-native-fast-image";
import { useNavigation } from "@react-navigation/native";

export default function PromoBanner() {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <AppImage
        source={Images.Poster}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover} />

      <View style={styles.overlay}>
        <Text style={styles.discount}>Up to 40% Off</Text>
        <Text style={styles.date}>Oct 28 - Nov 28</Text>
        <Text style={styles.title}>Get Special Offer</Text>

      </View>
      <TouchableOpacity style={styles.button}>
        <Text onPress={() => navigation.navigate("Products")} style={styles.buttonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    height: 160,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    left: 16,
    top: 20,
  },
  discount: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  date: {
    fontSize: 12,
    color: "#E5E7EB",
    marginVertical: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  button: {
    position: "absolute",
    backgroundColor: "#F97316",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-end",
    bottom: 20,
    right: 20
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
