import { Button } from "@/components/ui/button";
import React from "react";
import { twMerge } from "tailwind-merge";

function StageSelector({
  stage,
  switchStage,
}: {
  stage: string;
  switchStage: (stage: string) => void;
}) {
  return (
    <div className="flex flex-row justify-center gap-8 ">
      {[
        { name: "config", text: "Cấu hình" },
        { name: "spec", text: "Chi tiết" },
        { name: "seo", text: "SEO" },
      ].map(({ name, text }) => {
        return (
          <span
            key={name}
            onClick={() => switchStage(name)}
            className={twMerge(
              "px-4 hover:cursor-pointer",
              stage === name
                ? "text-primary border-b-primary border-b-[1px]"
                : "text-secondary border-b-secondary border-b-[1px] hover:text-primary hover:border-b-primary"
            )}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}

export default StageSelector;
