import { supabase } from "../lib/supabase";
import auth from '@react-native-firebase/auth';

// Helper to get Firebase UID
const getUserId = () => auth().currentUser?.uid;

/** FAVORITES **/
export const fetchFavorites = async () => {
  const userId = getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('product_id, jewellary(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(f => f.jewellary);
};

export const addFavorite = async (productId) => {
  const userId = getUserId();
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, product_id: productId }]);
  if (error) throw error;
};

export const removeFavorite = async (productId) => {
  const userId = getUserId();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
};

/** ORDERS **/
export const createOrder = async (orderData) => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...orderData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** CART **/

// Fetch all items in the cart for the current user
export const fetchCart = async () => {
  const userId = getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('cart')
    .select('*, jewellary(*)')
    .eq('user_id', userId);

  if (error) throw error;

  // Format to flatten the product details into the item object
  return data.map(item => ({
    ...item.jewellary,
    ...item.options,
    cartItemId: item.id,
    quantity: item.quantity,
    productId: item.product_id
  }));
};

// Add to cart or increment quantity if exists
export const addToCart = async (productId, options) => {
  const userId = getUserId();
  if (!userId) throw new Error("User not logged in");

  // Check if this exact product + options combo exists
  const { data: existing } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .contains('options', options)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('cart')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('cart')
      .insert([{
        user_id: userId,
        product_id: productId,
        options: options,
        quantity: 1
      }]);
    if (error) throw error;
  }
};

// Update quantity (+1 or -1)
export const updateCartQuantity = async (cartItemId, newQty) => {
  if (newQty <= 0) return removeCartItem(cartItemId);

  const { error } = await supabase
    .from('cart')
    .update({ quantity: newQty })
    .eq('id', cartItemId);

  if (error) throw error;
};

// Remove single item
export const removeCartItem = async (cartItemId) => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
};

// Clear entire cart (used after placing an order)
export const clearCart = async () => {
  const userId = getUserId();
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
};


/** METAL RATES **/
export const fetchMetalRates = async () => {
  const { data, error } = await supabase
    .from('metal_rates')
    .select('*');

  if (error) throw error;
  return data; // Returns [{metal_type: "Gold", rate_per_gm_24k: 7500}, ...]
};