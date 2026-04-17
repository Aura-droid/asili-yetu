"use client";

import { motion } from "framer-motion";
import { Camera, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ClientGallery({ posts }: { posts: any[] }) {
  const t = useTranslations("Gallery"); 
  
  // Create an alternating masonry-like layout style based on index
  const getSpan = (index: number) => {
    const cycle = index % 8;
    if (cycle === 0 || cycle === 6) return "md:col-span-2 md:row-span-2";
    if (cycle === 3) return "md:col-span-2 md:row-span-1";
    if (cycle === 4) return "md:col-span-1 md:row-span-2";
    return "md:col-span-1 md:row-span-1";
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 selection:bg-primary selection:text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 text-primary font-bold tracking-widest uppercase text-sm mb-6"
          >
            <Camera className="w-5 h-5" /> {t("badge")}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[1.1] mb-6"
          >
            {t.rich("title", {
              p: (chunks) => <span className="text-foreground/50 italic font-serif">{chunks}</span>
            })}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto"
          >
            {t("sub")}
          </motion.p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 bg-foreground/5 rounded-3xl border border-dashed border-foreground/20 text-center">
             <Camera className="w-12 h-12 text-foreground/30 mb-4" />
             <h3 className="text-xl font-bold text-foreground/60">{t("awaiting")}</h3>
             <p className="text-foreground/50 max-w-sm mt-2">{t("connect")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 md:gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ duration: 0.6, delay: (navigator.maxTouchPoints > 0 ? 0 : (i % 8) * 0.1) }}
                className={`relative rounded-3xl overflow-hidden group border border-foreground/10 ${getSpan(i)}`}
              >
                <Link href={post.permalink || "#"} target={post.permalink ? "_blank" : "_self"} rel="noopener noreferrer" className="block w-full h-full">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-color-burn" />
                  
                  <Image 
                    src={post.url}
                    alt={post.caption?.substring(0, 50) || "Safari imagery"}
                    fill
                    className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Gradient Overlay & Metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-6 md:p-8">
                     <p className="text-white text-sm md:text-base font-medium line-clamp-2 md:line-clamp-3 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 italic">
                        {post.caption || "A breathtaking moment recorded on safari."}
                     </p>
                     <div className="flex items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                        <div className="flex items-center gap-2">
                           <Camera className="w-4 h-4 text-primary" />
                           <span className="text-white/60 font-black text-[10px] tracking-widest uppercase">{post.source === 'instagram' ? 'Instagram' : 'Asili Archive'}</span>
                        </div>
                     </div>
                  </div>

                  {/* Format Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">
                       {post.type === 'video' ? t("video") : t("photo")}
                     </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
