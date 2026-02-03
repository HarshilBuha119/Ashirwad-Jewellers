import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../theme/Colors";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "@d11/react-native-fast-image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCart, removeCartItem, updateCartQuantity } from "../services/api";
import Loader from "../components/Loader";

export default function CartScreen({ navigation }) {
    const queryClient = useQueryClient();

    // 1. Fetching Data
    const { data: cartItems = [], isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart
    });

    // 2. Mutations
    const updateMutation = useMutation({
        mutationFn: ({ id, qty }) => updateCartQuantity(id, qty),
        onSuccess: () => queryClient.invalidateQueries(['cart'])
    });

    const removeMutation = useMutation({
        mutationFn: (id) => removeCartItem(id),
        onSuccess: () => queryClient.invalidateQueries(['cart'])
    });

    // 3. Helper Handlers
    const handleUpdateQty = (id, currentQty, change) => {
        const newQty = currentQty + change;
        updateMutation.mutate({ id, qty: newQty });
    };

    const handleRemove = (id) => {
        removeMutation.mutate(id);
    };

    const loading = isLoading || updateMutation.isPending || removeMutation.isPending;
    // 4. Calculations
    // Use Number() to ensure "922" becomes 922
    const subtotal = cartItems.reduce((sum, item) => {
        const price = Number(item.final_price) || 0;
        return sum + (price * item.quantity);
    }, 0);
    const shipping = cartItems.length > 0 ? 15 : 0;
    const total = subtotal + shipping;
    console.log(subtotal, "subtotal", total, "total");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircle}>
                    <View style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={22} color={Colors.text} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            {/* 1. Show Loader */}
            <Loader visible={loading} />

            {/* 2. Conditional Logic: If items exist, show ScrollView. Else, show centered empty state */}
            {cartItems.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {cartItems.map((item) => (
                        <View key={item.cartItemId} style={styles.card}>
                            <View style={styles.imageCard}>
                                <FastImage source={{ uri: item.main_image }} style={styles.image} resizeMode="cover" />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.meta}>Caret: {item.carat}</Text>
                                <Text style={styles.meta}>Size: {item.width}MM</Text>
                                <Text style={styles.meta}>Color: {item.color}</Text>
                                <Text style={styles.price}>₹{item.final_price}</Text>

                                <View style={styles.qtyRow}>
                                    <TouchableOpacity
                                        onPress={() => handleUpdateQty(item.cartItemId, item.quantity, -1)}
                                        disabled={updateMutation.isPending}
                                        style={styles.qtyBtn}
                                    >
                                        <Ionicons name="remove" size={16} color={Colors.primary} />
                                    </TouchableOpacity>

                                    <Text style={styles.qty}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        onPress={() => handleUpdateQty(item.cartItemId, item.quantity, 1)}
                                        disabled={updateMutation.isPending}
                                        style={styles.qtyBtn}
                                    >
                                        <Ionicons name="add" size={16} color={Colors.text} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleRemove(item.cartItemId)}
                                disabled={removeMutation.isPending}
                                style={styles.delete}
                            >
                                <Ionicons name="trash-outline" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    <View style={styles.summary}>
                        <Row label="Sub Total" value={`₹${subtotal}`} />
                        <Row label="Shipping" value={`₹${shipping}`} />
                        <Row label="Total" value={`₹${total}`} bold />
                    </View>

                    {/* Spacer for the absolute checkout bar */}
                    <View style={{ height: 120 }} />
                </ScrollView>
            ) : (
                /* 3. CENTERED EMPTY STATE */
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={Colors.text} />
                    <Text style={styles.emptyText}>No items to show</Text>
                    <TouchableOpacity
                        style={styles.shopBtn}
                        onPress={() => navigation.navigate("Tabs")}
                    >
                        <Text style={styles.shopBtnText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* CHECKOUT */}
            {cartItems.length > 0 && (
                <View style={styles.checkoutBar}>
                    <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
                        <LinearGradient
                            colors={["#4A2F24", "#4A2F24"]}
                            start={{ x: 0.7, y: 0 }}
                            style={styles.checkoutBtn}
                        >
                            <Text style={styles.checkoutText}>CHECKOUT</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

function Row({ label, value, bold }) {
    return (
        <View style={styles.row}>
            <Text style={[styles.rowText, bold && styles.bold]}>{label}</Text>
            <Text style={[styles.rowText, bold && styles.bold]}>{value}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 12,
        color: Colors.text
    },

    card: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginBottom: 16,
        borderRadius: 20,
        padding: 12,
    },
    imageCard: {
        backgroundColor: Colors.white,
        height: 150,
        width: 120,
        borderRadius: 16,
        overflow: "hidden", // IMPORTANT
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    info: {
        flex: 1,
        marginLeft: 20,
        gap: 5
    },
    name: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.text,
    },
    meta: {
        fontSize: 12,
        color: "#6B7280",
    },
    price: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 4,
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    qtyBtn: {
        width: 26,
        height: 26,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    qty: {
        marginHorizontal: 10,
        fontWeight: "600",
    },

    delete: {
        justifyContent: "flex-end",
        paddingLeft: 8,
    },

    summary: {
        padding: 20,
        flex: 1
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.text
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    rowText: {
        fontSize: 14,
    },

    bold: {
        fontWeight: "700",
    },

    emptyContainer: {
        flex: 1,                    // Takes up all available space
        justifyContent: "center",   // Vertical center
        alignItems: "center",       // Horizontal center
        paddingBottom: 100,         // Offsets slightly so it's not hidden by checkout bar
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "500",
        color: "#9CA3AF",
        marginTop: 16,
    },
    shopBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: Colors.text,
    },
    shopBtnText: {
        color: Colors.white,
        fontWeight: "600",
    },

    // Ensure the checkout bar only shows if there are items
    checkoutBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.background,
        // Hide bar if cart is empty to keep screen clean
        display: 'flex',
    },

    checkoutBtn: {
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: "center",
    },

    checkoutText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
