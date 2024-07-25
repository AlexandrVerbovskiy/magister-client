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

export const activateAuthPopup = () => {
  const triggerBtn = document.querySelector(".sign-form-trigger");

  if (triggerBtn) {
    triggerBtn.click();
  }
};
