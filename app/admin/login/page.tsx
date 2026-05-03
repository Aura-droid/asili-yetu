"use client";

import { useSearchParams } from "next/navigation";
import { login } from "./actions";
import { Compass, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex items-center justify-center p-6">
      <div className="bg-background rounded-3xl p-10 max-w-md w-full shadow-2xl border border-foreground/10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-green-600" />
        
        <div className="text-center mb-10 mt-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Command Center</h1>
          <p className="text-foreground/50 text-sm mt-2 font-bold uppercase tracking-widest">Asili Yetu Safaris</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form 
          className="space-y-6"
          onSubmit={async (e) => {
             e.preventDefault();
             setLoading(true);
             const formData = new FormData(e.currentTarget);
             await login(formData);
             setLoading(false);
          }}
        >
          <div>
            <label className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-wider text-xs">Admin Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              defaultValue="bookings@asiliyetusafaris.com"
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground/70 mb-2 uppercase tracking-wider text-xs">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-background font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
