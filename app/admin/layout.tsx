import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import "../../app/globals.css";
import AdminSidebar from "@/components/AdminSidebar";
import LoadingProvider from "@/providers/LoadingProvider";

export const metadata: Metadata = {
  title: "Asili Yetu | Admin Console",
  description: "Administrative dashboard for Asili Yetu Safaris.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <LoadingProvider>
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </LoadingProvider>
        </div>
      </body>
    </html>
  );
}