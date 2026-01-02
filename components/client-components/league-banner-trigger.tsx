"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LeagueBannerModal from "./league-banner-modal";

export default function LeagueBannerTrigger({
  submitLeagueChanges,
}: {
  submitLeagueChanges: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="text-xl text-white font-semibold bg-transparent border-[0.5px] border-white hover:bg-white hover:text-black transition duration-200 rounded-full"
      >
        Edit Banner
      </Button>

      {open && (
        <LeagueBannerModal
          onClose={() => setOpen(false)}
          submitLeagueChanges={submitLeagueChanges}
        />
      )}
    </>
  );
}
