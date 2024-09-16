export const getCookieString = (cookies) => {
  return Object.keys(cookies)
    .map((key) => `${key}=${cookies[key]}`)
    .join("; ");
};