import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkReviews() {
  const { data, error } = await supabase.from('reviews').select('*').limit(1);
  if (error) {
    console.error("Error fetching reviews:", error);
  } else {
    console.log("Review example:", data[0]);
    console.log("Column names:", data[0] ? Object.keys(data[0]) : "No data");
  }
}

checkReviews();
