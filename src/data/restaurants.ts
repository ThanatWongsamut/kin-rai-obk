export type Category =
  | "Japanese"
  | "Korean"
  | "Thai"
  | "Western"
  | "Chinese"
  | "Coffee & Cafe"
  | "Desserts & Bakery";

export const CATEGORIES: Category[] = [
  "Japanese",
  "Korean",
  "Thai",
  "Western",
  "Chinese",
  "Coffee & Cafe",
  "Desserts & Bakery",
];

// 1 = $ (under 300฿), 2 = $$ (300-800฿), 3 = $$$ (800-1,500฿), 4 = $$$$ (1,500฿+)
export type PriceRange = 1 | 2 | 3 | 4;

export const PRICE_LABELS: Record<PriceRange, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};


export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  category: Category;
  building: string;
  floor: string;
  priceRange: PriceRange;
  image: string | null;
}

const OBK = "https://www.onebangkok.com";
const P = `${OBK}/content/dam/onebangkok_v2/images/retail-directory/brand-gallery-840-x1005/parade-840x1005px`;

export const restaurants: Restaurant[] = [
  // ─── Japanese ────────────────────────────────────────
  { id: 1, name: "Sushiro", cuisine: "Kaiten Sushi", category: "Japanese", building: "Parade", floor: "3F", priceRange: 1, image: `${P}/Sushiro.jpg` },
  { id: 2, name: "Maguro", cuisine: "Premium Japanese", category: "Japanese", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Maguro%20840_1005.png` },
  { id: 3, name: "Mo-Mo-Paradise", cuisine: "Shabu-Shabu & Sukiyaki", category: "Japanese", building: "Parade", floor: "5F", priceRange: 2, image: `${P}/Mo-Mo-Paradise%20(1005x840px).jpg` },
  { id: 4, name: "Shabushi Ichiten", cuisine: "Shabu Shabu Buffet", category: "Japanese", building: "Parade", floor: "5F", priceRange: 2, image: `${P}/Shabushi.jpg` },
  { id: 5, name: "Hachicken Ramen", cuisine: "Japanese Ramen", category: "Japanese", building: "Parade", floor: "B1", priceRange: 1, image: `${P}/Hachicken_One%20Bangkok-03.jpg` },
  { id: 6, name: "Oishi Biztoro", cuisine: "Modern Japanese", category: "Japanese", building: "Parade", floor: "B1", priceRange: 2, image: null },
  { id: 7, name: "Tempura Yamaya", cuisine: "Tempura", category: "Japanese", building: "Parade", floor: "B1", priceRange: 2, image: null },
  { id: 8, name: "Maji Curry", cuisine: "Japanese Curry", category: "Japanese", building: "Parade", floor: "B1", priceRange: 1, image: null },
  { id: 9, name: "Izakaya Hotei", cuisine: "Izakaya", category: "Japanese", building: "Parade", floor: "3F", priceRange: 2, image: null },
  { id: 10, name: "Unagi Yondaime Kikukawa", cuisine: "Eel Rice Bowl", category: "Japanese", building: "The Storeys", floor: "1F", priceRange: 3, image: null },
  { id: 11, name: "Kaneko Hannosuke", cuisine: "Tempura", category: "Japanese", building: "The Storeys", floor: "1F", priceRange: 2, image: null },
  { id: 12, name: "Tonkatsu TOKU", cuisine: "Premium Tonkatsu", category: "Japanese", building: "The Storeys", floor: "1F", priceRange: 2, image: null },
  { id: 13, name: "Hou Yuu", cuisine: "Traditional Japanese", category: "Japanese", building: "The Storeys", floor: "3F", priceRange: 3, image: null },
  { id: 14, name: "SAKAE", cuisine: "Sukiyaki", category: "Japanese", building: "The Storeys", floor: "3F", priceRange: 3, image: null },
  { id: 15, name: "Tonkatsu Aoki", cuisine: "Tonkatsu", category: "Japanese", building: "The Storeys", floor: "3F", priceRange: 3, image: null },
  { id: 16, name: "Fillets", cuisine: "Omakase", category: "Japanese", building: "The Storeys", floor: "3F", priceRange: 4, image: null },

  // ─── Korean ──────────────────────────────────────────
  { id: 17, name: "Nice Two Meat U", cuisine: "Korean BBQ", category: "Korean", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/nice%20two%20meat%20u.jpg` },
  { id: 18, name: "Saemaeul Sikdang", cuisine: "Korean BBQ", category: "Korean", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Saemaeul.jpg` },
  { id: 19, name: "BHC Chicken", cuisine: "Korean Fried Chicken", category: "Korean", building: "Parade", floor: "3F", priceRange: 1, image: `${P}/BHC.jpg` },
  { id: 20, name: "The Bibimbab", cuisine: "Korean", category: "Korean", building: "Parade", floor: "B1", priceRange: 1, image: `${P}/The%20Bibimbab.jpg` },
  { id: 21, name: "Woo Gogi", cuisine: "Korean BBQ", category: "Korean", building: "Parade", floor: "B1", priceRange: 2, image: null },
  { id: 22, name: "HASUL", cuisine: "Home-style Korean", category: "Korean", building: "The Storeys", floor: "B1", priceRange: 3, image: null },

  // ─── Thai ────────────────────────────────────────────
  { id: 23, name: "Oh Ka Jhu", cuisine: "Organic Thai", category: "Thai", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Ohkajhu_2-%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A-%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99-840x1005.jpeg` },
  { id: 24, name: "Baan Ying", cuisine: "Thai Family-Style", category: "Thai", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Baan%20Ying.png` },
  { id: 25, name: "Ginger Farm Kitchen", cuisine: "Lanna Thai", category: "Thai", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Ginger%20farm.jpeg` },
  { id: 26, name: "Easy! Buddy", cuisine: "Thai Comfort Food", category: "Thai", building: "Parade", floor: "3F", priceRange: 1, image: `${P}/EASY!%20buddy_Brand%20Photo.jpg` },
  { id: 27, name: "Boon Tong Kee", cuisine: "Chicken Rice", category: "Thai", building: "Parade", floor: "B1", priceRange: 1, image: `${P}/Boon%20tong%20kee840x1005.png` },
  { id: 28, name: "Ejaejeawhon & Shabu", cuisine: "Isaan Hotpot", category: "Thai", building: "Parade", floor: "5F", priceRange: 2, image: `${P}/EJAEJEAWHON.jpg` },
  { id: 29, name: "Cafe Chilli", cuisine: "Modern Northeastern Thai", category: "Thai", building: "Parade", floor: "3F", priceRange: 2, image: null },
  { id: 30, name: "Kaeng Sod", cuisine: "Fresh Thai Curry", category: "Thai", building: "Parade", floor: "3F", priceRange: 1, image: null },
  { id: 31, name: "Look Kai Thong", cuisine: "Thai-Chinese", category: "Thai", building: "Parade", floor: "3F", priceRange: 2, image: null },
  { id: 32, name: "Lert Laow", cuisine: "Thai Hot Pot", category: "Thai", building: "Parade", floor: "B1", priceRange: 2, image: null },
  { id: 33, name: "Krua Apsorn", cuisine: "Family-Style Thai", category: "Thai", building: "Parade", floor: "5F", priceRange: 2, image: null },
  { id: 34, name: "Zaab Eli", cuisine: "Isaan Thai", category: "Thai", building: "The Storeys", floor: "B1", priceRange: 2, image: null },
  { id: 35, name: "Zaabniran", cuisine: "Khao Tom & Thai", category: "Thai", building: "The Storeys", floor: "B1", priceRange: 3, image: null },
  { id: 36, name: "Samosor", cuisine: "Traditional Thai", category: "Thai", building: "The Storeys", floor: "G", priceRange: 3, image: null },
  { id: 37, name: "Baan Suriyasai", cuisine: "Royal Thai Cuisine", category: "Thai", building: "The Storeys", floor: "1F", priceRange: 4, image: null },

  // ─── Western ─────────────────────────────────────────
  { id: 38, name: "Bianca", cuisine: "Italian", category: "Western", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Bianca.png` },
  { id: 39, name: "Fam Time Steak & Pasta", cuisine: "Italian Steak & Pasta", category: "Western", building: "Parade", floor: "3F", priceRange: 2, image: `${P}/Truffle%20Pizza.jpg` },
  { id: 40, name: "Pura Brasa", cuisine: "Spanish Grill", category: "Western", building: "Parade", floor: "3F", priceRange: 3, image: `${P}/Purabrasa.png` },
  { id: 41, name: "Shake Shack", cuisine: "American Burgers", category: "Western", building: "Parade", floor: "2F", priceRange: 1, image: `${P}/ShakeShack.jpg` },
  { id: 42, name: "Vantage Point", cuisine: "European Buffet", category: "Western", building: "Parade", floor: "2F", priceRange: 3, image: null },
  { id: 43, name: "Smith & Co.", cuisine: "Italian", category: "Western", building: "The Storeys", floor: "G", priceRange: 3, image: null },
  { id: 44, name: "Bardo Brasserie", cuisine: "Contemporary French", category: "Western", building: "The Storeys", floor: "G", priceRange: 4, image: null },
  { id: 45, name: "Hyde & Seek", cuisine: "Italian with Live Music", category: "Western", building: "The Storeys", floor: "3F", priceRange: 3, image: null },
  { id: 46, name: "Wolfgang's Steakhouse", cuisine: "NYC-Style Steakhouse", category: "Western", building: "The Storeys", floor: "3F", priceRange: 4, image: null },
  { id: 47, name: "Vessel", cuisine: "Wine Bar & Dining", category: "Western", building: "The Storeys", floor: "3F", priceRange: 3, image: null },

  // ─── Chinese ─────────────────────────────────────────
  { id: 48, name: "Ant Cave", cuisine: "Chinese-Korean Fusion BBQ", category: "Chinese", building: "Parade", floor: "5F", priceRange: 2, image: `${P}/antcave.jpg` },
  { id: 49, name: "Xiao Fuwang", cuisine: "Chinese Hot Pot", category: "Chinese", building: "Parade", floor: "5F", priceRange: 2, image: null },
  { id: 50, name: "Man Fu Yuan", cuisine: "Cantonese Dim Sum", category: "Chinese", building: "The Storeys", floor: "3F", priceRange: 4, image: null },

  // ─── Coffee & Cafe ──────────────────────────────────
  { id: 51, name: "Starbucks", cuisine: "Coffee", category: "Coffee & Cafe", building: "Parade", floor: "3F", priceRange: 1, image: null },
  { id: 52, name: "Doitung Coffee House", cuisine: "Thai Coffee", category: "Coffee & Cafe", building: "Parade", floor: "3F", priceRange: 1, image: `${P}/The-Coffee-House-by-DoiTung.jpg` },
  { id: 53, name: "Pang Cha", cuisine: "Thai Tea", category: "Coffee & Cafe", building: "Parade", floor: "3F", priceRange: 1, image: `${P}/Pangcha.jpg` },
  { id: 54, name: "Cafe Amazon", cuisine: "Coffee", category: "Coffee & Cafe", building: "Parade", floor: "5F", priceRange: 1, image: `${P}/Amazon_pic.jpg` },
  { id: 55, name: "Rawmat Coffee", cuisine: "Artisanal Coffee", category: "Coffee & Cafe", building: "Parade", floor: "B1", priceRange: 1, image: `${P}/RAWMAT%20COFFEE.jpg` },
  { id: 56, name: "One To Two Coffee", cuisine: "Coffee", category: "Coffee & Cafe", building: "Parade", floor: "B1", priceRange: 1, image: null },
  { id: 57, name: "Naisnow", cuisine: "Tea & Beverages", category: "Coffee & Cafe", building: "Parade", floor: "1F", priceRange: 1, image: null },

  // ─── Desserts & Bakery ──────────────────────────────
  { id: 58, name: "Maru Waffle", cuisine: "Bubble Waffles", category: "Desserts & Bakery", building: "Parade", floor: "5F", priceRange: 1, image: `${P}/MaruWaffle.jpg` },
  { id: 59, name: "Yoguruto", cuisine: "Yogurt Smoothies", category: "Desserts & Bakery", building: "Parade", floor: "5F", priceRange: 1, image: `${P}/Yoguruto.jpg` },
  { id: 60, name: "Tempered.co", cuisine: "Chocolate & Desserts", category: "Desserts & Bakery", building: "Parade", floor: "2F", priceRange: 1, image: null },
  { id: 61, name: "Homebake by MX", cuisine: "Bakery", category: "Desserts & Bakery", building: "Parade", floor: "B1", priceRange: 1, image: `${P}/Homebake%20by%20mx.png` },
  { id: 62, name: "Mitsukoshi Depachika", cuisine: "Japanese Food Hall", category: "Desserts & Bakery", building: "Parade", floor: "B1", priceRange: 2, image: `${P}/Mitsukoshi_840x1005px.jpg` },
];
