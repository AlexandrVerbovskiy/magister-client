export function validatePassword(password) {
  return password.length >= 8;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDate(date) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

export function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
}

export function validatePrice(price) {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(price);
}
