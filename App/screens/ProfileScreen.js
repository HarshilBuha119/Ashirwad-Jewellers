import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Loader from "../components/Loader";
import ProfileHeader from "../components/ProfileHeader";
import ProfileOption from "../components/ProfileOption";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";
import { profileOptions } from "../data/profileData";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);        // 🔥 SHOW LOADER
              await logout();          // 🔥 LOGOUT ACTION
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);       // 🔥 HIDE LOADER
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader user={user} />
      <Loader visible={loading} />
      <View style={styles.list}>
        {profileOptions.map((item) => (
          <ProfileOption
            key={item.id}
            item={item}
            onPress={() => {
              if (item.title === "My Orders") {
                navigation.navigate("Orders");
                return;
              }

              if (item.title === "Upload Jewellary") {
                navigation.navigate("UploadJewellary");
                return;
              }

              if (
                item.title === "Wishlist" ||
                item.title === "Favourites" ||
                item.icon === "heart-outline"
              ) {
                navigation.navigate("Favorites");
              }
            }}
          />
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
  logoutButton: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    marginBottom: 120, // for floating tab bar
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
});
