"use client";

import { useEffect, useState } from "react";
import {
  FALLBACK_SCHEDULE_DAY_CONFIG,
  buildScheduleDayConfig,
  type OpeningHourRow,
  type ScheduleDayConfig,
} from "@/lib/opening-hours";

export function useScheduleDayConfig() {
  const [dayConfig, setDayConfig] = useState<ScheduleDayConfig[]>(FALLBACK_SCHEDULE_DAY_CONFIG);

  useEffect(() => {
    fetch("/api/opening-hours")
      .then((r) => r.json())
      .then((data: OpeningHourRow[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDayConfig(buildScheduleDayConfig(data));
        }
      })
      .catch(() => {});
  }, []);

  return dayConfig;
}
