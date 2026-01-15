import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";
import AppImage from "./AppImage";

export default function ProfileHeader({ user }) {
  console.log(user?.providerData?.[0]?.photoURL);
  
  return (
    <View style={styles.container}>
      <AppImage
        source={{
          uri:
            user?.providerData?.[0]?.photoURL,
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {user?.displayName || "Guest User"}
      </Text>

      <Text style={styles.email}>
        {user?.email || "guest@email.com"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  email: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
  },
});
