import React from "react";
import CultureUI from "./CultureUI";
import { getCultureStories } from "@/app/actions/culture";

export default async function AdminCulturePage() {
  const stories = await getCultureStories();

  return (
    <main className="p-8 md:p-12 lg:p-20 bg-[#fafafa] min-h-screen">
       <CultureUI stories={stories} />
    </main>
  );
}
