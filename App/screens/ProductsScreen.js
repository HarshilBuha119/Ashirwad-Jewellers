import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  RefreshControl,
  ScrollView,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// COMPONENTS
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// UNIFIED API (Consolidated Code)
import { useJewellary, useMetalRates, useFavorites } from "../api/orderApi";
import { calculateProductPrice } from "../utils/priceCalculator";

// THEME
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

const CATEGORIES = ["All", "Rings", "Necklace", "Earrings", "Bracelets"];

export default function ProductsScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  // 1. Unified Data Fetching
  const { 
    data: productList = [], 
    isLoading: pLoading, 
    refetch: refetchProducts, 
    isRefetching 
  } = useJewellary();

  const { data: metalRates = [] } = useMetalRates();
  const { data: favorites = [] } = useFavorites();

  // 2. Optimized Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    
    // Enrich with price first
    let list = productList.map(item => ({
      ...item,
      calculatedPrice: calculateProductPrice(item, metalRates)
    }));

    // Filter by Search Query
    if (q) {
      list = list.filter(p =>
        p?.name?.toLowerCase().includes(q) || p?.item_number?.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Filter by Favorites (checking against our consolidated hook data)
    if (showOnlyFavs) {
      list = list.filter(p => favorites.some(f => f.id === p.id));
    }

    // Sort Logic
    if (sortBy === "PriceLow") {
      list.sort((a, b) => a.calculatedPrice - b.calculatedPrice);
    } else if (sortBy === "PriceHigh") {
      list.sort((a, b) => b.calculatedPrice - a.calculatedPrice);
    }

    return list;
  }, [query, productList, selectedCategory, sortBy, showOnlyFavs, favorites, metalRates]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSortBy("Newest");
    setShowOnlyFavs(false);
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* HEADER AREA */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircle}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search products..."
              placeholderTextColor={Colors.muted}
              style={styles.searchInput}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color={Colors.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* QUICK FILTERS */}
        <View style={styles.filterBar}>
          <View style={styles.bestSellingTag}>
            <Text style={styles.bestSellingText}>Our Collection</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
            <Ionicons name="options-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.resultCount}>
          {filteredProducts.length} items found
        </Text>

        <Loader visible={pLoading} />

        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.listColumn}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetchProducts} 
              tintColor={Colors.text} 
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              grid
              isFav={favorites.some(f => f.id === item.id)}
              displayPrice={item.calculatedPrice}
            />
          )}
          ListEmptyComponent={
            !pLoading && <Text style={styles.emptyText}>No products found</Text>
          }
        />
      </SafeAreaView>

      {/* FILTER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter By</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Sort Order</Text>
              <View style={styles.optionsGroup}>
                {[
                  { label: "Default (Newest)", value: "Newest" },
                  { label: "Price: Low to High", value: "PriceLow" },
                  { label: "Price: High to Low", value: "PriceHigh" }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.sortItem, sortBy === item.value && styles.activeSortItem]}
                    onPress={() => setSortBy(item.value)}
                  >
                    <Text style={[styles.sortText, sortBy === item.value && styles.activeText]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.chipGroup}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.chipLabel, selectedCategory === cat && styles.activeChipLabel]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Quick Actions</Text>
              <TouchableOpacity
                style={styles.preferenceRow}
                onPress={() => setShowOnlyFavs(!showOnlyFavs)}
              >
                <View style={styles.rowCenter}>
                  <Ionicons name="heart" size={20} color={showOnlyFavs ? "#EF4444" : Colors.muted} />
                  <Text style={styles.preferenceText}>Show Favorites Only</Text>
                </View>
                <Ionicons
                  name={showOnlyFavs ? "checkbox" : "square-outline"}
                  size={24}
                  color={showOnlyFavs ? Colors.text : Colors.border}
                />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setIsFilterVisible(false)}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1, paddingHorizontal: Spacing.md },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: Spacing.sm },
  iconCircle: { padding: Spacing.sm },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    paddingHorizontal: Spacing.md,
    marginLeft: Spacing.sm,
    borderRadius: 25,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, marginHorizontal: Spacing.xs, fontSize: 14, color: Colors.text },
  filterBar: { flexDirection: "row", marginTop: Spacing.md, alignItems: "center", justifyContent: "space-between" },
  bestSellingTag: { backgroundColor: Colors.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  bestSellingText: { fontSize: 13, fontWeight: "500", color: Colors.text },
  resultCount: { marginTop: Spacing.md, marginBottom: Spacing.sm, fontSize: 13, color: Colors.muted },
  listColumn: { justifyContent: "space-between" },
  listContent: { paddingBottom: 100 },
  emptyText: { textAlign: 'center', marginTop: 50, color: Colors.muted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: Spacing.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  filterLabel: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.md, marginTop: Spacing.sm, color: Colors.text },
  optionsGroup: { marginBottom: Spacing.sm },
  sortItem: { paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xs },
  activeSortItem: { borderColor: Colors.text, backgroundColor: Colors.background },
  sortText: { fontSize: 14, color: Colors.muted },
  activeText: { color: Colors.text, fontWeight: '600' },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.sm },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, marginRight: Spacing.sm, marginBottom: Spacing.sm },
  activeChip: { backgroundColor: Colors.text, borderColor: Colors.text },
  chipLabel: { color: Colors.muted },
  activeChipLabel: { color: Colors.white, fontWeight: 'bold' },
  preferenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  preferenceText: { fontSize: 15, marginLeft: 12, color: Colors.text },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: Spacing.lg, paddingBottom: Spacing.sm },
  resetButton: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.text, alignItems: 'center' },
  resetButtonText: { color: Colors.text, fontWeight: 'bold' },
  applyButton: { flex: 2, backgroundColor: Colors.text, padding: 15, borderRadius: 12, alignItems: 'center' },
  applyButtonText: { color: Colors.white, fontWeight: 'bold' },
});