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
import auth from "@react-native-firebase/auth";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Theme & API
import Colors from "../theme/Colors";
import Spacing from "../theme/Spacing";
import { createOrder, clearCart, fetchCart } from "../api/orderApi";

export default function PaymentScreen({ navigation }) {
    const [name, setName] = useState("");
    const [method, setMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [loading, setLoading] = useState(false);

    const queryClient = useQueryClient();

    // 1. GET CART DATA
    const { data: cartItems } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        enabled: false, // Accessing existing cache
    });

    // 2. CALCULATE TOTAL
    const totalAmount = useMemo(() => {
        if (!cartItems) return 0;
        return cartItems.reduce((sum, item) => sum + (item.final_price * item.quantity), 0);
    }, [cartItems]);

    const handlePlaceOrder = async () => {
        // Form Validation logic
        if (!name.trim()) return Alert.alert("Required", "Please enter the recipient's name.");
        if (method === "UPI" && !upiId.includes("@")) return Alert.alert("Invalid ID", "Enter a valid UPI ID.");
        if (method === "Card" && cardNo.length < 16) return Alert.alert("Invalid Card", "Enter a valid 16-digit card number.");
        if (!cartItems || cartItems.length === 0) return Alert.alert("Empty Cart", "No items to order.");

        setLoading(true);
        try {
            const user = auth().currentUser;
            
            const orderData = {
                user_id: user?.uid,
                items: cartItems,
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

            const result = await createOrder(orderData);

            if (result) {
                await clearCart();
                queryClient.invalidateQueries(['cart']);
                
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
                activeOpacity={0.7}
            >
                <IconComponent
                    name={icon}
                    size={28}
                    color={isActive ? Colors.text : Colors.muted}
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
                style={styles.flex}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryLabel}>Total Amount to Pay</Text>
                        <Text style={styles.summaryAmount}>₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
                    </View>

                    <Text style={styles.sectionLabel}>SHIPPING RECIPIENT</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name="person-outline" size={20} color={Colors.text} style={styles.inputIcon} />
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.muted}
                            style={styles.input}
                        />
                    </View>

                    <Text style={[styles.sectionLabel, styles.marginTop]}>PAYMENT METHOD</Text>
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
                                    placeholderTextColor={Colors.muted}
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
                                    placeholderTextColor={Colors.muted}
                                    style={styles.input}
                                    keyboardType="number-pad"
                                    maxLength={16}
                                />
                            </View>
                        )}

                        {method === "Cash" && (
                            <View style={styles.cashNotice}>
                                <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
                                <Text style={styles.cashNoticeText}>
                                    Pay securely at your doorstep upon delivery.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.safetyRow}>
                        <Ionicons name="shield-checkmark" size={14} color={Colors.success || "#10B981"} />
                        <Text style={styles.safetyText}>Secure SSL Encrypted Payment</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.payBtn, (loading || totalAmount === 0) && styles.disabledBtn]}
                        onPress={handlePlaceOrder}
                        disabled={loading || totalAmount === 0}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.white} />
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
    container: { flex: 1, backgroundColor: Colors.white },
    flex: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    backBtn: { padding: Spacing.xs },
    headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
    placeholder: { width: 40 },
    scrollContent: { padding: Spacing.lg },
    summaryCard: {
        backgroundColor: Colors.background,
        padding: Spacing.lg,
        borderRadius: 20,
        marginBottom: Spacing.xl,
        alignItems: 'center'
    },
    summaryLabel: { fontSize: 14, color: Colors.muted, marginBottom: 5 },
    summaryAmount: { fontSize: 32, fontWeight: "800", color: Colors.text },
    sectionLabel: { fontSize: 12, fontWeight: "800", color: Colors.muted, letterSpacing: 1.2, marginBottom: Spacing.md },
    marginTop: { marginTop: Spacing.xl },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.background,
        borderRadius: 16,
        paddingHorizontal: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputIcon: { marginRight: Spacing.sm },
    input: { flex: 1, height: 56, fontSize: 15, color: Colors.text, fontWeight: "500" },
    methodsGrid: { flexDirection: "row", justifyContent: "space-between" },
    methodCard: {
        width: "30%",
        backgroundColor: Colors.background,
        paddingVertical: Spacing.lg,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    methodCardActive: { 
        borderColor: Colors.text, 
        backgroundColor: Colors.white,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    methodLabel: { marginTop: 10, fontSize: 13, fontWeight: "600", color: Colors.muted },
    methodLabelActive: { color: Colors.text },
    activeDot: { position: "absolute", top: 8, right: 8 },
    dynamicInputArea: { marginTop: Spacing.lg },
    cashNotice: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: Colors.background, 
        padding: Spacing.md, 
        borderRadius: 12 
    },
    cashNoticeText: { marginLeft: 10, color: Colors.primary, fontSize: 14, fontWeight: "500" },
    footer: { padding: Spacing.lg },
    safetyRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: Spacing.md },
    safetyText: { fontSize: 11, color: Colors.text, marginLeft: 6, fontWeight: "500" },
    payBtn: {
        backgroundColor: Colors.text,
        height: 60,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    disabledBtn: { opacity: 0.6 },
    payText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});