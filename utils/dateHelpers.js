export const dateToInputString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const timeConverter = (time) => {
  const dateObject = new Date(time);

  const formattedDate = dateObject.toLocaleDateString("en-US");
  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour12: false,
  });

  const formattedDateParts = formattedDate.split("/");

  const fullFormattedDate =
    `${formattedDateParts[0].length < 2 ? "0" : ""}${formattedDateParts[0]}/` +
    `${formattedDateParts[1].length < 2 ? "0" : ""}${formattedDateParts[1]}/` +
    `${formattedDateParts[2]}`;

  return `${fullFormattedDate} ${formattedTime}`;
};

export const timeNormalConverter = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

export const timeName = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "afternoon";
  } else if (currentHour >= 18 && currentHour < 24) {
    return "evening";
  } else {
    return "night";
  }
};

export const dateToInput = (daysAfterCurrent = 0) => {
  const today = new Date();
  const daysLater = new Date(today);
  daysLater.setDate(today.getDate() + daysAfterCurrent);

  return dateToInputString(daysLater);
};

export const getDateByCurrentAdd = (daysToAdd = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getDateByCurrentReject = (daysToReject = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysToReject);
  date.setHours(0, 0, 0, 0);
  return date;
};
