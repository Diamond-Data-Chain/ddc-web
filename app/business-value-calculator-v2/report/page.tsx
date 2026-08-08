"use client";

import { Suspense } from "react";
import ReportClient from "./ReportClient";

export default function OperationalValueReportPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
          Preparing executive report…
        </main>
      }
    >
      <ReportClient />
    </Suspense>
  );
}
