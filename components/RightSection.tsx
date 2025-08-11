"use client";
import { BsSearch } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";
import { IoIosMedal } from "react-icons/io";
import NavigateWrapper from "./client-components/navigate";

export default function RightSection() {
  return (
    <section className="w-[30%] flex-col space-y-4 items-stretch h-screen ml-6 sticky top-0 overflow-scroll">
      <div className="sticky top-0 bg-black">
        <div className="pt-2">
          <div className="relative w-full h-full group">
            <input
              id="searchBox"
              type="text"
              placeholder="Search FreePlay"
              className="outline-none peer focus:border-primary focus:border w-full h-full rounded-xl py-4 pl-14
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
            <h3 className="text-center font-bold text-3xl pt-4 pb-2 px-4">
              Best pickers
            </h3>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-row items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <FaCrown className="w-12 h-12 text-yellow-300" />
                  <div className="w-20 h-20 bg-slate-400 rounded-full" />
                  <p className="text-2xl text-center font-semibold break-words whitespace-normal max-w-[10rem]">
                    c44rson
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-around w-full">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-slate-400 rounded-full" />
                  <IoIosMedal className="w-6 h-6 text-gray-500" />
                  <p className="text-xs text-center font-semibold break-words whitespace-normal max-w-[5rem] min-w-[5rem]">
                    c44rson
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-slate-400 rounded-full" />
                  <IoIosMedal className="w-6 h-6 text-amber-950" />
                  <p className="text-xs text-center font-semibold break-words whitespace-normal max-w-[5rem] min-w-[5rem]">
                    c44rson
                  </p>
                </div>
              </div>

              <button className="w-36 h-10 rounded-full font-semibold border-gray-600 border-[0.5px] mt-2 mb-4">
                Full Rankings
              </button>
            </div>
          </div>
        </NavigateWrapper>
      </div>
      <div className="rounded-xl border-gray-600 border-[0.5px]">
        <h3 className="text-left font-bold text-xl pt-4 pb-2 px-4">
          You might know
        </h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="hover:bg-white/10 p-4 flex justify-between items-center last:rounded-b-xl transition duration-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-neutral-600 rounded-full flex-none"></div>
              <div className="flex flex-col">
                <div className="font-bold text-sm text-white">jon4h</div>
                <div className="text-gray-500 text-xs">From your community</div>
              </div>
            </div>
            <button className="rounded-full px-6 py-2 bg-white text-neutral-950">
              Follow
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
