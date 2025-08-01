import { BiHomeCircle, BiUser } from "react-icons/bi";
import { HiOutlineHashtag } from "react-icons/hi";
import { BsBell, BsEnvelope, BsThreeDots, BsTwitterX } from "react-icons/bs";
import Link from "next/link";
import { LogoutButton } from "./client-components/logout-button";

const NAVIGATION_ITEMS = [
  { title: "Logo", icon: BsTwitterX },
  { title: "Home", icon: BiHomeCircle },
  { title: "Explore", icon: HiOutlineHashtag },
  { title: "Notifications", icon: BsBell },
  { title: "Messages", icon: BsEnvelope },
  { title: "Profile", icon: BiUser },
];

export async function LeftSidebar({
  avatar_link,
  username,
}: {
  avatar_link: string | null;
  username: string | null;
}) {
  return (
    <section className="w-[25%] sticky top-0 flex flex-col items-stretch h-screen">
      <div className="flex flex-col items-stretch h-full space-y-4 mt-4">
        {NAVIGATION_ITEMS.map((item) => (
          <Link
            className="hover:bg-white/10 text-2xl transition duration-200 flex items-center justify-start w-fit space-x-4 
        rounded-3xl py-2 px-6"
            href={`/${item.title.toLowerCase()}`}
            key={item.title}
          >
            <div>
              <item.icon />
            </div>
            {item.title !== "Logo" && <div>{item.title}</div>}
          </Link>
        ))}
        <button
          className="rounded-full m-4 text-black bg-white p-4 text-2xl text-center hover:bg-white/70 transition duration-200
        font-semibold"
        >
          Plot
        </button>
      </div>
      <div>
        <div
          className="rounded-full flex items-center space-x-2 bg-transparent p-4 text-center 
      hover:bg-white/10 transition duration-200 w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="rounded-full w-10 h-10">
              {!avatar_link && (
                <div className="w-10 h-10 bg-slate-400 rounded-full" />
              )}
              {avatar_link && (
                <img
                  className="rounded-full min-w-10 w-10 min-h-10 h-10"
                  src={avatar_link}
                />
              )}
            </div>
            <div className="text-left text-sm">{username}</div>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton />
            <BsThreeDots />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeftSidebar;
