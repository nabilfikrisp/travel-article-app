import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/articleSlice";
import { useSearchParams } from "react-router";

export default function ArticleListPagination() {
  const dispatch = useAppDispatch();
  const { meta } = useAppSelector((state) => state.article);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPageSizeParams = searchParams.get("pageSize")
    ? Number(searchParams.get("pageSize"))
    : undefined;

  if (!meta) return null;

  const handlePageChange = (page: number) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", page.toString());
      return newParams;
    });
    dispatch(fetchArticles({ page, pageSize: initialPageSizeParams }));
  };

  const renderPreviousPages = () => {
    const { page } = meta.pagination;
    if (page <= 1) return null;

    return (
      <>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
        </PaginationItem>
        {page > 2 && (
          <>
            <PaginationItem className="hidden sm:flex">
              <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {page > 3 && <PaginationEllipsis className="hidden sm:flex" />}
          </>
        )}
        <PaginationItem>
          <PaginationLink onClick={() => handlePageChange(page - 1)}>{page - 1}</PaginationLink>
        </PaginationItem>
      </>
    );
  };

  const renderNextPages = () => {
    const { page, pageCount } = meta.pagination;
    if (page >= pageCount) return null;

    return (
      <>
        <PaginationItem>
          <PaginationLink onClick={() => handlePageChange(page + 1)}>{page + 1}</PaginationLink>
        </PaginationItem>
        {page < pageCount - 1 && (
          <>
            {page < pageCount - 2 && <PaginationEllipsis className="hidden sm:flex" />}
            <PaginationItem className="hidden sm:flex">
              <PaginationLink onClick={() => handlePageChange(pageCount)}>
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext onClick={() => handlePageChange(page + 1)} />
        </PaginationItem>
      </>
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        {renderPreviousPages()}
        <PaginationItem>
          <PaginationLink onClick={() => handlePageChange(meta.pagination.page)} isActive>
            {meta.pagination.page}
          </PaginationLink>
        </PaginationItem>
        {renderNextPages()}
      </PaginationContent>
    </Pagination>
  );
}
