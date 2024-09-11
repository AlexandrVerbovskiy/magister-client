import { isValidPhoneNumber } from "libphonenumber-js";

export function validateBigText(text) {
  if (text && text.length > 2000) {
    return "The string size exceeds 2000 characters";
  }

  return true;
}

export function validateSmallText(text) {
  if (text && text.trim() && text.length > 250) {
    return "Length exceeds 250 characters";
  }

  return true;
}

export function validatePassword(password) {
  if (password.length < 8) {
    return "Password should have at least 8 characters";
  }

  if (password.length > 20) {
    return "Password should have no more than 20 characters";
  }

  if (!/[a-z]/.test(password)) {
    return "Password should contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password should contain at least one uppercase letter";
  }

  if (!/\d/.test(password)) {
    return "Password should contain at least one digit";
  }

  /*if (!/[!@#$%^&*+=]/.test(password)) {
    return "Password should contain at least one special character (!@#$%^&*+=)";
  }*/

  return true;
}

export function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Email should follow the standard email format (e.g., user@example.com)";
  }

  const [localPart, domainPart] = email.split("@");

  const localPartRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/;
  if (!localPartRegex.test(localPart)) {
    return "Local part of the email is not valid";
  }

  const domainRegex = /^[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domainPart)) {
    return "Domain part of the email is not valid";
  }

  if (
    domainPart.indexOf(".") === -1 ||
    domainPart.indexOf(".") === 0 ||
    domainPart.indexOf(".") === domainPart.length - 1
  ) {
    return "Domain part should contain at least one dot and should not start or end with a dot";
  }

  const resSmallTextValidation = validateSmallText(email);
  if (resSmallTextValidation !== true) return resSmallTextValidation;

  return true;
}

export function validateDate(date) {
  const formatRegex =
    /^(0[1-9]|1[0-2])[\/.\-](0[1-9]|[12][0-9]|3[01])[\/.\-](\d{4})$/;

  if (!formatRegex.test(dateString)) {
    return "Date should be in the MM/DD/YYYY format with valid separators (/, -, or .)";
  }

  const [month, day, year] = dateString.split(/[\/.\-]/);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return "Invalid month or day in the date";
  }

  const currentYear = new Date(date).getFullYear();
  if (year < 1900 || year > currentYear + 100) {
    return "Invalid year in the date";
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return "Invalid day for the given month";
  }

  return true;
}

export function validatePhoneNumber(phoneNumber, countryCode) {
  if (
    phoneNumber &&
    isValidPhoneNumber("+" + phoneNumber, countryCode.toLocaleUpperCase())
  ) {
    return true;
  }

  return "Invalid phone number";
}

export function validatePrice(priceString) {
  const formatRegex = /^\d+(\.\d{1,2})?$/;

  if (!formatRegex.test(`${priceString}`)) {
    return "Price should be a positive number with optional decimal values";
  }

  const numericValue = parseFloat(`${priceString}`.replace(/\$/, ""));

  if (isNaN(numericValue) || numericValue <= 0) {
    return "Price should be a positive number";
  }

  const resSmallTextValidation = validateSmallText(`${priceString}`);
  if (resSmallTextValidation !== true) return resSmallTextValidation;

  if (Number(priceString) > 1000000) {
    return "Price can't be higher than $1.000.000";
  }

  return true;
}

export function validateUrl(url) {
  try {
    new URL(url);

    const resSmallTextValidation = validateSmallText(url);
    if (resSmallTextValidation !== true) return resSmallTextValidation;

    return true;
  } catch (error) {
    return "Invalid URL";
  }
}

export function validateInteger(number) {
  const integerRegex = /^\d+$/;

  if (!integerRegex.test(number)) {
    return "The value must be an integer";
  }

  return true;
}

export function validateCardNumber(number) {
  const regex = new RegExp("^[0-9]{16}$");
  if (!regex.test(number)) return "Invalid card number";

  return true;
}
