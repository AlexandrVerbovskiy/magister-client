import { getFilePath } from "./helpers";

const getListingImageByType = (link, type) => {
  if (type == "storage") {
    return getFilePath(link);
  }

  return link;
};

export default getListingImageByType;
