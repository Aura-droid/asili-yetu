export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  comments?: {
    data: Array<{
       id: string;
       text: string;
       username: string;
    }>;
  };
}

const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  if (!INSTAGRAM_ACCOUNT_ID || !ACCESS_TOKEN) {
    console.warn("Instagram credentials missing. Check your .env.local file.");
    return [];
  }

  try {
    // We use the Meta Graph API to fetch recent media for the business account
    const url = `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,comments{id,text,username}&limit=${limit}&access_token=${ACCESS_TOKEN}`;
    
    const res = await fetch(url, { 
      // Revalidate cache every 60 seconds during dev to avoid sticky error caches
      next: { revalidate: 60 } 
    }); 

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`IG API Error for limit ${limit}:`, errorText);
      throw new Error(`Failed to fetch Instagram posts: ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return [];
  }
}
