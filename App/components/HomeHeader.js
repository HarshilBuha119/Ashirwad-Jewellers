import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

// Centralized Hook
import { useCart } from "../api/orderApi";

// Theme
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

export default function HomeHeader() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  
  // 1. Using centralized hook (No more direct service imports)
  const { data: cartItems = [] } = useCart();

  // 2. Logic Optimization: Memoize the count calculation
  const cartCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantity, 0), 
  [cartItems]);

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Welcome 👋</Text>
        <Text style={styles.userNameText}>{user?.displayName || "Guest"}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Products")}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={22} color={Colors.black} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconMargin}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconMargin}
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.7}
        >
          <View>
            <Ionicons name="bag-handle-outline" color={Colors.black} size={24} />
            {cartCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: { 
    marginTop: Spacing.xs 
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.muted,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.primary, // Using primary for the name
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: { 
    marginLeft: Spacing.md 
  },
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: Colors.text, // Your theme's specific text color (orange/brown)
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "bold",
  },
});