import ENV from "../env";

const getListingImageByType = (link, type) => {
  if (type == "storage") {
    return ENV.SERVER_URL + ENV.SERVER_STORAGE + "/" + link;
  }

  return link;
};

export default getListingImageByType;
