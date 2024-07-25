import { getFilePath } from "./axios";

const getListingImageByType = (link, type) => {
  if (type == "storage") {
    return getFilePath(link);
  }

  return link;
};

export default getListingImageByType;
