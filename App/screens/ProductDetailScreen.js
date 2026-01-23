/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
    ActivityIndicator
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../theme/Colors";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addToCart, fetchMetalRates } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "../components/SLider";
import { shareProduct } from "../utils/deepLinkGenerator";
import { useToggleFavorite, useUserFavorites } from "../hooks/useStore";

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;

    // --- 1. FETCH LIVE METAL RATES ---
    const { data: metalRates, isLoading: ratesLoading } = useQuery({
        queryKey: ['metalRates'],
        queryFn: fetchMetalRates,
    });

    // --- 2. DYNAMIC DATA PREPARATION ---
    const availableCarats = product.options?.carats || [];
    const availableMetals = product.options?.metals || [];
    const availableWidths = product.options?.widths || [];
    const availableWeights = product.options?.weights || [];

    // Fallbacks for initialization
    const defaultCarat = availableCarats.length > 0 ? availableCarats[0] : { purity: "18K", multiplier: 0.75 };
    const defaultMetal = availableMetals.length > 0 ? availableMetals[0].name : (product.metal_type || "Gold");
    const defaultWidth = availableWidths.length > 0 ? availableWidths[0] : "2.5";
    // Ensure default weight is NOT 0 so calculation works immediately
    const defaultWeight = availableWeights.length > 0 ? availableWeights[0] : (product.weight || 0);

    // --- 3. STATES ---
    const [selectedColor, setSelectedColor] = useState(route.params?.selectedColor || defaultMetal);
    const [selectedCaratObj, setSelectedCaratObj] = useState(defaultCarat);
    const [selectedWidth, setSelectedWidth] = useState(route.params?.selectedWidth || defaultWidth);
    const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
    const [added, setAdded] = useState(false);
    const [showDetails, setShowDetails] = useState(true);

    const queryClient = useQueryClient();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isFirstRender = useRef(true);

    // --- 4. FAVORITES & ANIMATION ---
    const { data: favorites = [] } = useUserFavorites();
    const { mutate: toggleFav } = useToggleFavorite();
    const liked = favorites.some((fav) => fav.id === product.id);

    const animateHeart = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.5, duration: 120, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        ]).start();
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (liked) animateHeart();
    }, [liked]);

    const handleFavoritePress = () => {
        if (!liked) animateHeart();
        toggleFav({ productId: product.id, isFav: liked });
    };

    // --- 5. SHARING ---
    const handleShare = async () => {
        try {
            await shareProduct(product, {
                carat: selectedCaratObj.purity,
                color: selectedColor,
                width: selectedWidth,
            });
        } catch (error) {
            Alert.alert('Share Error', error.message);
        }
    };

    // --- 6. PRICE CALCULATION LOGIC (STRICTLY METAL RATES) ---
    const displayPrice = useMemo(() => {
        if (!metalRates || metalRates.length === 0) return "Calculating...";

        // Find match (e.g. "Gold")
        const metalData = metalRates.find(r => r.metal_type.toLowerCase() === product.metal_type?.toLowerCase());

        // If specific metal not found, use the first rate available (Gold)
        const activeRate = metalData ? metalData.rate_per_gm_24k : metalRates[0].rate_per_gm_24k;

        const weight = parseFloat(selectedWeight) || 0;
        const multiplier = parseFloat(selectedCaratObj.multiplier) || 0;
        const makingPercent = parseFloat(product.making_charge_percent) || 0;

        if (weight === 0) return "Select Weight";

        // 1. Metal Cost = Rate * Purity * Weight
        const metalCost = activeRate * multiplier * weight;

        // 2. Making Charges
        const makingCharges = metalCost * (makingPercent / 100);

        // 3. Total Calculation
        const total = metalCost + makingCharges 

        // --- LOGGING SECTION ---
        console.log("--- Price Calculation Breakdown ---");
        console.log(`Product: ${product.name}`);
        console.log(`Live 24k Rate: ₹${activeRate}`);
        console.log(`Purity (${selectedCaratObj.purity}): ${multiplier}`);
        console.log(`Selected Weight: ${weight}g`);
        console.log(`Metal Cost: ₹${metalCost.toFixed(2)}`);
        console.log(`Making Charges (${makingPercent}%): ₹${makingCharges.toFixed(2)}`);
        console.log(`FINAL TOTAL: ₹${total}`);
        console.log("-----------------------------------");

        return Math.round(total).toLocaleString('en-IN');
    }, [metalRates, selectedCaratObj, selectedWeight, product]);

    // --- 7. CART MUTATION ---
    const cartMutation = useMutation({
        mutationFn: ({ id, options }) => addToCart(id, options),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart']);
            setAdded(true);
            ToastAndroid.show("Added to cart successfully", ToastAndroid.SHORT);
        },
    });

    useFocusEffect(
        useCallback(() => {
            setAdded(false);
        }, [])
    );

    useEffect(() => {
        setAdded(false);
    }, [selectedColor, selectedCaratObj, selectedWidth, selectedWeight]);

    const getMetalColors = (metal) => {
        if (metal.colors && metal.colors.length > 0) return metal.colors;
        const fallbacks = {
            Gold: ["#D4AF37", "#D4AF37"],
            Silver: ["#E8E8E8", "#B8B8B8"],
            Platinum: ["#E5E4E2", "#B7B7B7"],
        };
        return fallbacks[metal.name] || ["#D1D5DB", "#9CA3AF"];
    };

    if (ratesLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" color={Colors.text} size={28} />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleFavoritePress} activeOpacity={0.7}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <MaterialIcons name={liked ? "favorite" : "favorite-border"} color={liked ? Colors.text : Colors.text} size={28} />
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={28} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Slider data={product.images ?? [{ id: product.id, image: product.main_image }]} />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.title}>{product.name}</Text>
                            <Text style={styles.brand}>by {product.brand}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.price}>₹{displayPrice}</Text>
                            <Text style={styles.taxLabel}>Incl. of all taxes</Text>
                        </View>
                    </View>

                    {/* PURITY SELECTION */}
                    {availableCarats.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Purity: {selectedCaratObj.purity}</Text>
                            <View style={styles.optionsRow}>
                                {availableCarats.map((item) => (
                                    <TouchableOpacity
                                        key={item.purity}
                                        style={[styles.option, selectedCaratObj.purity === item.purity && styles.optionActive]}
                                        onPress={() => setSelectedCaratObj(item)}
                                    >
                                        <Text style={[styles.optionText, selectedCaratObj.purity === item.purity && styles.optionTextActive]}>
                                            {item.purity}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    {/* WEIGHT SELECTION */}
                    {availableWeights.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Weight: {selectedWeight} Grams</Text>
                            <View style={styles.optionsRow}>
                                {availableWeights.map((w) => (
                                    <TouchableOpacity
                                        key={w}
                                        style={[styles.option, selectedWeight === w && styles.optionActive]}
                                        onPress={() => setSelectedWeight(w)}
                                    >
                                        <Text style={[styles.optionText, selectedWeight === w && styles.optionTextActive]}>
                                            {w}g
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.sectionTitle}>Metal: {selectedColor}</Text>
                            <View style={styles.colorRow}>
                                {availableMetals.map((metal) => {
                                    const isSelected = selectedColor === metal.name;
                                    const colors = getMetalColors(metal);
                                    return (
                                        <TouchableOpacity
                                            key={metal.name}
                                            style={styles.colorcontainer}
                                            onPress={() => setSelectedColor(metal.name)}
                                        >
                                            <View style={isSelected ? styles.outerCircleSelectedContainer : styles.outerCircle}>
                                                <LinearGradient colors={colors} style={isSelected ? styles.outerCircleSelectedBorder : styles.outerCircle} />
                                                {isSelected && <View style={styles.whiteGapBackground} />}
                                                {isSelected && <LinearGradient colors={colors} style={styles.innerCircleGradient} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.sectionTitle}>Width: {selectedWidth}MM</Text>
                            <View style={styles.optionsRow}>
                                {availableWidths.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.option, selectedWidth === item && styles.optionActive]}
                                        onPress={() => setSelectedWidth(item)}
                                    >
                                        <Text style={[styles.optionText, selectedWidth === item && styles.optionTextActive]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.detailsRow} onPress={() => setShowDetails(!showDetails)} activeOpacity={0.7}>
                        <Text style={styles.detailsText}>Product Details</Text>
                        <Ionicons name={showDetails ? "remove-circle-outline" : "add-circle-outline"} size={22} color={Colors.text} />
                    </TouchableOpacity>
                    {showDetails && (
                        <View style={styles.detailsContent}>
                            <Text style={styles.detailsParagraph}>{product.description}</Text>
                            <Text style={styles.detailsParagraph}>Metal: {product.metal_type} ({selectedCaratObj.purity})</Text>
                            <Text style={styles.detailsParagraph}>Net Weight: {selectedWeight}g</Text>
                            <Text style={styles.detailsParagraph}>Making Charges: {product.making_charge_percent}%</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            <TouchableOpacity
                style={styles.cartBar}
                activeOpacity={0.9}
                onPress={() => {
                    if (!added) {
                        cartMutation.mutate({
                            id: product.id,
                            options: {
                                carat: selectedCaratObj.purity,
                                color: selectedColor,
                                width: selectedWidth,
                                weight: selectedWeight,
                                final_price: displayPrice
                            }
                        });
                    } else {
                        navigation.navigate("Cart");
                    }
                }}
            >
                <LinearGradient colors={["#4A2F24", "#4A2F24"]} style={styles.cartButton}>
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
    optionsRow: { flexDirection: "row", marginTop: 10 },
    option: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#D1D5DB", marginRight: 10, marginBottom: 10 },
    optionActive: { borderColor: Colors.text, backgroundColor: "#f3f4f6" },
    optionText: { fontSize: 13, color: "#374151" },
    optionTextActive: { color: Colors.text, fontWeight: "700" },
    colorRow: { flexDirection: 'row', paddingTop: 10 },
    colorcontainer: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    outerCircle: { width: 32, height: 32, borderRadius: 16 },
    outerCircleSelectedContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    outerCircleSelectedBorder: { width: 32, height: 32, borderRadius: 16, position: 'absolute' },
    whiteGapBackground: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.background, position: 'absolute', zIndex: 1 },
    innerCircleGradient: { width: 24, height: 24, borderRadius: 12, position: 'absolute', zIndex: 2 },
    detailsRow: { marginTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    detailsText: { fontSize: 16, fontWeight: "600" },
    detailsContent: { marginTop: 10 },
    detailsParagraph: { color: "#4B5563", lineHeight: 20, marginBottom: 5 },
    cartBar: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'transparent' },
    cartButton: { borderRadius: 12, paddingVertical: 18, alignItems: "center", elevation: 4 },
    cartText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});