import React, { memo, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppImage from "./AppImage";
import { useNavigation } from "@react-navigation/native";
import { useToggleFavorite } from "../hooks/useStore";
import FastImage from "@d11/react-native-fast-image";

const ProductCard = memo(({ item, grid, isFav }) => {
  const navigation = useNavigation();
  const { mutate: toggleFav } = useToggleFavorite();

  // 1. Setup Animated Values
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 2. The Animation Function
  const animateHeart = () => {
    // Sequence: Scale up slightly, then back to normal
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true, // Uses GPU for zero lag
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Trigger animation if the status changes from outside (optional)
  useEffect(() => {
    if (isFav) animateHeart();
  }, [isFav]);

  const handleFavorite = () => {
    animateHeart(); // 3. Instant Visual Feedback
    toggleFav({ productId: item.id, isFav });
  };

  return (
    <View style={[styles.card, grid && styles.gridCard]}>
      <TouchableOpacity 
        style={styles.heart} 
        onPress={handleFavorite} 
        activeOpacity={1} // Prevents default flicker
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={26}
            color={isFav ? "#EF4444" : "#111827"}
          />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        <AppImage source={{ uri: item.main_image }} style={styles.image} resizeMode={FastImage.resizeMode.contain}/>
        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        <Text style={styles.brand}>by {item.brand}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.isFav === nextProps.isFav && prevProps.grid === nextProps.grid;
});

export default ProductCard;

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    height: 20,
  },
  card: {
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginRight: 16,
  },
  gridCard: {
    width: "48%",
    marginBottom: 16,
  },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
    marginBottom: 8,
    borderRadius: 12

  },
  brand: {
    fontSize: 12,
    color: "#9CA3AF",
    marginVertical: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
}); 