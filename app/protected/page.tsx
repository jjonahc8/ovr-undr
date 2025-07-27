import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LeftSidebar from "@/components/LeftSidebar";
import MainComponent from "@/components/MainComponent";
import RightSection from "@/components/RightSection";
import React from "react";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar />
        {(async () => {
          const mainComponentResult = await MainComponent();
          if (React.isValidElement(mainComponentResult)) {
            return mainComponentResult;
          }
          return <div>Error loading timeline</div>;
        })()}
        <RightSection />
      </div>
    </div>
  );
}
