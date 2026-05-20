"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { t } from "@/i18n";
import { useLang } from "@/hooks/useLang";

interface Person {
  id: string;
  name: string;
}

interface Dish {
  id: string;
  name: string;
  price: string;
  eaterIds: string[];
  noDiscount?: boolean;
}

const STORAGE_KEY = "obk-split-state";

type DiscountType = "percent" | "amount";

interface SplitState {
  people: Person[];
  dishes: Dish[];
  vat: boolean;
  service: boolean;
  discountType: DiscountType;
  discountValue: string;
}

const initialState: SplitState = {
  people: [],
  dishes: [],
  vat: true,
  service: true,
  discountType: "percent",
  discountValue: "",
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 8 distinct colors for person chips/avatars
const PERSON_COLORS = [
  "bg-rose-500", "bg-sky-500", "bg-emerald-500", "bg-violet-500",
  "bg-orange-500", "bg-teal-500", "bg-pink-500", "bg-indigo-500",
];

export default function SplitPage() {
  const [lang, setLang] = useLang();
  const [state, setState] = useState<SplitState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const { people, dishes, vat, service, discountType, discountValue } = state;

  const addPerson = () =>
    setState((s) => ({ ...s, people: [...s.people, { id: uid(), name: "" }] }));

  const updatePerson = (id: string, name: string) =>
    setState((s) => ({
      ...s,
      people: s.people.map((p) => (p.id === id ? { ...p, name } : p)),
    }));

  const removePerson = (id: string) =>
    setState((s) => ({
      ...s,
      people: s.people.filter((p) => p.id !== id),
      dishes: s.dishes.map((d) => ({
        ...d,
        eaterIds: d.eaterIds.filter((e) => e !== id),
      })),
    }));

  const addDish = () =>
    setState((s) => ({
      ...s,
      dishes: [...s.dishes, { id: uid(), name: "", price: "", eaterIds: [] }],
    }));

  const updateDish = (id: string, patch: Partial<Dish>) =>
    setState((s) => ({
      ...s,
      dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));

  const removeDish = (id: string) =>
    setState((s) => ({ ...s, dishes: s.dishes.filter((d) => d.id !== id) }));

  const toggleEater = (dishId: string, personId: string) =>
    setState((s) => ({
      ...s,
      dishes: s.dishes.map((d) => {
        if (d.id !== dishId) return d;
        const has = d.eaterIds.includes(personId);
        return {
          ...d,
          eaterIds: has ? d.eaterIds.filter((e) => e !== personId) : [...d.eaterIds, personId],
        };
      }),
    }));

  const resetAll = () => {
    if (confirm(t("confirmReset", lang))) {
      setState(initialState);
    }
  };

  // ── Calculations ──────────────────────────────────

  const calc = useMemo(() => {
    const personSubtotal: Record<string, number> = {};
    const personDiscountable: Record<string, number> = {};
    people.forEach((p) => {
      personSubtotal[p.id] = 0;
      personDiscountable[p.id] = 0;
    });

    let subtotal = 0;
    let discountableSubtotal = 0;
    let unassignedAll = 0;
    let unassignedDiscountable = 0;

    for (const d of dishes) {
      const price = parseFloat(d.price) || 0;
      subtotal += price;
      const isDiscountable = !d.noDiscount;
      if (isDiscountable) discountableSubtotal += price;

      if (d.eaterIds.length === 0) {
        unassignedAll += price;
        if (isDiscountable) unassignedDiscountable += price;
      } else {
        const share = price / d.eaterIds.length;
        for (const eaterId of d.eaterIds) {
          if (personSubtotal[eaterId] !== undefined) {
            personSubtotal[eaterId] += share;
            if (isDiscountable) personDiscountable[eaterId] += share;
          }
        }
      }
    }

    if (people.length > 0) {
      if (unassignedAll > 0) {
        const each = unassignedAll / people.length;
        for (const p of people) personSubtotal[p.id] += each;
      }
      if (unassignedDiscountable > 0) {
        const each = unassignedDiscountable / people.length;
        for (const p of people) personDiscountable[p.id] += each;
      }
    }

    const dvNum = parseFloat(discountValue) || 0;
    let discount = 0;
    if (dvNum > 0 && discountableSubtotal > 0) {
      discount =
        discountType === "percent"
          ? discountableSubtotal * Math.min(dvNum, 100) / 100
          : Math.min(dvNum, discountableSubtotal);
    }

    const discountedSubtotal = subtotal - discount;
    const serviceAmount = service ? discountedSubtotal * 0.1 : 0;
    const vatBase = discountedSubtotal + serviceAmount;
    const vatAmount = vat ? vatBase * 0.07 : 0;
    const total = discountedSubtotal + serviceAmount + vatAmount;

    const taxMultiplier = (service ? 1.1 : 1) * (vat ? 1.07 : 1);
    const personTotal: Record<string, number> = {};
    for (const p of people) {
      const personDiscount =
        discountableSubtotal > 0
          ? (personDiscountable[p.id] / discountableSubtotal) * discount
          : 0;
      const personDiscounted = personSubtotal[p.id] - personDiscount;
      personTotal[p.id] = personDiscounted * taxMultiplier;
    }

    return {
      subtotal,
      discount,
      discountedSubtotal,
      serviceAmount,
      vatAmount,
      total,
      personSubtotal,
      personTotal,
    };
  }, [people, dishes, vat, service, discountType, discountValue]);

  const hasData = people.length > 0 || dishes.length > 0;
  const hasDiscount = parseFloat(discountValue) > 0;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#0c0c1d] via-[#12122a] to-[#1a1a2e] text-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-[#0c0c1d]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 px-3 h-9 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span className="hidden sm:inline">{t("backToWheel", lang)}</span>
        </Link>

        <h1 className="text-base sm:text-lg font-bold flex items-center gap-1.5 truncate">
          <span>💰</span>
          <span className="text-amber-400">{t("splitTitle", lang)}</span>
        </h1>

        <button
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="px-3 h-9 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
        >
          {lang === "th" ? "EN" : "TH"}
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-40">
        {/* People */}
        <section>
          <SectionHeader
            title={t("people", lang)}
            count={people.length}
            actionLabel={t("addPerson", lang)}
            onAction={addPerson}
          />

          {people.length === 0 ? (
            <EmptyState text={t("emptyPeople", lang)} onAction={addPerson} actionLabel={t("addPerson", lang)} />
          ) : (
            <div className="space-y-2">
              {people.map((p, i) => (
                <div key={p.id} className="flex gap-2 items-center">
                  <div
                    className={`w-9 h-9 rounded-full ${PERSON_COLORS[i % PERSON_COLORS.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                  >
                    {p.name.trim().charAt(0).toUpperCase() || i + 1}
                  </div>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePerson(p.id, e.target.value)}
                    placeholder={`${t("personName", lang)} ${i + 1}`}
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 h-11 text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    onClick={() => removePerson(p.id)}
                    className="w-11 h-11 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                    aria-label="Remove person"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dishes */}
        <section>
          <SectionHeader
            title={t("dishes", lang)}
            count={dishes.length}
            actionLabel={t("addDish", lang)}
            onAction={addDish}
          />

          {dishes.length === 0 ? (
            <EmptyState text={t("emptyDishes", lang)} onAction={addDish} actionLabel={t("addDish", lang)} />
          ) : (
            <div className="space-y-3">
              {dishes.map((d, i) => (
                <div key={d.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-3">
                  {/* Top row: number + name + delete */}
                  <div className="flex gap-2 items-center">
                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-400 font-medium shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={d.name}
                      onChange={(e) => updateDish(d.id, { name: e.target.value })}
                      placeholder={t("dishNamePlaceholder", lang)}
                      className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 h-11 text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      onClick={() => removeDish(d.id)}
                      className="w-11 h-11 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                      aria-label="Remove dish"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Price row */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm w-7 text-center">฿</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={d.price}
                      onChange={(e) => updateDish(d.id, { price: e.target.value })}
                      placeholder={t("pricePlaceholder", lang)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 h-11 text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 text-right tabular-nums"
                    />
                  </div>

                  {/* Eaters */}
                  {people.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">{t("whoAte", lang)}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {people.map((p, idx) => {
                          const checked = d.eaterIds.includes(p.id);
                          const display = p.name.trim() || `${idx + 1}`;
                          const initial = p.name.trim().charAt(0).toUpperCase() || `${idx + 1}`;
                          return (
                            <button
                              key={p.id}
                              onClick={() => toggleEater(d.id, p.id)}
                              className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full text-sm font-medium transition-all cursor-pointer max-w-full ${
                                checked
                                  ? "bg-amber-500 text-black"
                                  : "bg-white/10 text-gray-300 hover:bg-white/20 active:bg-white/30"
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  checked ? "bg-black/20 text-black" : `${PERSON_COLORS[idx % PERSON_COLORS.length]} text-white`
                                }`}
                              >
                                {initial}
                              </span>
                              <span className="truncate max-w-[8rem]">{display}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Exclude from discount */}
                  {hasDiscount && (
                    <label className="flex items-center gap-2 cursor-pointer select-none group pt-1">
                      <input
                        type="checkbox"
                        checked={!!d.noDiscount}
                        onChange={(e) => updateDish(d.id, { noDiscount: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                        {t("excludeFromDiscount", lang)}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Charges */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
            {t("charges", lang)}
          </h2>
          <div className="space-y-2">
            {/* Discount */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("discount", lang)}</span>
                <div className="flex bg-black/30 rounded-lg p-0.5">
                  <button
                    onClick={() => setState((s) => ({ ...s, discountType: "percent" }))}
                    className={`w-9 h-7 text-sm font-bold rounded-md cursor-pointer transition-colors ${
                      discountType === "percent" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setState((s) => ({ ...s, discountType: "amount" }))}
                    className={`w-9 h-7 text-sm font-bold rounded-md cursor-pointer transition-colors ${
                      discountType === "amount" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    ฿
                  </button>
                </div>
              </div>
              <input
                type="number"
                inputMode="decimal"
                value={discountValue}
                onChange={(e) => setState((s) => ({ ...s, discountValue: e.target.value }))}
                placeholder={discountType === "percent" ? "0" : t("discountAmount", lang)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-3 h-10 text-base text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <Toggle
              label={t("serviceCharge", lang)}
              checked={service}
              onChange={(v) => setState((s) => ({ ...s, service: v }))}
            />
            <Toggle
              label={t("vat", lang)}
              checked={vat}
              onChange={(v) => setState((s) => ({ ...s, vat: v }))}
            />
          </div>
        </section>

        {/* Per-person summary cards */}
        {people.length > 0 && calc.subtotal > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2">
              {t("perPerson", lang)}
            </h2>
            <div className="space-y-2">
              {people.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-3"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${PERSON_COLORS[i % PERSON_COLORS.length]} flex items-center justify-center text-base font-bold text-white shrink-0`}
                  >
                    {p.name.trim().charAt(0).toUpperCase() || i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-white font-medium truncate">
                      {p.name.trim() || `${t("personName", lang)} ${i + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 tabular-nums">
                      ฿{fmt(calc.personSubtotal[p.id] || 0)} +{" "}
                      {service && "10%"} {service && vat && "+"} {vat && "7%"}
                      {!service && !vat && "—"}
                    </p>
                  </div>
                  <span className="text-amber-400 font-bold text-lg tabular-nums shrink-0">
                    ฿{fmt(calc.personTotal[p.id] || 0)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reset */}
        {hasData && (
          <button
            onClick={resetAll}
            className="w-full py-3 text-sm text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            {t("resetAll", lang)}
          </button>
        )}
      </div>

      {/* Sticky bottom summary bar */}
      {calc.subtotal > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a2e]/95 backdrop-blur-md border-t border-amber-500/30 shadow-2xl shadow-black/50">
          <div className="max-w-2xl mx-auto">
            {/* Collapsible breakdown */}
            {showSummaryDetails && (
              <div className="px-4 pt-3 pb-2 border-b border-white/5 space-y-1 text-sm tabular-nums">
                <SummaryLine label={t("subtotal", lang)} value={calc.subtotal} />
                {calc.discount > 0 && (
                  <SummaryLine
                    label={`− ${t("discount", lang)}`}
                    value={-calc.discount}
                    color="text-emerald-400"
                  />
                )}
                {service && (
                  <SummaryLine label={t("serviceCharge", lang)} value={calc.serviceAmount} />
                )}
                {vat && <SummaryLine label={t("vat", lang)} value={calc.vatAmount} />}
              </div>
            )}

            <button
              onClick={() => setShowSummaryDetails((v) => !v)}
              className="w-full px-4 py-3 flex items-center justify-between cursor-pointer active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  {t("total", lang)}
                </span>
                <span
                  className={`text-xs text-gray-500 transition-transform ${
                    showSummaryDetails ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </div>
              <span className="text-2xl font-bold text-amber-400 tabular-nums">
                ฿{fmt(calc.total)}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────

function SectionHeader({
  title,
  count,
  actionLabel,
  onAction,
}: {
  title: string;
  count: number;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold">
        {title} <span className="text-gray-600">({count})</span>
      </h2>
      <button
        onClick={onAction}
        className="px-3 h-8 rounded-full text-sm font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 active:bg-amber-500/40 transition-colors cursor-pointer"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function EmptyState({
  text,
  onAction,
  actionLabel,
}: {
  text: string;
  onAction: () => void;
  actionLabel: string;
}) {
  return (
    <button
      onClick={onAction}
      className="w-full py-8 border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-2xl text-gray-500 hover:text-amber-400 transition-colors cursor-pointer"
    >
      <p className="text-sm mb-1">{text}</p>
      <p className="text-amber-400 text-sm font-bold">{actionLabel}</p>
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-3 cursor-pointer active:bg-white/10 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-amber-500 cursor-pointer"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

function SummaryLine({
  label,
  value,
  color = "text-gray-400",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className={`flex justify-between ${color}`}>
      <span>{label}</span>
      <span>
        {value < 0 ? "−" : ""}฿{fmt(Math.abs(value))}
      </span>
    </div>
  );
}
