/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ToastAndroid,
    Alert,
    Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

// THEME & COMPONENTS
import Colors from "../theme/Colors";
import Slider from "../components/SLider";
import Loader from "../components/Loader";

// UNIFIED API (Consolidated from your provided code)
import { 
    useMetalRates, 
    useFavorites, 
    useToggleFavorite, 
    useAddToCart 
} from "../api/orderApi"; 

import { shareProduct } from "../utils/deepLinkGenerator";

const PURITY_MULTIPLIERS = {
    24: 1.0,
    22: 0.916,
    18: 0.75,
    14: 0.585,
};

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;

    // --- 1. DATA FETCHING (Unified Hooks) ---
    const { data: metalRates, isLoading: ratesLoading } = useMetalRates();
    const { data: favorites = [] } = useFavorites();
    const { mutate: toggleFav } = useToggleFavorite();
    const cartMutation = useAddToCart();

    // --- 2. DYNAMIC DATA ---
    const availableCarats = product.purity || [];
    const availableWeights = product.weight || [];
    const availableWidths = product.width || [];

    // --- 3. STATES ---
    const [selectedColor, setSelectedColor] = useState(product.metal_type || "Gold");
    const [selectedCarat, setSelectedCarat] = useState(availableCarats[0] || 22);
    const [selectedWidth, setSelectedWidth] = useState(availableWidths[0] || "2.5");
    const [selectedWeight, setSelectedWeight] = useState(availableWeights[0] || 0);
    const [added, setAdded] = useState(false);
    const [showDetails, setShowDetails] = useState(true);

    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Check if liked using the hook data
    const liked = favorites.some((fav) => fav.id === product.id);

    // --- 4. PRICE CALCULATION ---
    const displayPrice = useMemo(() => {
        if (!metalRates || metalRates.length === 0) return 0;

        const metalData = metalRates.find(r => r.metal_type.toLowerCase() === product.metal_type?.toLowerCase());
        const activeRate = metalData ? metalData.rate_per_gm_24k : 0;

        const weight = parseFloat(selectedWeight) || 0;
        const multiplier = PURITY_MULTIPLIERS[selectedCarat] || (selectedCarat / 24);

        if (weight === 0) return 0;

        const metalCost = activeRate * multiplier * weight;
        const importDuty = metalCost * 0.10;
        const subTotal = metalCost + importDuty;
        const total = subTotal + (subTotal * 0.03);

        return Math.round(total);
    }, [metalRates, selectedCarat, selectedWeight, product]);

    // --- 5. HANDLERS ---
    const handleFavoritePress = () => {
        if (!liked) {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.5, duration: 120, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
            ]).start();
        }
        toggleFav({ productId: product.id, isFav: liked });
    };

    const handleAddToCart = () => {
        if (added) {
            navigation.navigate("Cart");
            return;
        }

        cartMutation.mutate({
            productId: product.id,
            options: { 
                carat: selectedCarat, 
                color: selectedColor, 
                width: selectedWidth, 
                weight: selectedWeight, 
                final_price: displayPrice 
            }
        }, {
            onSuccess: () => {
                setAdded(true);
                ToastAndroid.show("Added to cart", ToastAndroid.SHORT);
            }
        });
    };

    const getMetalColors = (name) => {
        const fallbacks = {
            Gold: ["#D4AF37", "#D4AF37"],
            Silver: ["#E8E8E8", "#B8B8B8"],
            Platinum: ["#E5E4E2", "#B7B7B7"],
        };
        return fallbacks[name] || ["#D1D5DB", "#9CA3AF"];
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
            <Loader visible={ratesLoading} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" color={Colors.text} size={28} />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleFavoritePress}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <MaterialIcons
                                name={liked ? "favorite" : "favorite-border"}
                                color={liked ? "#E11D48" : Colors.text}
                                size={28}
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn} onPress={() => shareProduct(product)}>
                        <Ionicons name="share-social-outline" size={28} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Slider data={product.images?.length > 0 ? product.images.map(img => ({ id: img.id, image: img.image })) : [{ id: product.id, image: product.main_image }]} />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{product.name}</Text>
                            <Text style={styles.brand}>by {product.brand}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.price}>₹{displayPrice.toLocaleString('en-IN')}</Text>
                            <Text style={styles.taxLabel}>Incl. of all taxes</Text>
                        </View>
                    </View>

                    {/* SELECTIONS */}
                    <Text style={styles.sectionTitle}>Purity: {selectedCarat}K</Text>
                    <View style={styles.optionsRow}>
                        {availableCarats.map((k) => (
                            <TouchableOpacity key={k} style={[styles.option, selectedCarat === k && styles.optionActive]} onPress={() => setSelectedCarat(k)}>
                                <Text style={[styles.optionText, selectedCarat === k && styles.optionTextActive]}>{k}K</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Weight: {selectedWeight} Grams</Text>
                    <View style={styles.optionsRow}>
                        {availableWeights.map((w) => (
                            <TouchableOpacity key={w} style={[styles.option, selectedWeight === w && styles.optionActive]} onPress={() => setSelectedWeight(w)}>
                                <Text style={[styles.optionText, selectedWeight === w && styles.optionTextActive]}>{w}g</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* DETAILS COLLAPSIBLE */}
                    <TouchableOpacity style={styles.detailsRow} onPress={() => setShowDetails(!showDetails)}>
                        <Text style={styles.detailsText}>Product Details</Text>
                        <Ionicons name={showDetails ? "remove-circle-outline" : "add-circle-outline"} size={22} color={Colors.text} />
                    </TouchableOpacity>
                    {showDetails && (
                        <View style={styles.detailsContent}>
                            <Text style={styles.detailsParagraph}>{product.description}</Text>
                            <Text style={styles.detailsParagraph}>Item No: {product.item_number}</Text>
                            <Text style={styles.detailsParagraph}>Net Weight: {selectedWeight}g</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            <TouchableOpacity style={styles.cartBar} onPress={handleAddToCart}>
                <LinearGradient colors={["#4A2F24", "#2B1B15"]} style={styles.cartButton}>
                    <Text style={styles.cartText}>
                        {cartMutation.isPending ? "Adding..." : (added ? "Go to Cart" : "Add to Cart")}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    headerActions: { flexDirection: "row" },
    iconBtn: { marginLeft: 14 },
    content: { paddingHorizontal: 20, marginTop: 20 },
    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    title: { fontSize: 20, fontWeight: "700", color: Colors.text },
    brand: { fontSize: 13, color: "#6B7280" },
    price: { fontSize: 22, fontWeight: "800", color: Colors.text },
    taxLabel: { fontSize: 10, color: '#6B7280', textAlign: 'right' },
    sectionTitle: { marginTop: 20, fontSize: 14, fontWeight: "600" },
    optionsRow: { flexDirection: "row", flexWrap: 'wrap', marginTop: 10 },
    option: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#D1D5DB", marginRight: 10, marginBottom: 10 },
    optionActive: { borderColor: Colors.text, backgroundColor: "#f3f4f6" },
    optionText: { fontSize: 13, color: "#374151" },
    optionTextActive: { color: Colors.text, fontWeight: "700" },
    detailsRow: { marginTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    detailsText: { fontSize: 16, fontWeight: "600" },
    detailsContent: { marginTop: 10 },
    detailsParagraph: { color: "#4B5563", lineHeight: 20, marginBottom: 5 },
    cartBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'transparent' },
    cartButton: { borderRadius: 12, paddingVertical: 18, alignItems: "center", elevation: 4 },
    cartText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});