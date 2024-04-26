import { generatePagination } from "../utils";

const Pagination = ({
  move,
  canNext,
  canPrev,
  page,
  countPages,
  viewOnlyMoreOnePage = false,
}) => {
  const visiblePages = generatePagination(page, countPages);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (canNext) move(page + 1);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    if (canPrev) move(page - 1);
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    if (pageNumber != page) move(pageNumber);
  };

  if (viewOnlyMoreOnePage && countPages < 2) {
    return <></>;
  }

  return (
    <div className="pagination-area text-center">
      <a
        href={
          canPrev ? `/settings/listings?page=${page - 1}` : "/settings/listings"
        }
        className={`prev page-numbers ${canPrev ? "" : "disabled"}`}
        onClick={handlePrevClick}
      >
        <i className="bx bx-chevrons-left"></i>
      </a>

      {visiblePages.map((visiblePage, index) => {
        if (visiblePage == page)
          return (
            <a
              key={visiblePage}
              href={`/settings/listings?page=${visiblePage}`}
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
              href="/settings/listings"
              className="page-numbers"
              onClick={(e) => e.preventDefault()}
            >
              ...
            </a>
          );

        return (
          <a
            key={visiblePage}
            href={`/settings/listings?page=${visiblePage}`}
            className="page-numbers"
            onClick={(e) => handlePageClick(e, visiblePage)}
          >
            {visiblePage}
          </a>
        );
      })}

      <a
        href={
          canNext ? `/settings/listings?page=${page + 1}` : "/settings/listings"
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
