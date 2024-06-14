export * from "./validators";
export * from "./axios";
export { default as generatePagination } from "./generatePagination";
export { default as getFilenameByPath } from "./getFilenameByPath";
export { default as byteConverter } from "./byteConverter";
export { default as uniqueId } from "./uniqueId";
export { default as getListingImageByType } from "./getListingImageByType";
export { default as middlewareCallbackWrapper } from "./middlewareCallbackWrapper";
export { default as getNumberLevelByName } from "./getNumberLevelByName";
export { default as leveliseCategories } from "./leveliseCategories";
export { default as onCurrentUserLocation } from "./onCurrentUserLocation";
export { default as uniqueImageId } from "./uniqueImageId";
export { default as convertToSelectPopupCategories } from "./convertToSelectPopupCategories";
export { default as isClickedOnVisualImagePart } from "./isClickedOnVisualImagePart";
export { default as cloneObject } from "./cloneObject";
export { default as reorderList } from "./reorderList";
export { default as autoMultiEnding } from "./autoMultiEnding";
export { default as downloadFileUrl } from "./downloadFileUrl";
export { default as HttpError } from "./HttpError";
export * from "./listPageParams";
export * from "./getListingSearchLink";
export * from "./cookieHelpers";
export * from "./dateHelpers";
export * from "./elementEvent";
export * from "./priceCalculations";
export * from "./baseServerSideProps";
export * from "./sort";



export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1).toLowerCase();
  return firstLetter + restOfString;
};
