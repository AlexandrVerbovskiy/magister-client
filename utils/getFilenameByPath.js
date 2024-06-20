const getFilenameByPath = (path) => {
  return path.split(/[\\/]/).pop();
};

export default getFilenameByPath;
