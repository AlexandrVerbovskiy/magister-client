export const getFullListingSearchLink = (searchLocation, searchCategory) => {
  let searchLink = "/listing-list";
  let hasPrev = false;

  if (searchLocation) {
    searchLink += `?cities=${searchLink}`;
    hasPrev = true;
  }

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}categories=${searchCategory}`;
  }

  return searchLink;
};

export const getListingSearchLink = (searchCategory) => {
  let searchLink = "/listing-list";
  let hasPrev = false;

  if (searchCategory) {
    searchLink += `${hasPrev ? "&" : "?"}categories=${searchCategory}`;
  }

  return searchLink;
};