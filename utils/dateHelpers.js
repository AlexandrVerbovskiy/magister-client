export const dateToInputString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const timeConverter = (time) => {
  const dateObject = new Date(time);

  const formattedDate = dateObject.toLocaleDateString("en-US");

  const formattedDateParts = formattedDate.split("/");

  const fullFormattedDate =
    `${formattedDateParts[0].length < 2 ? "0" : ""}${formattedDateParts[0]}/` +
    `${formattedDateParts[1].length < 2 ? "0" : ""}${formattedDateParts[1]}/` +
    `${formattedDateParts[2]}`;

  return `${fullFormattedDate}`;
};

export const fullTimeConverter = (time) => {
  const dateObject = new Date(time);
  console.log(dateObject)

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

  return `${month}/${day}/${year}`;
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

export const getDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const difference = Math.abs(end - start);
  return Math.ceil(difference / (1000 * 3600 * 24)) + 1;
};

export const groupDates = (dates) => {
  if (dates.length < 1) {
    return [];
  }

  const groupedDates = [];

  const sortedDates = dates
    .map((dateStr) => dateStr)
    .sort((a, b) => new Date(a) - new Date(b));

  let currentStartDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i - 1]);

    const diffInDays = Math.round(
      (currentDate - prevDate) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 1) {
      groupedDates.push({ from: currentStartDate, to: sortedDates[i - 1] });
      currentStartDate = sortedDates[i];
    }
  }

  groupedDates.push({
    from: currentStartDate,
    to: sortedDates[sortedDates.length - 1],
  });

  return groupedDates;
};

export const separateDate = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const checkStringDateLowerOrEqualCurrentDate = (date) => {
  const currentDate = separateDate(new Date());
  return date < currentDate;
};

const isDateBlocked = (startDate, blockedDates, numOfDays) => {
  for (let i = 0; i < numOfDays; i++) {
    let tempDate = new Date(startDate);
    tempDate.setDate(startDate.getDate() + i);

    if (blockedDates.includes(separateDate(tempDate))) {
      return true;
    }
  }
  return false;
};

export const findFirstAvailableDate = (blockedDates, numOfDays) => {
  let today = new Date();
  let firstAvailableDate = null;
  let daysToCheck = 0;

  while (!firstAvailableDate) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + daysToCheck);

    if (!numOfDays) {
      numOfDays = 1;
    }

    if (!isDateBlocked(currentDate, blockedDates, numOfDays)) {
      firstAvailableDate = currentDate;
    } else {
      daysToCheck++;
    }
  }

  return firstAvailableDate;
};
