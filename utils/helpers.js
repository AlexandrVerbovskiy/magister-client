export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1).toLowerCase();
  return firstLetter + restOfString;
};

export const cardFormat = (str) => {
  const value = str.replace(/\D/g, "");
  let formattedValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i % 4 == 0 && i > 0) {
      formattedValue += " ";
    }
    formattedValue += value[i];
  }
  return formattedValue;
};

export const checkIsFileHasExtension = (file, extensions) => {
  let result = null;
  console.log(file.type);

  extensions.forEach((extension) => {
    if (
      file &&
      file.type &&
      file.name &&
      file.type.toLowerCase() == extension.toLowerCase()
    ) {
      result = extension;
    }
  });

  return result;
};
