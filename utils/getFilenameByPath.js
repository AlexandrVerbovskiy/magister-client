const getFilenameByPath = (path) => {
  const fileName = path.split(/[\\/]/).pop();
  return fileName;
};

export default getFilenameByPath;
