"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Comment {
  id: string;
  text: string;
  username: string;
}

interface Post {
  id: string;
  permalink: string;
  media_type: string;
  thumbnail_url?: string;
  media_url: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  comments?: { data: Comment[] };
}

interface InstagramClientProps {
  posts: Post[];
}

export default function InstagramClient({ posts }: InstagramClientProps) {
  const t = useTranslations("Instagram");
  const controls = useAnimationControls();
  const [index, setIndex] = useState(0);
  const comments = [...posts.map(p => p.comments?.data || []), ...posts.map(p => p.comments?.data || [])].flat().filter(c => c.text && c.text.length > 10);

  // Auto-scroll for the comments marquee
  useEffect(() => {
    if (comments.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % (comments.length / 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [comments.length]);

  useEffect(() => {
    if (comments.length === 0) return;
    controls.start({
      x: -(index * 300), // Approximate width
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    });
  }, [index, comments.length, controls]);

  // Doubled posts for infinite effect
  const marqueePosts = [...posts, ...posts];

  return (
    <div className="relative z-10">
      {/* Social Proof Marquee */}
      {comments.length > 0 && (
        <div className="w-full overflow-hidden mb-12 relative flex items-center bg-foreground/5 py-6 rounded-2xl border border-foreground/10">
          <motion.div 
            animate={controls}
            className="flex w-max space-x-12 px-6"
          >
            {comments.map((comment, i) => (
              <div key={`${comment.id}-${i}`} className="flex items-center gap-2 w-[300px] shrink-0">
                <div className="flex flex-col">
                   <span className="text-foreground/80 font-medium italic text-xs leading-relaxed">"{comment.text.slice(0, 80)}..."</span>
                   <span className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">— @{comment.username}</span>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />
        </div>
      )}

      {/* DESKTOP GRID */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* MOBILE CONTINUOUS MARQUEE */}
      <div className="md:hidden relative w-screen -ml-6 overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-4 w-max px-4"
        >
          {marqueePosts.map((post, i) => (
            <Link 
              key={`${post.id}-${i}`} 
              href={post.permalink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative block w-72 aspect-[4/5] overflow-hidden rounded-3xl bg-foreground/10 shadow-lg shrink-0"
            >
              <Image 
                src={post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url} 
                alt={post.caption || "Safari moment"} 
                fill 
                className="object-cover" 
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                 <p className="text-[10px] text-white font-medium line-clamp-2 leading-tight">
                    {post.caption || "The spirit of the wild..."}
                 </p>
              </div>
            </Link>
          ))}
        </motion.div>
        {/* Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </div>
  );
}
