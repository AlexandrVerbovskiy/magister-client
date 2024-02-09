import Cookies from 'js-cookie';

export const removeCookie = (name) => {
  Cookies.remove(name); // Replace 'yourCookieName' with the name of your cookie
};

export const getCookieString = (cookies) => {
  return Object.keys(cookies)
    .map((key) => `${key}=${cookies[key]}`)
    .join("; ");
};
