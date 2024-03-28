export const getFullListingSearchLink = (searchLocation, searchCategory) => {
  let searchLink = "/listing-list";
  let hasPrev = false;

  if (searchLocation) {
    searchLink += `?search-city=${searchLocation}`;
    hasPrev = true;
  }

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}search-category=${searchCategory}`;
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
