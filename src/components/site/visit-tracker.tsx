"use client";

import { useEffect } from "react";
import { recordVisit } from "@/app/actions/analytics";

// Once per page load (React runs effects twice in development).
let sent = false;

/** Reports one anonymous page view per load to the private admin counter. */
export function VisitTracker() {
  useEffect(() => {
    if (sent) return;
    sent = true;
    let newVisitor = false;
    try {
      const today = new Date().toISOString().slice(0, 10);
      newVisitor = localStorage.getItem("lastVisit") !== today;
      localStorage.setItem("lastVisit", today);
    } catch {}
    recordVisit(newVisitor).catch(() => {});
  }, []);
  return null;
}
