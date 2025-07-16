import { BiHomeCircle, BiUser } from "react-icons/bi";
import { HiOutlineHashtag } from "react-icons/hi";
import {
  BsBell,
  BsBookmark,
  BsEnvelope,
  BsThreeDots,
  BsTwitterX,
} from "react-icons/bs";
import Link from "next/link";

const NAVIGATION_ITEMS = [
  { title: "Logo", icon: BsTwitterX },
  { title: "Home", icon: BiHomeCircle },
  { title: "Explore", icon: HiOutlineHashtag },
  { title: "Notifications", icon: BsBell },
  { title: "Messages", icon: BsEnvelope },
  { title: "Bookmarks", icon: BsBookmark },
  { title: "Profile", icon: BiUser },
];

const Home = () => {
  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-screen-xl w-full h-full flex relative">
        {/* Left Sidebar for navigation/header */}
        <section className="fixed w-[275px] flex flex-col items-stretch h-screen">
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
            <button className="rounded-full m-4 bg-primary p-4 text-2xl text-center hover:bg-primary/70 transition duration-200">
              Tweet
            </button>
          </div>
          <div>
            <button
              className="rounded-full flex items-center space-x-2 m-4 bg-transparent p-4 text-center 
            hover:bg-white/10 transition duration-200 w-full justify-between"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-slate-400 w-10 h-10"></div>
                <div className="text-left text-sm">
                  <div className="font-semibold">PickPlots</div>
                  <div className="">@PickPlots</div>
                </div>
              </div>
              <div>
                <BsThreeDots />
              </div>
            </button>
          </div>
        </section>
        {/* <main>Home TL</main>
        <section>right sidebar</section> */}
      </div>
    </div>
  );
};

export default Home;
