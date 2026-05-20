"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/i18n";

const KEY = "obk-lang";

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "th" || stored === "en") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return [lang, setLangState];
}
