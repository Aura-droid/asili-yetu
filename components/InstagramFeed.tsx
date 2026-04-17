import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { getInstagramPosts } from "@/lib/instagram";
import { getTranslations } from "next-intl/server";

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

        {/* Social Proof Marquee (Real comments from real posts) */}
        {posts.some(p => p.comments?.data && p.comments.data.length > 0) && (
          <div className="w-full overflow-hidden mb-12 relative flex items-center bg-foreground/5 py-4 rounded-2xl border border-foreground/10">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0d1511] to-transparent z-10" />
            <div className="flex w-max animate-marquee space-x-12 px-6">
              {[...posts.map(p => p.comments?.data || []), ...posts.map(p => p.comments?.data || [])].flat().filter(c => c.text && c.text.length > MIN_COMMENT_LENGTH).map((comment, i) => (
                <div key={`${comment.id}-${i}`} className="flex items-center gap-2">
                  <span className="text-foreground/80 font-medium italic text-sm md:text-base">"{comment.text.slice(0, MAX_COMMENT_DISPLAY_LENGTH)}{comment.text.length > MAX_COMMENT_DISPLAY_LENGTH ? '...' : ''}"</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">— @{comment.username}</span>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0d1511] to-transparent z-10" />
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
              .animate-marquee { animation: marquee 30s linear infinite; }
              .animate-marquee:hover { animation-play-state: paused; }
            `}} />
          </div>
        )}

        {isEmpty ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-foreground/10 shadow-lg"
              >
                <Image 
                  src={post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url} 
                  alt={post.caption || "Safari moment by Asili Yetu"} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Overlay with caption and metrics on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium line-clamp-3 drop-shadow-md">
                      {post.caption || "A breathtaking moment captured in the wild."}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-white/70 font-semibold tracking-wider">
                        {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5 opacity-90">
                           <Heart className="w-4 h-4 fill-white text-white" />
                           <span className="text-xs font-bold">{post.like_count || 0}</span>
                         </div>
                         <div className="flex items-center gap-1.5 opacity-90">
                           <MessageCircle className="w-4 h-4 fill-white text-white" />
                           <span className="text-xs font-bold">{post.comments_count || 0}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {post.media_type === 'VIDEO' ? t('video') : post.media_type === 'CAROUSEL_ALBUM' ? t('carousel') : t('photo')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
