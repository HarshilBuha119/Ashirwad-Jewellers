import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AppImage from "../components/AppImage";
import Colors from "../theme/Colors";
import { useCart } from "../context/CartContext";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "@d11/react-native-fast-image";

export default function CartScreen({ navigation }) {
    const {
        cartItems,
        updateQuantity,
        removeItem,
        subtotal,
        shipping,
        total,
    } = useCart();
    console.log(cartItems);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircle}>
                    <View style={{ paddingRight: 10 }}>
                        <Ionicons name="chevron-back" size={22} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {cartItems.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.imageCard}>
                            <FastImage source={{ uri: item.main_image }} style={styles.image} resizeMode="cover" />
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.meta}>Caret: {item.carat}</Text>
                            <Text style={styles.meta}>Size: {item.width}MM</Text>
                            <Text style={styles.meta}>Color: {item.color}</Text>
                            <Text style={styles.price}>${item.price}</Text>

                            <View style={styles.qtyRow}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(index, -1)}
                                    style={styles.qtyBtn}
                                >
                                    <Ionicons name="remove" size={16} color={Colors.primary} />
                                </TouchableOpacity>

                                <Text style={styles.qty}>{item.quantity}</Text>

                                <TouchableOpacity
                                    onPress={() => updateQuantity(index, 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Ionicons name="add" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => removeItem(index)}
                            style={styles.delete}
                        >
                            <Ionicons name="trash-outline" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                ))}

                {cartItems.length > 0 ? (
                    <View style={styles.summary}>
                        <Row label="Sub Total" value={`$${subtotal}`} />
                        <Row label="Shipping" value={`$${shipping}`} />
                        <Row label="Total" value={`$${total}`} bold />
                    </View>
                ) :
                    <View style={styles.summary}>
                        <Text style={{ textAlign: "center", fontSize: 25, alignItems: "center", justifyContent: "center" }}>No item to show</Text>
                    </View>}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* CHECKOUT */}
            <View style={styles.checkoutBar}>
                <TouchableOpacity onPress={() => navigation.navigate("Payment")}>
                    <LinearGradient
                        colors={["#004e92", "#000428"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.checkoutBtn}
                    >
                        <Text style={styles.checkoutText}>CHECKOUT</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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

    checkoutBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.background,
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
