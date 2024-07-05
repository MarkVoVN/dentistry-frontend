import slugify from "@sindresorhus/slugify";
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

// export const convertSlugUrl = (str: string) => {
//   if (!str) return "";
//   str = slugify(str, {
//     lower: true,
//     locale: "vi",
//   });
//   return str;
// };

export function removeHtml(str: string) {
  if (str.endsWith(".html")) {
    return str.slice(0, -5);
  }
  return str;
}

export function splitString(str: string) {
  try {
    return str.split(", ");
  } catch (err) {
    return [str];
  }
}

export function formatDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } _ ${day}-${month}-${year}`;
}

export function formatTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}

export function convertHHmmToISO(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toISOString();
}

export function convertISOtoHHmm(isoString: string) {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}
