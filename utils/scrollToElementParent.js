const scrollToElementParent = (element, type = "vertical", dopPadding = 0) => {
  const childElement = element;
  const parentElement = element.parentElement;

  const childOffsetTop = childElement.offsetTop;
  const childOffsetLeft = childElement.offsetLeft;

  if (type == "vertical") {
    const scrollPosition =
      childOffsetTop +
      childElement.offsetHeight -
      parentElement.clientHeight -
      dopPadding;

    parentElement.scroll({
      top: scrollPosition > 0 ? scrollPosition : 0,
      behavior: "smooth",
    });
  } else if (type == "horizontal") {
    const scrollPosition =
      childOffsetLeft +
      childElement.offsetWidth -
      parentElement.clientWidth -
      dopPadding;

    parentElement.scroll({
      left: scrollPosition > 0 ? scrollPosition : 0,
      behavior: "smooth",
    });
  }
};

export default scrollToElementParent;
