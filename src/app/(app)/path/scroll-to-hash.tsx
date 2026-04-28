"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!/^#day-\d+$/.test(hash)) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const details = target.querySelector("details");
    if (details && !details.open) details.open = true;
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);
  return null;
}
