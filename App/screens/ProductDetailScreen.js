/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../theme/Colors";
import { useCart } from "../context/CartContext";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "../components/SLider";
import { shareProduct } from "../utils/deepLinkGenerator";
import { useToggleFavorite, useUserFavorites } from "../hooks/useStore";

export default function ProductDetailScreen({ route, navigation }) {
    const { product } = route.params;
    const [showDetails, setShowDetails] = useState(true);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const isFirstRender = useRef(true);
    const { addToCart } = useCart();
    const [selectedColor, setSelectedColor] = useState(route.params?.selectedColor || "Gold");
    const [selectedCarat, setSelectedCarat] = useState(route.params?.selectedCarat || "18K");
    const [selectedWidth, setSelectedWidth] = useState(route.params?.selectedWidth || "2.5");
    const animateHeart = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.5, // Slightly bigger pop for the detail screen
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
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
        if (!liked) animateHeart(); // Instant feedback
        toggleFav({ productId: product.id, isFav: liked });
    };
    const [added, setAdded] = useState(false);
    const { data: favorites = [] } = useUserFavorites();
    const { mutate: toggleFav } = useToggleFavorite();
    const liked = favorites.some((fav) => fav.id === product.id);
    useFocusEffect(
        useCallback(() => {
            setAdded(false);
        }, [])
    );

    useEffect(() => {
        setAdded(false);
    }, [selectedColor, selectedCarat, selectedWidth]);

    const colorGradients = {
        Gold: {
            colors: ["#D4AF37", "#D4AF37"],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 }
        },
        Silver: {
            colors: ["#E8E8E8", "#D0D0D0", "#B8B8B8"],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 }
        }
    };

    const renderColorOption = (colorName) => {
        const isSelected = selectedColor === colorName;
        const gradientConfig = colorGradients[colorName];

        return (
            <TouchableOpacity
                key={colorName}
                style={styles.colorcontainer}
                onPress={() => setSelectedColor(colorName)}
            >
                {isSelected ? (
                    <View style={styles.outerCircleSelectedContainer}>
                        <LinearGradient
                            colors={gradientConfig.colors}
                            start={gradientConfig.start}
                            end={gradientConfig.end}
                            style={styles.outerCircleSelectedBorder}
                        />
                        <View style={styles.whiteGapBackground} />
                        <LinearGradient
                            colors={gradientConfig.colors}
                            start={gradientConfig.start}
                            end={gradientConfig.end}
                            style={styles.innerCircleGradient}
                        />
                    </View>
                ) : (
                    <LinearGradient
                        colors={gradientConfig.colors}
                        start={gradientConfig.start}
                        end={gradientConfig.end}
                        style={styles.outerCircle}
                    />
                )}
            </TouchableOpacity>
        );
    };

    // Handle share button press
    const handleShare = async () => {
        try {
            await shareProduct(product, {
                carat: selectedCarat,
                color: selectedColor,
                width: selectedWidth,
            });
            ToastAndroid.show("Shared successfully!", ToastAndroid.SHORT);
        } catch (error) {
            Alert.alert('Share Error', error.message);
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.background}
            />
            {/* HEADER */}
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" color="#000" size={24} />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    {/* Updated onPress and name logic */}
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={handleFavoritePress}
                        activeOpacity={0.7}
                    >
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <MaterialIcons
                                name={liked ? "favorite" : "favorite-border"}
                                color={liked ? "#e11d48" : "#000"}
                                size={28} // Slightly larger for detail screen
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={25} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Slider data={product.images ?? [{ id: product.id, image: product.image }]} />

                {/* INFO */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <View>
                            <Text style={styles.title}>{product.name}</Text>
                            <Text style={styles.brand}>by {product.brand}</Text>
                        </View>
                        <Text style={styles.price}>${product.price}.00</Text>
                    </View>

                    {/* RATING */}
                    <View style={styles.rating}>
                        <Feather name="star" color="#6B7280" size={20} />
                        <Text style={styles.ratingText}>4.9</Text>
                        <Text style={styles.reviewText}>(2345)</Text>
                    </View>

                    {/* CARAT */}
                    <Text style={styles.sectionTitle}>Caret: {selectedCarat}</Text>
                    <View style={styles.optionsRow}>
                        {["18K", "20K", "21K", "22K", "24K"].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.option,
                                    selectedCarat === item && styles.optionActive,
                                ]}
                                onPress={() => setSelectedCarat(item)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedCarat === item && styles.optionTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* METAL */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={styles.sectionTitle}>Metal: {selectedColor}</Text>
                            <View style={styles.colorRow}>
                                {renderColorOption("Gold")}
                                {renderColorOption("Silver")}
                            </View>
                        </View>
                        {/* WIDTH */}
                        <View>
                            <Text style={styles.sectionTitle}>Width: {selectedWidth}MM</Text>
                            <View style={styles.optionsRow}>
                                {["1.5", "2.5", "3.5"].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.option,
                                            selectedWidth === item && styles.optionActive,
                                            { borderRadius: 50 }
                                        ]}
                                        onPress={() => setSelectedWidth(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedWidth === item && styles.optionTextActive,
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* DETAILS */}
                    <TouchableOpacity
                        style={styles.detailsRow}
                        onPress={() => setShowDetails(prev => !prev)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.detailsText}>Details</Text>
                        <Ionicons
                            name={showDetails ? "remove-circle-outline" : "add-circle-outline"}
                            size={22}
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                    {showDetails && (
                        <View style={styles.detailsContent}>
                            <Text style={styles.detailsParagraph}>
                                This exquisite ring is crafted with premium materials and
                                exceptional attention to detail. Designed for elegance and
                                everyday comfort, it complements both modern and classic styles.
                            </Text>

                            <Text style={styles.detailsParagraph}>
                                • Handcrafted finish{"\n"}
                                • Hypoallergenic metal{"\n"}
                                • Long-lasting polish{"\n"}
                                • Ideal for gifting and special occasions
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ADD TO CART */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                    if (!added) {
                        addToCart(product, {
                            carat: selectedCarat,
                            color: selectedColor,
                            width: selectedWidth,
                        });

                        ToastAndroid.show(
                            "Added to cart successfully",
                            ToastAndroid.SHORT
                        );

                        setAdded(true);
                    } else {
                        navigation.navigate("Cart");
                    }
                }}
                style={styles.cartBar}
            >
                <LinearGradient
                    colors={["#004e92", "#000428"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cartButton}
                >
                    <Text style={styles.cartText}>
                        {added ? "Go to Cart" : "Add to Cart"}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10
    },
    headerActions: {
        flexDirection: "row",
    },
    iconBtn: {
        marginLeft: 14,
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    image: {
        width: "90%",
        height: 260,
        borderRadius: 15
    },
    dots: {
        flexDirection: "row",
        marginTop: 10,
    },
    dotActive: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginHorizontal: 4,
    },

    dotInactive: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#D1D5DB",
        marginHorizontal: 4,
    },

    content: {
        paddingHorizontal: 20,
        marginTop: 20,
    },

    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: Colors.primary,
    },

    brand: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 2,
    },

    price: {
        fontSize: 20,
        fontWeight: "700",
    },

    rating: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    ratingText: {
        marginLeft: 4,
        fontWeight: "600",
    },

    reviewText: {
        marginLeft: 4,
        color: "#6B7280",
    },

    sectionTitle: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "600",
    },

    optionsRow: {
        flexDirection: "row",
        marginTop: 10,
    },

    option: {
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#b1b2b4ff",
        marginRight: 10,
    },

    optionActive: {
        borderColor: "#d4af37",
        backgroundColor: Colors.background,
    },

    optionText: {
        fontSize: 13,
        color: "#374151",
    },

    optionTextActive: {
        color: "#d4af37",
        fontWeight: "600",
    },

    colorRow: {
        flexDirection: 'row',
        paddingVertical: 20,
    },

    colorcontainer: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Unselected - 24x24
    outerCircle: {
        width: 32,
        height: 32,
        borderRadius: 25,
    },

    // Selected container - 32x32
    outerCircleSelectedContainer: {
        width: 32,
        height: 32,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    // Outer gradient border (32x32, 2px thick)
    outerCircleSelectedBorder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        position: 'absolute',
    },

    // WHITE GAP (28x28) - creates 2px space on each side
    whiteGapBackground: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.background,
        position: 'absolute',
        zIndex: 1,
    },

    // Inner gradient circle (24x24)
    innerCircleGradient: {
        width: 24,
        height: 24,
        borderRadius: 12,
        position: 'absolute',
        zIndex: 2,
    },
    detailsRow: {
        marginTop: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    detailsText: {
        fontSize: 16,
        fontWeight: "600",
    },

    cartBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },

    cartButton: {
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
    },

    cartText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    detailsContent: {
        marginTop: 12,
        paddingHorizontal: 4,
    },

    detailsParagraph: {
        fontSize: 14,
        lineHeight: 22,
        color: "#4B5563",
        marginBottom: 8,
    },

});
