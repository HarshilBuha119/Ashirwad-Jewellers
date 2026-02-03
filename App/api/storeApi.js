import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../lib/supabase";
import auth from '@react-native-firebase/auth';

const getUserId = () => auth().currentUser?.uid;

// --- API ---
export const fetchJewellary = async () => {
    const { data, error } = await supabase.from("jewellary").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
};

export const fetchFavorites = async () => {
    const userId = getUserId();
    if (!userId) return [];
    const { data, error } = await supabase.from('favorites').select('product_id, jewellary(*)').eq('user_id', userId);
    if (error) throw error;
    return data.map(f => f.jewellary);
};

// --- HOOKS ---
export const useJewellary = () => useQuery({ queryKey: ['jewellary'], queryFn: fetchJewellary });

export const useMetalRates = () => useQuery({ 
    queryKey: ['metalRates'], 
    queryFn: async () => {
        const { data, error } = await supabase.from('metal_rates').select('*');
        if (error) throw error;
        return data;
    }
});

export const useFavorites = () => useQuery({ queryKey: ['favorites'], queryFn: fetchFavorites });

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, isFav }) => {
            const userId = getUserId();
            if (isFav) {
                return supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
            }
            return supabase.from('favorites').insert([{ user_id: userId, product_id: productId }]);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    });
};