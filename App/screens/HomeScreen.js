import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, StatusBar, RefreshControl } from "react-native";
import HomeHeader from "../components/HomeHeader";
import PromoBanner from "../components/PromoBanner";
import CategoryItem from "../components/CategoryItem";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/homeData";
import Colors from "../theme/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { fetchJewellary } from "../services/jewellaryService";
import Loader from "../components/Loader";
import { useUserFavorites } from "../hooks/useStore";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // NEW: State for filtering
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: favorites = [] } = useUserFavorites();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchJewellary();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // NEW: Filter logic
  // This recalculates whenever products OR selectedCategory changes
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;

    return products.filter((p) =>
      p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [products, selectedCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, []);

  const renderProduct = useCallback(({ item }) => (
    <ProductCard
      item={item}
      isFav={favorites.some(f => f.id === item.id || f.product_id === item.id)}
    />
  ), [favorites]);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <Loader visible={loading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <PromoBanner />

        {/* Category Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Category</Text>
            {selectedCategory !== "All" && (
              <Text style={styles.seeAll} onPress={() => setSelectedCategory("All")}>Reset</Text>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            overScrollMode="never"
          >
            {categories.map((item) => (
              <View key={item.id} style={{ marginRight: 0 }}>
                <CategoryItem
                  item={item}
                  isSelected={selectedCategory === item.title}
                  onPress={() => setSelectedCategory(item.title)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Filtered Results Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "All" ? "New Arrival" : `${selectedCategory} Collection`}
            </Text>
            <Text onPress={() => navigation.navigate("Products")} style={styles.seeAll}>
              See All
            </Text>
          </View>
          <FlatList
            horizontal
            data={filteredProducts} // Use the filtered list here
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}                // Prevents the extra "stretchy" space
            alwaysBounceHorizontal={false} // Ensures no bounce even if content is small
            decelerationRate="fast"        // Makes the list stop moving quicker
            keyboardShouldPersistTaps="always"
            ListHeaderComponent={<View style={{ width: 20 }} />}
            // Add ListEmptyComponent to show a message if no items match
            ListEmptyComponent={() => (
              <Text style={{ marginLeft: 20, color: '#999' }}>No items found in this category.</Text>
            )}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  seeAll: {
    fontSize: 13,
    color: "#F97316",
    fontWeight: "500",
  },
});
