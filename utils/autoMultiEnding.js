const autoMultiEnding = (count, field, defaultMultiEnding = null) => {
  if (count > 1) {
    return defaultMultiEnding ?? field + "s";
  }
  return field;
};

export default autoMultiEnding;
