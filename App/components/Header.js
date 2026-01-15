import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

export default function Header({ name }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.icons}>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
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
  welcome: {
    fontSize: 14,
    color: Colors.muted,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  icons: {
    flexDirection: "row",
  },
});
