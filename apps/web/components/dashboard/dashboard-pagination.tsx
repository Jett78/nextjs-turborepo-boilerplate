import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

const DashboardPagination = ({ page, setPage, totalPages }: Props) => {
  const pagesToShow: (number | string)[] = [];

  // Always show first page
  if (page > 2) pagesToShow.push(1);

  // Show dots before current page group
  if (page > 3) pagesToShow.push("dots-left");

  // Show current - 1
  if (page > 1) pagesToShow.push(page - 1);

  // Show current
  pagesToShow.push(page);

  // Show current + 1
  if (page < totalPages) pagesToShow.push(page + 1);

  // Show dots after current page group
  if (page < totalPages - 2) pagesToShow.push("dots-right");

  // Always show last page
  if (page < totalPages - 1) pagesToShow.push(totalPages);

  return (
    <div className="mt-10">
      <Pagination className="my-8">
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>

          {/* Dynamic page buttons */}
          {pagesToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "dots-left" || p === "dots-right" ? (
                <span className="px-3">…</span>
              ) : (
                <PaginationLink
                  isActive={p === page}
                  onClick={() => typeof p === "number" && setPage(p)}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DashboardPagination;
