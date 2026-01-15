import React, { useState, useMemo, useEffect, useCallback } from "react"; // Added useCallback
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
  Modal, // Added RefreshControl
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../components/ProductCard";
import Colors from "../theme/Colors";
// REMOVED: import { products } from "../data/homeData"; <--- Conflict removed

import { fetchJewellary } from "../services/jewellaryService";
import Loader from "../components/Loader";
import { useUserFavorites } from "../hooks/useStore";

export default function ProductsScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [productList, setProductList] = useState([]); // Renamed to avoid conflict
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(50000);
  const categories = ["All", "Rings", "Necklace", "Earrings", "Bracelets"];
  const { data: favorites = [] } = useUserFavorites();
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchJewellary();
      setProductList(data || []); // Ensure it's an array
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Refresh Function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchJewellary();
    setProductList(data || []);
    setRefreshing(false);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = productList;

    // 1. Search Query Filter
    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(p =>
        p?.name?.toLowerCase().includes(q) || p?.itemNumber?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }

    // 3. Price Filter (Assuming your product has a 'price' field)
    list = list.filter(p => p.price <= priceRange);

    return list;
  }, [query, productList, selectedCategory, priceRange]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

        {/* HEADER SEARCH */}
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircle}>
            <View style={{ padding: 10 }}>
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
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

        {/* FILTERS */}
        <View style={styles.filters}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="star" size={14} color="#F97316" />
              <Text style={styles.filterText}>Ratings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text style={styles.filterText}>Best Selling</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
            <Ionicons name="filter" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* RESULT COUNT */}
        <Text style={styles.resultText}>
          Showing {filteredProducts.length} results out of {productList.length}
        </Text>

        <Loader visible={loading} />

        {/* PRODUCT GRID */}
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.column}
          renderItem={({ item }) => <ProductCard item={item} grid isFav={favorites.some(f => f.id === item.id)} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          // Added Refresh Control here
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          // Handle empty state
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#9CA3AF' }}>
              No products found
            </Text>
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
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category Selection */}
              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat && styles.activeChip
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[
                      styles.chipText,
                      selectedCategory === cat && styles.activeChipText
                    ]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price Range placeholder (Since you uninstalled heavy slider libs) */}
              <Text style={styles.filterLabel}>Max Price: ₹{priceRange}</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Enter max price"
                style={styles.priceInput}
                placeholderTextColor={"#6B7280"}
                onChangeText={(val) => setPriceRange(Number(val))}
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setIsFilterVisible(false)}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.background
  },

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
    elevation: 6,
  },

  headerCircle: {
    backgroundColor: "#FFFFFFBF",
    borderRadius: 25,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },


  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: Colors.primary,
  },

  filters: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },

  filterText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },

  resultText: {
    marginTop: 14,
    marginBottom: 10,
    fontSize: 13,
    color: "#6B7280",
  },

  column: {
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: '#6B7280',
  },
  activeChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: Colors.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
