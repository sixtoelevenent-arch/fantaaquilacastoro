"use client";

import { useEffect } from "react";

export default function MarketCronRunner() {
  useEffect(() => {
    fetch("/api/market/cron").catch(() => {});
  }, []);

  return null;
}