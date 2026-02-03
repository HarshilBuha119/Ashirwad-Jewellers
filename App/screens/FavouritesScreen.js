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

// ONLY using the hooks from the code you provided
import { useFavorites, useMetalRates } from "../api/orderApi"; // Adjust path if needed
import { calculateProductPrice } from "../utils/priceCalculator";

// Components
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Theme
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

export default function FavoritesScreen({ navigation }) {
  // 1. Fetch Favorites & Rates directly from your provided hooks
  const { data: favorites = [], isLoading: favLoading } = useFavorites();
  const { data: metalRates = [], isLoading: ratesLoading } = useMetalRates();

  // 2. Enrich the favorites with live prices
  const enrichedFavorites = favorites.map(item => ({
    ...item,
    calculatedPrice: calculateProductPrice(item, metalRates)
  }));

  if (favLoading || ratesLoading) return <Loader visible={true} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      {/* CONTENT */}
      {enrichedFavorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={60} color={Colors.muted} />
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={enrichedFavorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard 
              item={item} 
              grid={true} 
              isFav={true} 
              displayPrice={item.calculatedPrice} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  placeholder: { width: 24 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100 },
  emptyText: { marginTop: Spacing.md, fontSize: 16, color: Colors.muted },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  columnWrapper: { justifyContent: "space-between", marginBottom: Spacing.md },
});