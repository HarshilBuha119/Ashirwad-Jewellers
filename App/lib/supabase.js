import { createClient } from '@supabase/supabase-js';
import "react-native-url-polyfill/auto";

export const SUPABASE_URL = 'https://xlcshdtizkqibimmnnnl.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_AvGxLEIA0VG9o4SAbdkGTw_rkN3K88Z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});
