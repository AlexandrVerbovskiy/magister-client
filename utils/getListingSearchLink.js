export const getFullListingSearchLink = ({
  searchCity,
  searchCategory,
  searchListing,
}) => {
  let searchLink = "/listing-list";
  let hasPrev = false;

  if (searchCity) {
    searchLink += `?search-city=${searchCity}`;
    hasPrev = true;
  }

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}search-category=${searchCategory}`;
  }

  if (searchListing) {
    searchLink += `${hasPrev ? "&" : "?"}search-listing=${searchListing}`;
    hasPrev = true;
  }

  return searchLink;
};

export const getListingSearchLink = (searchCategory) => {
  let searchLink = "/listing-list";
  let hasPrev = false;

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}search-category=${searchCategory}`;
  }

  return searchLink;
};
