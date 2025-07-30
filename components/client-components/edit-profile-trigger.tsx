"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import EditProfileModal from "../ui/edit-profile-modal";

export default function EditProfileTrigger({
  submitProfileChanges,
}: {
  submitProfileChanges: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="text-xl text-white font-semibold bg-transparent border-[0.5px] border-white hover:bg-white 
          hover:text-black transition duration-200 rounded-full"
      >
        Edit Profile
      </Button>
      {open && (
        <EditProfileModal
          onClose={() => setOpen(false)}
          submitProfileChanges={submitProfileChanges}
        />
      )}
    </>
  );
}
