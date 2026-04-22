"use client";

import { useState, useMemo, useEffect } from "react";
import SpinWheel from "@/components/SpinWheel";
import {
  restaurants,
  CATEGORIES,
  PRICE_LABELS,
  type Restaurant,
  type Category,
  type PriceRange,
} from "@/data/restaurants";
import { t, CATEGORY_LABELS, PRICE_DESC, type Lang } from "@/i18n";

const PRICE_TIERS: PriceRange[] = [1, 2, 3, 4];
const BUILDINGS = ["Parade", "The Storeys"] as const;
type Building = (typeof BUILDINGS)[number];

export default function Home() {
  const [lang, setLang] = useState<Lang>("th");
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<PriceRange[]>([]);
  const [selectedBuildings, setSelectedBuildings] = useState<Building[]>([]);
  const [result, setResult] = useState<Restaurant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleCategory = (cat: Category) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePrice = (price: PriceRange) => {
    setSelectedPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const toggleBuilding = (b: Building) => {
    setSelectedBuildings((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  // Shared filter helper
  const matchesFilters = (r: Restaurant, opts?: { skipCat?: boolean; skipPrice?: boolean; skipBuilding?: boolean }) => {
    const catOk = opts?.skipCat || selectedCats.length === 0 || selectedCats.includes(r.category);
    const priceOk = opts?.skipPrice || selectedPrices.length === 0 || selectedPrices.includes(r.priceRange);
    const buildingOk = opts?.skipBuilding || selectedBuildings.length === 0 || selectedBuildings.includes(r.building as Building);
    return catOk && priceOk && buildingOk;
  };

  const filtered = useMemo(
    () => restaurants.filter((r) => matchesFilters(r)),
    [selectedCats, selectedPrices, selectedBuildings]
  );

  const getCatCount = (cat: Category) =>
    restaurants.filter((r) => r.category === cat && matchesFilters(r, { skipCat: true })).length;

  const getPriceCount = (price: PriceRange) =>
    restaurants.filter((r) => r.priceRange === price && matchesFilters(r, { skipPrice: true })).length;

  const getBuildingCount = (b: Building) =>
    restaurants.filter((r) => r.building === b && matchesFilters(r, { skipBuilding: true })).length;

  const handleResult = (r: Restaurant) => {
    setImgError(false);
    setResult(r);
  };

  const filterKey = `${[...selectedCats].sort().join(",")}-${[...selectedPrices].sort().join(",")}-${[...selectedBuildings].sort().join(",")}`;

  const allCatCount = restaurants.filter((r) => matchesFilters(r, { skipCat: true })).length;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#0c0c1d] via-[#12122a] to-[#1a1a2e] text-white">
      {/* Header */}
      <header className="pt-8 pb-2 text-center px-4 relative">
        {/* Language Toggle */}
        <button
          onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20"
        >
          {lang === "th" ? "EN" : "TH"}
        </button>

        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="text-amber-400">{t("title", lang)}</span>{" "}
          <span className="text-white/80">@ OBK</span>
        </h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          {t("subtitle", lang)}
        </p>
      </header>

      {/* Filters */}
      <div className="px-4 pt-3 pb-1 max-w-2xl mx-auto space-y-3">
        {/* Category Filter */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-medium">
            {t("categoryLabel", lang)}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <FilterPill
              label={`${t("all", lang)} (${allCatCount})`}
              active={selectedCats.length === 0}
              disabled={isSpinning}
              onClick={() => setSelectedCats([])}
            />
            {CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                label={`${CATEGORY_LABELS[cat][lang]} (${getCatCount(cat)})`}
                active={selectedCats.includes(cat)}
                disabled={isSpinning}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-medium">
            {t("priceLabel", lang)}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <FilterPill
              label={t("allPrices", lang)}
              active={selectedPrices.length === 0}
              disabled={isSpinning}
              onClick={() => setSelectedPrices([])}
            />
            {PRICE_TIERS.map((p) => (
              <FilterPill
                key={p}
                label={`${PRICE_LABELS[p]} (${getPriceCount(p)})`}
                active={selectedPrices.includes(p)}
                disabled={isSpinning}
                onClick={() => togglePrice(p)}
                title={PRICE_DESC[p][lang]}
              />
            ))}
          </div>
        </div>

        {/* Building Filter */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 font-medium">
            {t("buildingLabel", lang)}
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <FilterPill
              label={t("allBuildings", lang)}
              active={selectedBuildings.length === 0}
              disabled={isSpinning}
              onClick={() => setSelectedBuildings([])}
            />
            {BUILDINGS.map((b) => (
              <FilterPill
                key={b}
                label={`${b} (${getBuildingCount(b)})`}
                active={selectedBuildings.includes(b)}
                disabled={isSpinning}
                onClick={() => toggleBuilding(b)}
              />
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs">
          {filtered.length} {t("wheelCount", lang)}
        </p>
      </div>

      {/* Wheel */}
      <main className="px-4 py-3">
        <SpinWheel
          key={filterKey}
          restaurants={filtered}
          onResult={handleResult}
          onSpinningChange={setIsSpinning}
          lang={lang}
        />
      </main>

      {/* Result Modal */}
      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4"
          onClick={() => setResult(null)}
        >
          <div
            className="bg-[#1a1a2e] border border-amber-500/30 rounded-2xl max-w-sm w-full overflow-hidden animate-slideUp shadow-2xl shadow-amber-500/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            {result.image && !imgError ? (
              <img
                src={result.image}
                alt={result.name}
                className="w-full h-52 object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                <span className="text-7xl font-bold text-white/30">
                  {result.name[0]}
                </span>
              </div>
            )}

            {/* Info */}
            <div className="p-6">
              <p className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-1">
                {t("resultHeading", lang)}
              </p>
              <h2 className="text-2xl font-bold text-white mb-1">
                {result.name}
              </h2>
              <p className="text-gray-400 text-sm">{result.cuisine}</p>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-amber-400 font-bold text-lg">
                  {PRICE_LABELS[result.priceRange]}
                </span>
                <span className="text-gray-500 text-xs">
                  {PRICE_DESC[result.priceRange][lang]}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-3 text-gray-300 text-sm bg-white/5 rounded-xl p-3">
                <span className="text-lg leading-none mt-0.5">📍</span>
                <div>
                  <p className="font-medium text-white">{result.building}</p>
                  <p className="text-gray-400">{result.floor}</p>
                </div>
              </div>

              <button
                onClick={() => setResult(null)}
                className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.98] cursor-pointer"
              >
                {t("spinAgain", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  active,
  disabled,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-amber-500 text-black"
          : "bg-white/10 text-gray-300 hover:bg-white/20"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
}
