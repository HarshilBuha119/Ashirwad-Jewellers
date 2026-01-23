import React, { useState, useMemo, useEffect, useCallback } from "react";
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
import ProductCard from "../components/ProductCard";
import Colors from "../theme/Colors";
import { fetchJewellary } from "../services/jewellaryService";
import Loader from "../components/Loader";
import { useUserFavorites } from "../hooks/useStore";

export default function ProductsScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  const categories = ["All", "Rings", "Necklace", "Earrings", "Bracelets"];
  const { data: favorites = [] } = useUserFavorites();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchJewellary();
      setProductList(data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchJewellary();
    setProductList(data || []);
    setRefreshing(false);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...productList];

    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(p =>
        p?.name?.toLowerCase().includes(q) || p?.itemNumber?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (showOnlyFavs) {
      list = list.filter(p => favorites.some(f => f.id === p.id));
    }

    if (sortBy === "PriceLow") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "PriceHigh") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [query, productList, selectedCategory, sortBy, showOnlyFavs, favorites]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* HEADER SEARCH */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircle}>
            <View style={{ padding: 10 }}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </View>
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name or item number"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filters}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterText}>Best Selling</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
            <Ionicons name="filter" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.resultText}>
          Showing {filteredProducts.length} results
        </Text>

        <Loader visible={loading} />

        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => (
            <ProductCard 
              item={item} 
              grid 
              isFav={favorites.some(f => f.id === item.id)} 
              img={160}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.text} />
          }
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No products found</Text>
          )}
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
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortContainer}>
                {[
                  { label: "Newest", value: "Newest" },
                  { label: "Price: Low to High", value: "PriceLow" },
                  { label: "Price: High to Low", value: "PriceHigh" }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.sortOption, sortBy === item.value && styles.activeSortOption]}
                    onPress={() => setSortBy(item.value)}
                  >
                    <Ionicons
                      name={sortBy === item.value ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={sortBy === item.value ? Colors.text : "#6B7280"}
                    />
                    <Text style={[styles.sortOptionText, sortBy === item.value && styles.activeSortText]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Category</Text>
              {/* FIXED: Changed <div> to <View> here */}
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, selectedCategory === cat && styles.activeChip]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterLabel}>Preferences</Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setShowOnlyFavs(!showOnlyFavs)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="heart" size={20} color={showOnlyFavs ? "#EF4444" : "#9CA3AF"} />
                  <Text style={styles.toggleText}>Show Favorites Only</Text>
                </View>
                <Ionicons
                  name={showOnlyFavs ? "checkbox" : "square-outline"}
                  size={24}
                  color={showOnlyFavs ? Colors.text : "#D1D5DB"}
                />
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSelectedCategory("All");
                  setSortBy("Newest");
                  setShowOnlyFavs(false);
                }}
              >
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtnSmall}
                onPress={() => setIsFilterVisible(false)}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: Colors.background },
  searchRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  headerCircle: { backgroundColor: "#FFFFFFBF", borderRadius: 25 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    paddingHorizontal: 12,
    marginLeft: 12,
    borderRadius: 25,
    backgroundColor: "#FFFFFFBF",
    borderWidth: 1,
    borderColor: "#FFFFFF80",
  },
  input: { flex: 1, marginHorizontal: 8, fontSize: 14, color: Colors.text },
  filters: { flexDirection: "row", marginTop: 16, alignItems: "center", justifyContent: "space-between" },
  filterBtn: { backgroundColor: "#F9FAFB", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  filterText: { fontSize: 13, fontWeight: "500" },
  resultText: { marginTop: 14, marginBottom: 10, fontSize: 13, color: "#6B7280" },
  column: { justifyContent: "space-between" },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#9CA3AF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  filterLabel: { fontSize: 16, fontWeight: '700', marginBottom: 15, marginTop: 10, color: Colors.text },
  sortContainer: { marginBottom: 10 },
  sortOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 8 },
  activeSortOption: { borderColor: Colors.text, backgroundColor: '#F9FAFB' },
  sortOptionText: { marginLeft: 10, fontSize: 14, color: '#4B5563' },
  activeSortText: { color: Colors.text, fontWeight: '600' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, marginBottom: 8 },
  activeChip: { backgroundColor: Colors.text, borderColor: Colors.text },
  chipText: { color: '#6B7280' },
  activeChipText: { color: 'white', fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  toggleText: { fontSize: 15, marginLeft: 12, color: Colors.text },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 20, paddingBottom: 10 },
  resetBtn: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: Colors.text, alignItems: 'center' },
  applyBtnSmall: { flex: 2, backgroundColor: Colors.text, padding: 15, borderRadius: 12, alignItems: 'center' },
  applyBtnText: { color: 'white', fontWeight: 'bold' },
  resetBtnText: { color: Colors.text, fontWeight: 'bold' },
});