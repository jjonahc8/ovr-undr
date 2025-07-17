import { BsSearch } from "react-icons/bs";
import LeftSidebar from "./components/LeftSidebar";
import MainComponent from "./components/MainComponent";

const Home = () => {
  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="max-w-[65vw] w-full h-full flex relative">
        <LeftSidebar />
        <MainComponent />
        <section className="w-[30%] sticky top-0 flex flex-col items-stretch h-screen px-6">
          <div>
            <div className="relative w-full h-full">
              <label
                htmlFor="searchBox"
                className="absolute top-0 left-0 h-full flex items-center justify-center"
              >
                <BsSearch className="w-5 h-5 text-gray-500" />
              </label>
              <input
                id="searchBox"
                type="text"
                placeholder="Search Twitter"
                className="outline-none bg-transparent border-none w-full h-full rounded-xl py-4 px-8"
              />
            </div>
          </div>
          <div></div>
          <div></div>
        </section>
      </div>
    </div>
  );
};

export default Home;
