import { supabase, Jewelry, Favorite, MetalRate } from "@/lib/supabase";

// ===== JEWELRY API =====
export async function fetchJewelry() {
  const { data, error } = await supabase
    .from("jewellary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jewelry:", error);
    throw error;
  }

  return data as Jewelry[];
}

export async function fetchJewelryById(id: string) {
  const { data, error } = await supabase
    .from("jewellary")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching jewelry:", error);
    throw error;
  }

  return data as Jewelry;
}

export async function fetchJewelryByCategory(category: string) {
  const { data, error } = await supabase
    .from("jewellary")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jewelry by category:", error);
    throw error;
  }

  return data as Jewelry[];
}

// ===== FAVORITES API =====
export async function fetchFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("*, jewellary(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }

  return data;
}

export async function toggleFavorite(userId: string, productId: string, isFavorited: boolean) {
  if (isFavorited) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, product_id: productId }]);

    if (error) throw error;
  }
}

export async function isFavorited(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  return !error && !!data;
}

// ===== METAL RATES API =====
export async function fetchMetalRates() {
  const { data, error } = await supabase
    .from("metal_rates")
    .select("*");

  if (error) {
    console.error("Error fetching metal rates:", error);
    throw error;
  }

  return data as MetalRate[];
}

// ===== ORDERS API =====
export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number; price: number }[],
  totalAmount: number
) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: data.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return data;
}

export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, jewellary(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }

  return data;
}
