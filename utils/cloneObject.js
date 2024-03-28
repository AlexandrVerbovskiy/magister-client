const cloneObject = (elem) => {
  return JSON.parse(JSON.stringify(elem));
};

export default cloneObject;
