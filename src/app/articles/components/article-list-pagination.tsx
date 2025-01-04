import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchArticles } from "@/store/slices/articleSlice";
import { useLocation, useNavigate } from "react-router";

export default function ArticleListPagination() {
  const dispatch = useAppDispatch();
  const { meta } = useAppSelector((state) => state.article);
  const navigate = useNavigate();
  const location = useLocation();

  if (!meta) return null;

  const handlePageChange = (page: number) => {
    navigate({
      pathname: location.pathname,
      search: `?page=${page}`,
    });
    dispatch(fetchArticles({ page }));
  };

  const renderPageNumbers = () => {
    const pages = Array.from({ length: meta.pagination.pageCount }).map((_, index) => (
      <PaginationItem key={index + 1}>
        <PaginationLink
          onClick={() => handlePageChange(index + 1)}
          isActive={index + 1 === meta.pagination.page}
        >
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    ));
    return pages;
  };

  return (
    <Pagination className="m-0 w-fit">
      <PaginationContent>
        {meta.pagination.page !== 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(meta.pagination.page - 1)} />
          </PaginationItem>
        )}
        {renderPageNumbers()}
        {meta.pagination.pageCount !== meta.pagination.page && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(meta.pagination.page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
