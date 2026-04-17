import { getAllReviews } from "@/app/actions/reviews";
import ReviewsUI from "./ReviewsUI";
import { MessageSquare, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Admin | Guest Voice Moderation",
};

export default async function AdminReviewsPage() {
  const { data: reviews, error } = await getAllReviews();

  if (error) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground mb-4">Command Center Error</h2>
        <p className="text-foreground/70">
          We encountered an issue while scouting for guest voices: <br />
          <code className="bg-red-500/20 px-2 py-1 rounded mt-2 inline-block text-red-200">
            {error === '42P01' ? "The 'package_ratings' table does not exist in your database." : error}
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full mb-32 bg-background min-h-screen">
       <div className="flex items-center gap-6 mb-16">
          <div className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-lg">
             <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-6xl font-black text-foreground tracking-tighter">Guest Voice & Sentiment</h1>
            <p className="text-foreground/50 text-xl font-medium mt-1">Review and manage guest testimonials from the field.</p>
          </div>
       </div>

       <ReviewsUI initialReviews={reviews || []} />
    </div>
  );
}
