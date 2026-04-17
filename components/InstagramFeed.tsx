import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { getInstagramPosts } from "@/lib/instagram";
import { getTranslations } from "next-intl/server";
import InstagramClient from "./InstagramClient";

export default async function InstagramFeed() {
  const MIN_COMMENT_LENGTH = 10;
  const MAX_COMMENT_DISPLAY_LENGTH = 80;

  const t = await getTranslations("Instagram");
  const posts = await getInstagramPosts(6);

  // If no posts yet, we'll still render the section to reassure the user
  const isEmpty = !posts || posts.length === 0;

  return (
    <section className="py-24 px-6 md:px-12 bg-foreground/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 shadow-xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8 text-white"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
                {t("title")}
              </h2>
              <p className="text-foreground/60 font-medium mt-1">{t("sub")}</p>
            </div>
          </div>
          <a 
            href="https://instagram.com/asiliyetusafaris/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-6 py-3 rounded-full border-2 border-foreground/10 text-sm font-bold uppercase tracking-widest hover:border-pink-500 hover:text-pink-500 transition-colors"
          >
            {t("follow")}
          </a>
        </div>

        <InstagramClient posts={posts} />

        {isEmpty && (
          <div className="flex flex-col items-center justify-center p-12 bg-foreground/5 rounded-3xl border border-dashed border-foreground/20 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12 text-foreground/30 mb-4"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <h3 className="text-xl font-bold text-foreground/60 mb-2">{t("empty_title")}</h3>
            <p className="text-foreground/50 max-w-sm">
               {t("empty_desc")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
