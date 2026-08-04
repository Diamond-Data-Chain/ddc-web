import ReportClient from "./ReportClient";

type ReportPageProps = {
  searchParams?: {
    key?: string | string[];
  };
};

export default function BusinessValueReportPage({
  searchParams,
}: ReportPageProps) {
  const rawKey = searchParams?.key;

  const storageKey =
    typeof rawKey === "string"
      ? rawKey
      : Array.isArray(rawKey)
      ? rawKey[0] ?? ""
      : "";

  return <ReportClient storageKey={storageKey} />;
}
