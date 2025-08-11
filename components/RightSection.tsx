"use client";
import { BsSearch } from "react-icons/bs";
import NavigateWrapper from "./client-components/navigate";

export default function RightSection() {
  return (
    <section className="w-[30%] flex-col space-y-4 items-stretch h-screen px-6 sticky top-0 overflow-scroll">
      <div className="sticky top-0 bg-black">
        <div className="mt-2">
          <div className="relative w-full h-full group">
            <input
              id="searchBox"
              type="text"
              placeholder="Search FreePlay"
              className="outline-none peer focus:border-primary focus:border w-full h-full rounded-xl py-4 pl-14 pr-4
              bg-black border-gray-600 border-[0.5px]"
            />
            <label
              htmlFor="searchBox"
              className="absolute top-0 left-0 flex items-center justify-center p-4 text-gray-500
                    peer-focus:text-primary"
            >
              <BsSearch className="w-5 h-5" />
            </label>
          </div>
        </div>
      </div>
      <div>
        <NavigateWrapper to={"/leaderboard/CHANGETHISTOLEADERBOARDID"}>
          <div className="flex flex-col rounded-xl border-gray-600 border-[0.5px]">
            <h3 className="font-bold text-xl py-4 px-4">Top bettors</h3>
          </div>
        </NavigateWrapper>
      </div>
      <div className="flex flex-col rounded-xl border-gray-600 border-[0.5px]">
        <h3 className="font-bold text-xl my-4 px-4">You might know</h3>
      </div>
    </section>
  );
}
