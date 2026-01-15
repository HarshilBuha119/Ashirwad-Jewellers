import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

export default function ProfileOption({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.left}>
        {item.icon === "upload" ? <AntDesign name="upload" color="#000" size={24} /> : <Ionicons
          name={item.icon}
          size={22}
          color={Colors.primary}
        />}

        <Text style={styles.title}>{item.title}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.muted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.sm,

    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: Spacing.md,
    color: Colors.primary,
  },
});
