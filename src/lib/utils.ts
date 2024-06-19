import { type ClassValue, clsx } from "clsx";
import numeral from "numeral";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceToVND(price: number) {
  try {
    let str = numeral(price).format("0,0").replace(/,/g, ".") + "đ";
    return str;
  } catch {
    return price;
  }
}
