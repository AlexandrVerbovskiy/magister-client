import { useRef } from "react";
import { generatePagination } from "../utils";

const Pagination = ({
  move,
  canNext,
  canPrev,
  page,
  countPages,
  viewOnlyMoreOnePage = false,
}) => {
  const paginationRef = useRef(null);

  const visiblePages = generatePagination(page, countPages);

  const handleMove = async (newPage) => {
    await move(newPage);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleNextClick = (e) => {
    e.preventDefault();

    if (canNext) {
      handleMove(+page + 1);
    }
  };

  const handlePrevClick = (e) => {
    e.preventDefault();

    if (canPrev) {
      handleMove(+page - 1);
    }
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();

    if (+pageNumber != +page) {
      handleMove(pageNumber);
    }
  };

  if (viewOnlyMoreOnePage && countPages < 2) {
    return <></>;
  }

  return (
    <div ref={paginationRef} className="pagination-area text-center">
      <a
        href={
          canPrev
            ? `/dashboard/listings?page=${+page - 1}`
            : "/dashboard/listings"
        }
        className={`prev page-numbers ${canPrev ? "" : "disabled"}`}
        onClick={handlePrevClick}
      >
        <i className="bx bx-chevrons-left"></i>
      </a>

      {visiblePages.map((visiblePage, index) => {
        if (+visiblePage == +page)
          return (
            <a
              key={visiblePage}
              href={`/dashboard/listings?page=${visiblePage}`}
              className="page-numbers current"
              onClick={(e) => e.preventDefault()}
            >
              {visiblePage}
            </a>
          );

        if (!visiblePage)
          return (
            <a
              key={visiblePage}
              href="/dashboard/listings"
              className="page-numbers"
              onClick={(e) => e.preventDefault()}
            >
              ...
            </a>
          );

        return (
          <a
            key={visiblePage}
            href={`/dashboard/listings?page=${visiblePage}`}
            className="page-numbers"
            onClick={(e) => handlePageClick(e, visiblePage)}
          >
            {visiblePage}
          </a>
        );
      })}

      <a
        href={
          canNext
            ? `/dashboard/listings?page=${+page + 1}`
            : "/dashboard/listings"
        }
        className={`next page-numbers ${canNext ? "" : "disabled"}`}
        onClick={handleNextClick}
      >
        <i className="bx bx-chevrons-right"></i>
      </a>
    </div>
  );
};

export default Pagination;
