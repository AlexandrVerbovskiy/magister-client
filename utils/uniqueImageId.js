let currentIndex = 0;

export default function () {
  const res = currentIndex;
  currentIndex++;
  return `${res}`;
}
