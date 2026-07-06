"use client";

import { useMemo, useState } from "react";
import { isSameDay, startOfToday } from "date-fns";
import { useScheduleDayConfig } from "@/hooks/useScheduleDayConfig";
import {
  SCHEDULE_BOOKING_DAYS,
  formatBookingDate,
  formatDayDateLabel,
  generateHourlySlots,
  getDateForScheduleIndex,
  getDayConfigForDate,
  getDefaultScheduleIndex,
  isSlotPast,
} from "@/lib/schedule-utils";

export function useScheduleDayState() {
  const [index, setIndex] = useState(getDefaultScheduleIndex);
  const weeklyConfig = useScheduleDayConfig();
  const bookingDateObj = getDateForScheduleIndex(index);
  const day = getDayConfigForDate(weeklyConfig, bookingDateObj);
  const slots = useMemo(
    () => (day.isOpen ? generateHourlySlots(day.startHour, day.endHour) : []),
    [day.isOpen, day.startHour, day.endHour],
  );
  const bookingDate = formatBookingDate(bookingDateObj);
  const dayDateLabel = formatDayDateLabel(bookingDateObj);
  const isSelectedToday = isSameDay(bookingDateObj, startOfToday());

  function goToPreviousDay() {
    setIndex((current) => Math.max(0, current - 1));
  }

  function goToNextDay() {
    setIndex((current) => Math.min(SCHEDULE_BOOKING_DAYS - 1, current + 1));
  }

  return {
    index,
    day,
    slots,
    bookingDate,
    bookingDateObj,
    dayDateLabel,
    isSelectedToday,
    canGoPrevious: index > 0,
    canGoNext: index < SCHEDULE_BOOKING_DAYS - 1,
    goToPreviousDay,
    goToNextDay,
  };
}
