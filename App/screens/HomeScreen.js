import React, { useCallback, useMemo, useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, 
  FlatList, StatusBar, RefreshControl 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Centralized Hooks
import { useJewellary, useMetalRates, useFavorites } from "../api/storeApi";

// Components & Utils
import HomeHeader from "../components/HomeHeader";
import PromoBanner from "../components/PromoBanner";
import CategoryItem from "../components/CategoryItem";
import ProductCard from "../components/ProductCard";
import Poster from "../components/Poster";
import Loader from "../components/Loader";
import { calculateProductPrice } from "../utils/priceCalculator";

// Theme & Data
import { categories } from "../data/homeData";
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Data Fetching via React Query (Managed Cache)
  const { data: products = [], isLoading: pLoading, refetch: refetchProducts } = useJewellary();
  const { data: metalRates = [], isLoading: rLoading } = useMetalRates();
  const { data: favorites = [] } = useFavorites();

  // 2. Logic Optimization: useMemo prevents recalculation on every re-render
  const enrichedAndFilteredProducts = useMemo(() => {
    if (!products.length) return [];

    const withPrices = products.map(item => ({
      ...item,
      calculatedPrice: calculateProductPrice(item, metalRates)
    }));

    if (selectedCategory === "All") return withPrices;
    
    const lowerCategory = selectedCategory.toLowerCase();
    return withPrices.filter((p) => p.category?.toLowerCase() === lowerCategory);
  }, [products, metalRates, selectedCategory]);

  // 3. Memoized Handlers to prevent unnecessary child re-renders
  const onRefresh = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  const handleResetCategory = useCallback(() => setSelectedCategory("All"), []);

  const renderProduct = useCallback(({ item }) => (
    <ProductCard
      item={item}
      displayPrice={item.calculatedPrice} 
      isFav={favorites.some(f => f.id === item.id || f.product_id === item.id)}
    />
  ), [favorites]);

  const isAppLoading = pLoading || rLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <HomeHeader />
      <Loader visible={isAppLoading} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={false} 
            onRefresh={onRefresh} 
            tintColor={Colors.primary} 
          />
        }
      >
        <PromoBanner />
        <Poster />

        {/* Category Section */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>Category</Text>
            {selectedCategory !== "All" && (
              <Text style={styles.resetText} onPress={handleResetCategory}>Reset</Text>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContent}
          >
            {categories.map((item) => (
              <CategoryItem
                key={item.id}
                item={item}
                isSelected={selectedCategory === item.title}
                onPress={() => setSelectedCategory(item.title)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Product Results */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "All" ? "New Arrival" : `${selectedCategory} Collection`}
            </Text>
            <Text onPress={() => navigation.navigate("Products")} style={styles.seeAllText}>
              See All
            </Text>
          </View>
          
          <FlatList
            horizontal
            data={enrichedAndFilteredProducts.slice(0,5)}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            removeClippedSubviews={true} 
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={5}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No items found in this category.</Text>
            )}
          />
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scrollView: {
    flex: 1,
  },
  section: { 
    marginTop: Spacing.lg 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: 'center',
    marginBottom: Spacing.md, 
    paddingHorizontal: Spacing.lg 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: Colors.text 
  },
  resetText: { 
    fontSize: 13, 
    color: Colors.text, 
    fontWeight: "500" 
  },
  seeAllText: { 
    fontSize: 13, 
    color: Colors.text, 
    fontWeight: "500" 
  },
  categoryListContent: { 
    paddingHorizontal: Spacing.sm 
  },
  productListContent: { 
    paddingLeft: Spacing.lg 
  },
  emptyText: { 
    color: Colors.muted, 
    marginTop: Spacing.sm,
    marginLeft: Spacing.lg,
    fontSize: 14,
  },
  footerSpacing: { 
    height: 120
  }
});