const isClickedOnVisualImagePart = (e, supportImage) => {
  const element = e.target;

  const rect = element.getBoundingClientRect();
  const elementLeft = rect.left;
  const elementTop = rect.top;

  const clickX = e.clientX;
  const clickY = e.clientY;

  const relativeClickX = clickX - elementLeft;
  const relativeClickY = clickY - elementTop;

  const img = supportImage;
  const aspectRatio = img.width / img.height;

  const containerWidth = element.clientWidth;
  const containerHeight = element.clientHeight;

  let visibleWidth, visibleHeight;

  if (containerWidth / containerHeight > aspectRatio) {
    visibleWidth = containerHeight * aspectRatio;
    visibleHeight = containerHeight;
  } else {
    visibleWidth = containerWidth;
    visibleHeight = containerWidth / aspectRatio;
  }

  const diffHeight = (containerHeight - visibleHeight) / 2;
  const diffWidth = (containerWidth - visibleWidth) / 2;

  return !(
    relativeClickX < diffWidth ||
    relativeClickX > diffWidth + visibleWidth ||
    relativeClickY < diffHeight ||
    relativeClickY > diffHeight + visibleHeight
  );
};

export default isClickedOnVisualImagePart;
