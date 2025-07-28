"use server";

import LeftSidebar from "@/components/LeftSidebar";
import RightSection from "@/components/RightSection";
import BackButton from "@/components/client-components/back-button";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const username = params.username;

  return (
    <div className="w-full h-full flex justify-center text-white items-center relative bg-black">
      <div className="max-w-[80vw] w-full h-full flex relative">
        <LeftSidebar />
        <main className="sticky top-0 flex w-[55%] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
          <div className="flex flex-row justify-start items-center ml-4">
            <BackButton />
            <h1 className="text-xl font-bold py-6 px-6 backdrop-blur bg-black/10 sticky top-0">
              {username}
            </h1>
          </div>
        </main>
        <RightSection />
      </div>
    </div>
  );
}
