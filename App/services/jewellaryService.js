import { supabase } from "../lib/supabase";

export const fetchJewellary = async () => {
  const { data, error } = await supabase
    .from("jewellary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Fetch error:", error);
    throw error;
  }

  return data;
};
