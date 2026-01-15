import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserFavorites } from '../hooks/useStore';
import Colors from "../theme/Colors";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function FavoritesScreen({ navigation }) {
  const { data: favorites, isLoading, error } = useUserFavorites();

  if (isLoading) return <Loader visible={true} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Favorites</Text>

        {/* spacer to balance header */}
        <View style={{ width: 24 }} />
      </View>

      {/* ===== CONTENT ===== */}
      {!favorites.length ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}                         // ✅ 2 per row
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}        // ✅ spacing between columns
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard item={item} grid={true} isFav={true}/>
          )}
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding:20
  },

  /* ===== HEADER ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    marginBottom:30
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  /* ===== EMPTY STATE ===== */
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },

  /* ===== LIST ===== */
  list: {
    paddingBottom: 24,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
