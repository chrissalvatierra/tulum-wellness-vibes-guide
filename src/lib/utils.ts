
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(dateString: string) {
  try {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
