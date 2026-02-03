import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "../lib/supabase";

// --- PURE API FUNCTIONS ---

const fetchActiveBanner = async () => {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

const updateBannerStatus = async ({ id, is_active }) => {
    const { data, error } = await supabase
        .from('banners')
        .update({ is_active })
        .eq('id', id);

    if (error) throw new Error(error.message);
    return data;
};

// --- REACT QUERY HOOKS ---

export const useActiveBanner = () => {
    return useQuery({
        queryKey: ['activeBanner'],
        queryFn: fetchActiveBanner,
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes
        retry: 2,
    });
};

export const useToggleBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBannerStatus,
        onSuccess: () => {
            // Refetch banner data whenever a status change occurs
            queryClient.invalidateQueries({ queryKey: ['activeBanner'] });
        },
    });
};