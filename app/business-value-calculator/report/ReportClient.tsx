"use client";

import { useEffect, useState } from "react";

import ExecutiveAssessmentReport, {
  type ExecutiveAssessmentReportData,
} from "@/components/business-value/ExecutiveAssessmentReport";

type StoredReport = {
  savedAt?: number;
  data?: ExecutiveAssessmentReportData;
};

type Props = {
  storageKey: string;
};

export default function ReportClient({
  storageKey,
}: Props) {
  const [reportData, setReportData] =
    useState<ExecutiveAssessmentReportData | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!storageKey) {
      setError(
        "The report reference is missing. Return to the assessment and generate the report again."
      );
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);

      if (!raw) {
        setError(
          "The report data could not be found. Return to the assessment and generate the report again."
        );
        return;
      }

      const stored = JSON.parse(raw) as StoredReport;

      if (!stored.data) {
        throw new Error("Report data is missing");
      }

      setReportData(stored.data);

      const companyPart =
        stored.data.companyName
          .trim()
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 50) || "Organization";

      document.title =
        `${stored.data.assessmentId}-${companyPart}-Executive-Assessment`;
    } catch (caughtError) {
      console.error(
        "Unable to load executive report:",
        caughtError
      );

      setError(
        "The report data is invalid. Return to the assessment and generate the report again."
      );
    }
  }, [storageKey]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-950">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">
            Executive report unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-700">
            {error}
          </p>

          <a
            href="/business-value-calculator"
            className="mt-7 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Return to assessment
          </a>
        </div>
      </main>
    );
  }

  if (!reportData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
        Preparing executive report…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-200 pb-16 text-slate-950 print:bg-white print:pb-0">
      <div className="sticky top-0 z-50 border-b border-slate-300 bg-white/95 px-5 py-4 shadow-sm backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">
              {reportData.companyName ||
                "Assessed organization"}
            </p>

            <p className="text-sm text-slate-700">
              {reportData.assessmentId}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/business-value-calculator"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800"
            >
              Back to assessment
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <div className="py-10 print:py-0">
        <ExecutiveAssessmentReport
          data={reportData}
        />
      </div>

      <style jsx global>{`
        @media screen {
          .executive-assessment-report {
            display: block !important;
          }

          .report-page {
            margin: 0 auto 24px !important;
            box-shadow: 0 12px 35px
              rgba(15, 23, 42, 0.16) !important;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .executive-assessment-report {
            display: block !important;
          }

          .report-page {
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}
