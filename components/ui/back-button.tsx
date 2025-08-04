"use client";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import NavigateWrapper from "../client-components/navigate";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="p-2 rounded-full hover:bg-white/10 transition duration-200 cursor-pointer">
      <NavigateWrapper to={"/protected"}>
        <IoMdArrowBack className="h-6 w-6" />
      </NavigateWrapper>
    </div>
  );
}
