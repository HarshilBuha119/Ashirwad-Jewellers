import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../theme/Colors";
import AppImage from "../components/AppImage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useUserOrders } from "../hooks/useStore";
import Loader from "../components/Loader";

export default function OrdersScreen({ navigation }) {
  const { data: orders, isLoading, refetch } = useUserOrders();
  if (isLoading) return <Loader visible={true} />;
  if (!orders.length) {
    return (
      <SafeAreaView style={styles.empty}>
        <Text style={styles.emptyText}>No orders yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Orders</Text>

        {/* spacer to balance header */}
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        refreshing={isLoading}
        onRefresh={refetch}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          // ... inside FlatList renderItem
          <View style={styles.orderCard}>
            <View style={styles.header}>
              <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
              {/* Use created_at instead of date */}
              <Text style={styles.date}>
                {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
              </Text>
            </View>

            {/* Nested FlatList for items */}
            <FlatList
              data={item.items}
              keyExtractor={(it, i) => i.toString()}
              renderItem={({ item: it }) => (
                <View style={styles.row}>
                  {/* it.image depends on how you saved it in CartContext */}
                  <AppImage source={{ uri: it.image || it.main_image }} style={styles.thumb} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>{it.name}</Text>
                    <Text style={styles.meta}>Qty: {it.quantity}</Text>
                  </View>
                  <Text style={styles.itemTotal}>₹{(it.price * it.quantity).toFixed(2)}</Text>
                </View>
              )}
            />

            <View style={styles.summary}>
              <Text style={styles.totalLabel}>Total</Text>
              {/* Use total_amount instead of total */}
              <Text style={styles.totalValue}>
                ₹{item.total_amount ? Number(item.total_amount).toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    marginBottom: 30
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  emptyText: { color: "#6B7280", fontSize: 18 },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  orderId: { fontWeight: "700" },
  date: { color: "#6B7280", fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  name: { fontWeight: "600" },
  meta: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  itemTotal: { fontWeight: "700" },
  summary: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  totalLabel: { color: "#6B7280" },
  totalValue: { fontWeight: "700" },
});