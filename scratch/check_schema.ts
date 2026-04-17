import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkBookings() {
  const { data, error } = await supabase.from('bookings').select('*').limit(1);
  if (error) {
    console.error("Error fetching bookings:", error);
  } else {
    console.log("Booking example:", data[0]);
    console.log("Column names:", data[0] ? Object.keys(data[0]) : "No data");
  }
}

checkBookings();
