import { getSettings } from "@/app/actions/settings";
import SettingsUI from "./SettingsUI";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Admin | Global Settings",
};

export default async function AdminSettingsPage() {
  const { data, error } = await getSettings();

  if (error) {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto mt-20 bg-red-500/10 border border-red-500/30 rounded-3xl">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground mb-4">Helm Connection Failed</h2>
        <p className="text-foreground/70">
           {error === "needs_migration" 
             ? "The settings vault has not been forged. Please run the migration script."
             : `Error: ${error}`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full mb-32 bg-background">
       <SettingsUI initialSettings={data} />
    </div>
  );
}
