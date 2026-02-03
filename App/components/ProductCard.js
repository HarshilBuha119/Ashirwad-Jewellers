/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppImage from "./AppImage";
import { useNavigation } from "@react-navigation/native";
import { useToggleFavorite } from "../hooks/useStore";
import FastImage from "@d11/react-native-fast-image";

// Theme
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

const ProductCard = memo(({ item, grid, isFav, img, displayPrice }) => {
  const navigation = useNavigation();
  const { mutate: toggleFav } = useToggleFavorite();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animation logic for heart feedback
  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (isFav) animateHeart();
  }, [isFav]);

  const handleFavorite = () => {
    animateHeart();
    toggleFav({ productId: item.id, isFav });
  };

  const handleNavigate = () => {
    navigation.navigate("ProductDetail", { product: item });
  };

  return (
    <View style={[styles.card, grid && styles.gridCard]}>
      {/* Favorite Button Overlay */}
      <TouchableOpacity 
        style={styles.heart} 
        onPress={handleFavorite} 
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={24}
            color={isFav ? Colors.text : Colors.primary}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Main Product Content */}
      <TouchableOpacity onPress={handleNavigate} activeOpacity={0.9}>
        <AppImage 
          source={{ uri: item.main_image }} 
          style={[styles.image, img ? { height: img } : null]} 
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        <Text style={styles.brand}>by {item.brand}</Text>
        
        <Text style={styles.price}>
          ₹{displayPrice ? displayPrice.toLocaleString('en-IN') : item.price?.toLocaleString('en-IN')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  // Prevent re-renders unless these specific values change
  return (
    prevProps.isFav === nextProps.isFav && 
    prevProps.grid === nextProps.grid &&
    prevProps.displayPrice === nextProps.displayPrice &&
    prevProps.item.id === nextProps.item.id &&
    prevProps.img === nextProps.img
  );
});

const styles = StyleSheet.create({
  card: { 
    width: 170, 
    backgroundColor: Colors.white, 
    borderRadius: 20, 
    padding: Spacing.md, 
    marginRight: Spacing.md,
    // Add a slight shadow for depth since background is light grey
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom:10,
  },
  gridCard: { 
    width: "48%", 
    marginBottom: Spacing.md,
    marginRight: 0,
  },
  image: { 
    width: "100%", 
    height: 150, 
    marginBottom: Spacing.sm, 
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  heart: { 
    position: "absolute", 
    bottom: Spacing.sm, 
    right: Spacing.sm, 
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)", // Glass effect behind heart
    padding: 6,
    borderRadius: 20,
  },
  name: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: Colors.primary, 
    height: 20 
  },
  brand: { 
    fontSize: 12, 
    color: Colors.muted, 
    marginVertical: 2 
  },
  price: { 
    fontSize: 15, 
    fontWeight: "700", 
    marginTop: Spacing.xs,
    color: Colors.text 
  },
});

export default ProductCard;