export const shakeUnverifiedAlert = () => {
  const warningElem = document.querySelector(
    ".message-site-alert.alert-warning"
  );

  if (!warningElem) {
    return;
  }

  warningElem.classList.add("shaked");
  setTimeout(() => warningElem.classList.remove("shaked"), 500);
};
