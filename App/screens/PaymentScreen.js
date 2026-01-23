import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import auth from "@react-native-firebase/auth"; // Import Firebase Auth
import Colors from "../theme/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createOrder, clearCart, fetchCart } from "../services/api"; // Added fetchCart

export default function PaymentScreen({ navigation }) {
    const [name, setName] = useState("");
    const [method, setMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    // 1. GET CART ITEMS FROM REACT QUERY CACHE
    // We use the same key ['cart'] used in your CartScreen
    const { data: cartItems } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: false, // Don't refetch, just use what's in cache
    });

    // 2. CALCULATE TOTAL HELPER
    const totalAmount = useMemo(() => {
        if (!cartItems) return 0;
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

    const handlePlaceOrder = async () => {
        // Validation
        if (!name.trim()) {
            Alert.alert("Required", "Please enter the recipient's name.");
            return;
        }
        if (method === "UPI" && !upiId.includes("@")) {
            Alert.alert("Invalid ID", "Please enter a valid UPI ID.");
            return;
        }
        if (method === "Card" && cardNo.length < 16) {
            Alert.alert("Invalid Card", "Please enter a valid 16-digit card number.");
            return;
        }
        if (!cartItems || cartItems.length === 0) {
            Alert.alert("Empty Cart", "There are no items to order.");
            return;
        }

        setLoading(true);
        try {
            const user = auth().currentUser;
            
            const orderData = {
                user_id: user?.uid, // Firebase UID string
                items: cartItems,   // Array of items from cart
                total_amount: totalAmount,
                status: "placed",
                customer_info: {
                    name: name.trim(),
                    payment_method: method,
                    upi_id: method === "UPI" ? upiId : null,
                    card_last_four: method === "Card" ? cardNo.slice(-4) : null
                },
                created_at: new Date().toISOString(),
            };

            // 1. Save to Supabase
            const result = await createOrder(orderData);

            if (result) {
                // 2. Clear the database cart table for this user
                await clearCart();

                // 3. Refresh React Query cache
                queryClient.invalidateQueries(['cart']);

                // 4. Navigate to success
                Alert.alert("Order Placed", "Your order has been received successfully!", [
                    { text: "View My Orders", onPress: () => navigation.navigate("Orders") }
                ]);
            }
        } catch (error) {
            console.error("Order Error:", error);
            Alert.alert("Error", "Could not process order. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentOption = (m, icon, iconLib) => {
        const isActive = method === m;
        const IconComponent = iconLib === "MC" ? MaterialCommunityIcons : Ionicons;

        return (
            <TouchableOpacity
                onPress={() => setMethod(m)}
                style={[styles.methodCard, isActive && styles.methodCardActive]}
            >
                <IconComponent
                    name={icon}
                    size={28}
                    color={isActive ? Colors.text : "#9CA3AF"}
                />
                <Text style={[styles.methodLabel, isActive && styles.methodLabelActive]}>{m}</Text>
                {isActive && (
                    <View style={styles.activeDot}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.text} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Amount to Pay</Text>
                        <Text style={styles.summaryAmount}>₹{totalAmount.toFixed(2)}</Text>
                    </View>

                    <Text style={styles.sectionLabel}>SHIPPING RECIPIENT</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={Colors.text} style={styles.inputIcon} />
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Full Name"
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                        />
                    </View>

                    <Text style={[styles.sectionLabel, { marginTop: 30 }]}>PAYMENT METHOD</Text>
                    <View style={styles.methodsGrid}>
                        {renderPaymentOption("UPI", "qrcode-scan", "MC")}
                        {renderPaymentOption("Card", "card-outline", "Ion")}
                        {renderPaymentOption("Cash", "cash-outline", "Ion")}
                    </View>

                    <View style={styles.dynamicInputArea}>
                        {method === "UPI" && (
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="at" size={20} color={Colors.text} style={styles.inputIcon} />
                                <TextInput
                                    value={upiId}
                                    onChangeText={setUpiId}
                                    placeholder="yourname@upi"
                                    placeholderTextColor="#9CA3AF"
                                    style={styles.input}
                                    autoCapitalize="none"
                                />
                            </View>
                        )}

                        {method === "Card" && (
                            <View style={styles.inputWrapper}>
                                <Ionicons name="card-outline" size={20} color={Colors.text} style={styles.inputIcon} />
                                <TextInput
                                    value={cardNo}
                                    onChangeText={setCardNo}
                                    placeholder="Card Number (16 digits)"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="number-pad"
                                    style={styles.input}
                                    maxLength={16}
                                />
                            </View>
                        )}

                        {method === "Cash" && (
                            <View style={styles.cashNotice}>
                                <Ionicons name="information-circle-outline" size={20} color="#4B5563" />
                                <Text style={styles.cashNoticeText}>
                                    Pay securely at your doorstep upon delivery.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.safetyRow}>
                        <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                        <Text style={styles.safetyText}>Secure SSL Encrypted Payment</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (loading || totalAmount === 0) && styles.disabledBtn]}
                        onPress={handlePlaceOrder}
                        disabled={loading || totalAmount === 0}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.payText}>Confirm & Place Order</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backBtn: { padding: 8, borderRadius: 12 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
    scrollContent: { padding: 24 },
    summaryCard: {
        backgroundColor: "#F3F4F6",
        padding: 20,
        borderRadius: 20,
        marginBottom: 30,
        alignItems: 'center'
    },
    summaryLabel: { fontSize: 14, color: "#6B7280", marginBottom: 5 },
    summaryAmount: { fontSize: 32, fontWeight: "800", color: Colors.text },
    sectionLabel: { fontSize: 12, fontWeight: "800", color: "#9CA3AF", letterSpacing: 1.2, marginBottom: 16 },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, height: 56, fontSize: 15, color: "#1F2937", fontWeight: "500" },
    methodsGrid: { flexDirection: "row", justifyContent: "space-between" },
    methodCard: {
        width: "30%",
        backgroundColor: "#F9FAFB",
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#F3F4F6",
    },
    methodCardActive: { 
        borderColor: Colors.text, 
        backgroundColor: "#FFF",
        elevation: 2,
    },
    methodLabel: { marginTop: 10, fontSize: 13, fontWeight: "600", color: "#6B7280" },
    methodLabelActive: { color: Colors.text },
    activeDot: { position: "absolute", top: 8, right: 8 },
    dynamicInputArea: { marginTop: 24 },
    cashNotice: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#F3F4F6", 
        padding: 16, 
        borderRadius: 12 
    },
    cashNoticeText: { marginLeft: 10, color: "#4B5563", fontSize: 14, fontWeight: "500" },
    footer: { padding: 24 },
    safetyRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16 },
    safetyText: { fontSize: 11, color: Colors.text, marginLeft: 6, fontWeight: "500" },
    payBtn: {
        backgroundColor: Colors.text,
        height: 60,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledBtn: { opacity: 0.6 },
    payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
})