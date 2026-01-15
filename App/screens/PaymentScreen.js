import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../theme/Colors";
import { useCart } from "../context/CartContext";

export default function PaymentScreen({ navigation }) {
    const [name, setName] = useState("");
    const [method, setMethod] = useState("UPI");
    const [upiId, setUpiId] = useState("");
    const [cardNo, setCardNo] = useState("");
    const { placeOrder } = useCart();
    // Add async here
    const handlePlaceOrder = async () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Please enter your name.");
            return;
        }
        // ... other validations

        try {
            // AWAIT the result from context
            const result = await placeOrder(
                { name },
                { method, upiId: upiId.trim(), cardNo: cardNo.trim() }
            );

            // Supabase returns the data object on success
            if (result) {
                Alert.alert("Success", "Order placed successfully.", [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Orders"),
                    },
                ]);
            }
        } catch (error) {
            console.error("Order Error:", error);
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Payment Details</Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Full name"
                    style={styles.input}
                />

                <Text style={[styles.label, { marginTop: 12 }]}>Payment Method</Text>
                <View style={styles.methods}>
                    {["UPI", "Card", "Cash", "UPI Apps"].map((m) => (
                        <TouchableOpacity
                            key={m}
                            onPress={() => setMethod(m)}
                            style={[
                                styles.methodBtn,
                                method === m && styles.methodBtnActive,
                            ]}
                        >
                            <Text style={[styles.methodText, method === m && styles.methodTextActive]}>
                                {m}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {method === "UPI" || method === "UPI Apps" ? (
                    <>
                        <Text style={styles.label}>UPI ID</Text>
                        <TextInput
                            value={upiId}
                            onChangeText={setUpiId}
                            placeholder="example@upi"
                            style={styles.input}
                            autoCapitalize="none"
                            keyboardType="default"
                        />
                    </>
                ) : null}

                {method === "Card" ? (
                    <>
                        <Text style={styles.label}>Card Number</Text>
                        <TextInput
                            value={cardNo}
                            onChangeText={setCardNo}
                            placeholder="4242 4242 4242 4242"
                            style={styles.input}
                            keyboardType="number-pad"
                        />
                    </>
                ) : null}

                <TouchableOpacity style={styles.payBtn} onPress={handlePlaceOrder}>
                    <Text style={styles.payText}>Place Order</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    card: {
        margin: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 4,
    },
    title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
    label: { fontSize: 13, color: "#4B5563", marginTop: 8 },
    input: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        backgroundColor: "#fff",
    },
    methods: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
    methodBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginRight: 8,
        marginTop: 8,
    },
    methodBtnActive: {
        borderColor: Colors.primary,
        backgroundColor: "#eef2ff",
    },
    methodText: { color: "#374151" },
    methodTextActive: { color: Colors.primary, fontWeight: "700" },
    payBtn: {
        marginTop: 18,
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});