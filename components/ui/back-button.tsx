"use client";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/protected")}
      className="p-2 rounded-full hover:bg-white/10 transition duration-200 cursor-pointer"
    >
      <IoMdArrowBack className="h-6 w-6" />
    </div>
  );
}
