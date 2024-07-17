import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleLogout = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken != null) {
      localStorage.removeItem("accessToken");
    }
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Log out");
    router.push("/login");
  };
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken == null) throw new Error("accessToken not found");
      const decoded = jwt.decode(accessToken) as JwtPayload;
      const name =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      setRole(role);
      setUsername(name);
    } catch (err) {
      router.push("/login");
    }
  }, []);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {username}
          </span>
          <span className="block text-xs">{role}</span>
        </span>

        <span className="h-12 w-12 rounded-full bg-[#CECFD7] p-2">
          <Image
            width={112}
            height={112}
            src={"/Dentistry-logo.svg"}
            alt="User"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-60 flex-col rounded-sm border border-stroke bg-shade-1-100% shadow-sm text-shade-2-100% ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <button
          className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={handleLogout}
        >
          <LogOut />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
