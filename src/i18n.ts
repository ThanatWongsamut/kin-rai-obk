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
  buildingLabel: { th: "อาคาร", en: "Building" },
  allBuildings: { th: "ทุกอาคาร", en: "All Buildings" },
  removeFromWheel: { th: "เอาออกจากวงล้อ (เคยกินแล้ว)", en: "Remove from wheel (already eaten)" },
  excludedCount: { th: "ที่เอาออกจากวงล้อแล้ว", en: "removed from wheel" },
  resetExcluded: { th: "เริ่มใหม่", en: "Reset" },
  // Split bill
  splitTitle: { th: "หารค่าอาหาร", en: "Split the Bill" },
  splitSubtitle: { th: "หารค่าอาหารกับเพื่อนแบบยุติธรรม", en: "Split food costs fairly with friends" },
  backToWheel: { th: "กลับไปวงล้อ", en: "Back to Wheel" },
  goToSplit: { th: "หารบิล", en: "Split Bill" },
  people: { th: "ผู้ร่วมทาน", en: "People" },
  addPerson: { th: "+ เพิ่มคน", en: "+ Add Person" },
  personName: { th: "ชื่อ", en: "Name" },
  dishes: { th: "รายการอาหาร", en: "Dishes" },
  addDish: { th: "+ เพิ่มเมนู", en: "+ Add Dish" },
  dishNamePlaceholder: { th: "ชื่อเมนู (ไม่บังคับ)", en: "Dish name (optional)" },
  pricePlaceholder: { th: "ราคา", en: "Price" },
  whoAte: { th: "ใครกิน", en: "Who ate" },
  charges: { th: "ค่าใช้จ่ายเพิ่มเติม", en: "Charges" },
  vat: { th: "VAT 7%", en: "VAT 7%" },
  serviceCharge: { th: "ค่าบริการ 10%", en: "Service Charge 10%" },
  discount: { th: "ส่วนลด", en: "Discount" },
  discountAmount: { th: "จำนวนส่วนลด", en: "Discount amount" },
  excludeFromDiscount: { th: "ไม่ร่วมส่วนลด", en: "Exclude from discount" },
  summary: { th: "สรุปยอด", en: "Summary" },
  subtotal: { th: "ยอดรวม", en: "Subtotal" },
  total: { th: "ทั้งหมด", en: "Total" },
  perPerson: { th: "แต่ละคนจ่าย", en: "Per Person" },
  emptyDishes: { th: "ยังไม่มีรายการ กดปุ่มข้างบนเพื่อเริ่ม", en: "No dishes yet. Click the button above to start." },
  emptyPeople: { th: "เพิ่มคนก่อนเลย", en: "Add people first" },
  resetAll: { th: "ล้างทั้งหมด", en: "Reset All" },
  confirmReset: { th: "ลบข้อมูลทั้งหมด?", en: "Clear all data?" },
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
