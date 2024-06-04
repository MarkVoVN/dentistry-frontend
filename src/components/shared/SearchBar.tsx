"use client";

import { useGlobalStore } from "@/lib/store/global/provider";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function SearchBar() {
  // const searchInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();
  const value = useGlobalStore((s) => s.searchInputValue);
  const setValue = useGlobalStore((s) => s.setSearchInputValue);

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      redirectToSearchPage();
    }
  };

  const redirectToSearchPage = () => {
    if (!value || value.trim().length === 0) return;
    let queryParams: { [key: string]: string } = {
      search: value,
    };

    let stringifiedParams: { [key: string]: string } = {};
    Object.keys(queryParams).map((key) => {
      stringifiedParams[key] = JSON.stringify(queryParams[key]);
    });
    const query = new URLSearchParams(stringifiedParams);
    router.push(`/search?${query}`);
  };

  return (
    <div className="flex flex-row border-[2px] border-neutral-1 bg-shade-1-100% rounded-full w-1/2 py-4 px-4 gap-2">
      <Search className="w-6 h-6 text-neutral-7"></Search>
      <input
        type="text"
        value={value}
        placeholder="Search for a clinic | dentist | service"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onEnter}
        className={cn(
          "w-full text-neutral-7 focus:outline-none font-light bg-none"
          // !value && "italic"
        )}
      />
    </div>
  );
}

export default SearchBar;
