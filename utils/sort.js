const stringCompare = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

const dateCompare = (a, b) => new Date(a) - new Date(b);

export const stringSort = (array) => array.sort(stringCompare);

export const dateSort = (array) => array.sort(dateCompare);

export const objStringSort = (array, key) =>
  array.sort((a, b) => stringCompare(a[key], b[key]()));

export const objDateSort = (array, key) =>
  array.sort((a, b) => dateCompare(a[key], b[key]));
