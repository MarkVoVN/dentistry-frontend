import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircleIcon,
  ComputerIcon,
  Hospital,
  Laptop,
  CalendarDays,
  Layers,
  LayoutDashboard,
  LayoutDashboardIcon,
  MenuSquare,
  Search,
  Settings,
  Sparkles,
  Stethoscope,
  StickyNote,
  TagIcon,
  UserIcon,
  Pill,
  Contact,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const sidebarStructure: {
  title: string;
  items: {
    name: string;
    link: string;
    icon: React.ReactElement;
  }[];
}[] = [
  {
    title: "MANAGEMNT",
    items: [
      {
        name: "Customer",
        link: "/admin/customer",
        icon: <UserIcon />,
      },
      {
        name: "Clinic",
        link: "/admin/clinic",
        icon: <Hospital />,
      },
      {
        name: "Clinic Owner",
        link: "/admin/clinicOwner",
        icon: <Laptop />,
      },
      {
        name: "Clinic Schedule",
        link: "/admin/schedule",
        icon: <CalendarDays />,
      },
      {
        name: "Services",
        link: "/admin/service",
        icon: <Stethoscope />,
      },
      {
        name: "Treatment Plan",
        link: "/admin/treatmentPlan",
        icon: <Pill />,
      },
      {
        name: "Appointment",
        link: "/admin/appointment",
        icon: <CalendarDays />,
      },
      {
        name: "Dentists",
        link: "/admin/dentist",
        icon: <Contact />,
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-[9999] flex h-screen w-72.5 flex-col overflow-y-hidden text-[#8a99af] bg-[#1C2434]  duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 pl-10 pb-2 pt-4 lg:py-6.5">
        <Link href="/dashboard">
          <Image width={176} height={32} src={"/dentistry.svg"} alt="Logo" />
        </Link>
        <Button
          variant="outline"
          size="icon"
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="flex justify-between items-center lg:hidden cursor-pointer z-10 bg-none"
        >
          <ArrowLeftCircleIcon className="flex-1" />
        </Button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {sidebarStructure.map((sidebarItem) => (
            <div key={sidebarItem.title}>
              <h3 className="mb-4 ml-4 text-sm font-semibold">
                {sidebarItem.title}
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5 min-w-[250px]">
                {sidebarItem.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.link}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-shade-1-85% duration-300 ease-in-out hover:bg-graydark ${
                        pathname.includes(item.link.toLowerCase()) &&
                        "bg-[#333A48]"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
