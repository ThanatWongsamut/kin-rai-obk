import type { Category, PriceRange } from "@/data/restaurants";

export type Lang = "th" | "en";

const strings = {
  title: { th: "กินไรดี?", en: "What to eat?" },
  subtitle: {
    th: "หมุนวงล้อหาร้านอร่อยที่ One Bangkok",
    en: "Spin the wheel to find your next meal at One Bangkok",
  },
  categoryLabel: { th: "ประเภทอาหาร", en: "Category" },
  all: { th: "ทั้งหมด", en: "All" },
  priceLabel: { th: "ราคา", en: "Price" },
  allPrices: { th: "ทุกราคา", en: "All Prices" },
  wheelCount: { th: "ร้านบนวงล้อ", en: "restaurants on the wheel" },
  resultHeading: { th: "วันนี้ไปกิน...", en: "You should eat at..." },
  spinAgain: { th: "หมุนอีกครั้ง", en: "Spin Again" },
  spinning: { th: "กำลังหมุน...", en: "Spinning..." },
  spin: { th: "หมุนเลย!", en: "SPIN!" },
  noRestaurants: { th: "ไม่มีร้านอาหาร", en: "No restaurants" },
} as const;

export type TKey = keyof typeof strings;

export function t(key: TKey, lang: Lang): string {
  return strings[key][lang];
}

export const CATEGORY_LABELS: Record<Category, Record<Lang, string>> = {
  Japanese: { th: "ญี่ปุ่น", en: "Japanese" },
  Korean: { th: "เกาหลี", en: "Korean" },
  Thai: { th: "ไทย", en: "Thai" },
  Western: { th: "ตะวันตก", en: "Western" },
  Chinese: { th: "จีน", en: "Chinese" },
  "Coffee & Cafe": { th: "กาแฟ & คาเฟ่", en: "Coffee & Cafe" },
  "Desserts & Bakery": { th: "ของหวาน & เบเกอรี่", en: "Desserts & Bakery" },
};

export const PRICE_DESC: Record<PriceRange, Record<Lang, string>> = {
  1: { th: "ต่ำกว่า 300฿", en: "Under 300฿" },
  2: { th: "300–800฿", en: "300–800฿" },
  3: { th: "800–1,500฿", en: "800–1,500฿" },
  4: { th: "1,500฿+", en: "1,500฿+" },
};
