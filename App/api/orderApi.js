import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../lib/supabase";
import auth from '@react-native-firebase/auth';

const getUserId = () => auth().currentUser?.uid;

/**
 * HOOK: Fetch Cart Items
 * Joins jewelry details and flattens options for easier UI rendering
 */
export const useCart = () => useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
        const userId = getUserId();
        if (!userId) return [];

        const { data, error } = await supabase
            .from('cart')
            .select('*, jewellary(*)')
            .eq('user_id', userId);

        if (error) throw error;

        return data.map(item => ({
            ...item.jewellary,
            ...item.options,
            cartItemId: item.id,
            quantity: item.quantity,
            productId: item.product_id,
            // Keeping the original jewelry price for fallback
            basePrice: item.jewellary?.price 
        }));
    },
    enabled: !!getUserId(), // Only run if user is logged in
});

/**
 * HOOK: Add to Cart
 * Handles incremental updates if item with same options already exists
 */
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, options }) => {
            const userId = getUserId();
            
            // Check for existing duplicate with same options
            const { data: existing } = await supabase
                .from('cart')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .contains('options', options)
                .maybeSingle(); // Better than .single() as it doesn't throw if 0 found

            if (existing) {
                return supabase
                    .from('cart')
                    .update({ quantity: existing.quantity + 1 })
                    .eq('id', existing.id);
            }

            return supabase
                .from('cart')
                .insert([{ user_id: userId, product_id: productId, options, quantity: 1 }]);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });
};

/**
 * HOOK: Create Order
 * Persists order and purges the user's cart on success
 */
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (orderData) => {
            const userId = getUserId();
            
            // 1. Insert Order
            const { data, error } = await supabase
                .from('orders')
                .insert([{ ...orderData, user_id: userId }])
                .select()
                .single();

            if (error) throw error;

            // 2. Clear Cart only for this specific user
            const { error: clearError } = await supabase
                .from('cart')
                .delete()
                .eq('user_id', userId);

            if (clearError) console.error("Cart clear warning:", clearError);
            
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

/**
 * HOOK: Fetch User Orders
 * Fetches order history for the authenticated user only
 */
export const useUserOrders = () => useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
        const userId = getUserId();
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId) // Added missing filter
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },
    enabled: !!getUserId(),
});