import { DataPagination } from "@/components/shared/data-pagination";

export function HousesPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <DataPagination basePath="/houses" page={page} totalPages={totalPages} searchParams={searchParams} />
  );
}
