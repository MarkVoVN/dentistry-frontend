import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ReactElement } from "react";

const ChipVariants = cva(
  "flex flex-row py-[6px] px-2 w-fit items-center rounded-full text-sm justify-between",
  {
    variants: {
      variant: {
        default: " border-[1px] border-neutral-5 text-neutral-7",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ChipVariants> {
  label?: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
}

export function Chip({
  label,
  variant,
  startIcon,
  endIcon,
  onClick,
  className,
  ...props
}: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={
        cn(ChipVariants({ variant }), className, "p-1 cursor-pointer") +
        (onClick ? "hover:cursor-pointer" : "")
      }
      {...props}
    >
      {startIcon}
      <span className="px-2 overflow-hidden whitespace-nowrap">{label}</span>
      {endIcon}
    </span>
  );
}
