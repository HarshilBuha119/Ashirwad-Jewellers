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