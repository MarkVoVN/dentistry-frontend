"use client";

import { useGlobalStore } from "@/lib/store/global/provider";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type SearchBarProps = {
  searchInputValue: string | undefined;
  setSearchInputValue: (value: string) => void;
  handleOnEnter: () => void;
};

function SearchBar({
  searchInputValue,
  setSearchInputValue,
  handleOnEnter,
}: SearchBarProps) {
  const router = useRouter();
  // const value = useGlobalStore((s) => s.searchInputValue);
  // const setValue = useGlobalStore((s) => s.setSearchInputValue);

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnEnter();
    }
  };

  return (
    <div className="flex flex-row border-[2px] border-neutral-1 bg-shade-1-100% rounded-full w-1/2 py-4 px-4 gap-2">
      <Search className="w-6 h-6 text-neutral-7"></Search>
      <input
        type="text"
        value={searchInputValue}
        placeholder="Search for a clinic | dentist | service"
        onChange={(e) => setSearchInputValue(e.target.value)}
        onKeyDown={onEnter}
        className={cn(
          "w-full text-neutral-7 focus:outline-none font-light bg-none"
        )}
      />
    </div>
  );
}

export default SearchBar;
