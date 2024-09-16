export const getFullListingSearchLink = ({
  searchCity,
  searchCategory,
  searchListing,
}) => {
  let searchLink = "/listings/";
  let hasPrev = false;

  if (searchCity) {
    searchLink += `?search-city=${encodeURIComponent(searchCity)}`;
    hasPrev = true;
  }

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}search-category=${encodeURIComponent(
      searchCategory
    )}`;
    hasPrev = true;
  }

  if (searchListing) {
    searchLink += `${hasPrev ? "&" : "?"}search-listing=${encodeURIComponent(
      searchListing
    )}`;
    hasPrev = true;
  }

  return searchLink;
};

export const getListingSearchLink = (searchCategory) => {
  let searchLink = "/listings/";

  if (searchCategory) {
    searchLink += `?search-category=${searchCategory}`;
  }

  return searchLink;
};
