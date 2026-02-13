import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xlcshdtizkqibimmnnnl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_AvGxLEIA0VG9o4SAbdkGTw_rkN3K88Z';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types for database tables
export interface Jewelry {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  metal_type: string;
  weight?: number;
  created_at: string;
}

export interface Product extends Jewelry {}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface MetalRate {
  id: string;
  metal_name: string;
  rate: number;
  updated_at: string;
}
