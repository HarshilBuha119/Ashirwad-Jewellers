import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import Colors from "../theme/Colors"; // Make sure to import your Colors

export default function HomeHeader() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 5 }}>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.name}>{user?.displayName || "Guest"}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} />
        </TouchableOpacity>
        
        <TouchableOpacity style={{ marginLeft: 14 }}>
          <Ionicons name="notifications-outline" size={22} />
        </TouchableOpacity>

        {/* CART BUTTON WITH BADGE */}
        <TouchableOpacity 
          style={{ marginLeft: 14 }} 
          onPress={() => navigation.navigate("Cart")}
        >
          <View>
            <Ionicons name="bag-handle-outline" color="#000" size={24} />
            {cartCount > 0 && (
              <View style={styles.badge}>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  name: {
    fontSize: 22, // Reduced slightly to balance with icons
    fontWeight: "700",
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  // BADGE STYLES
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#F97316", // Your orange/primary color
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
});