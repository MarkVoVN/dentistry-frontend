import Link from "next/link";
// import DropdownUser from "./DropdownUser";
import { Button } from "@/components/ui/button";
import { Menu, SearchIcon } from "lucide-react";
import Image from "next/image";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-[99999] flex w-full bg-shade-1-100%  drop-shadow-sm dark:bg-[#1C2434] dark:drop-shadow-none dark:text-shade-1-100% text-[#1C2434]">
      <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <Button
            size="icon"
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="block rounded-sm dark:outline-none border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <Menu className="dark:text-shade-1-100%" />
          </Button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image width={32} height={32} src={"/dentistry.svg"} alt="Logo" />
          </Link>
        </div>

        <div className="hidden sm:block">
          {/* <div className="relative">
                <SearchIcon className="dark:text-shade-1-100% absolute left-0 top-1/2 -translate-y-1/2"/>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125 dark:bg-[#1C2434]"
              />
            </div> */}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <DarkModeSwitcher /> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
