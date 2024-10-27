import { removeDuplicates } from "./helpers";
import { dateSort } from "./sort";
import { format, isToday, isYesterday } from "date-fns";
import STATIC from "../static";

export const dateToInputString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentUserUtc = () => {
  const date = new Date();
  const offsetMinutes = date.getTimezoneOffset();
  return -1 * (offsetMinutes / 60);
};

export const dateConverter = (date) => {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString("en-US");
  const formattedDateParts = formattedDate.split("/");

  const fullFormattedDate =
    `${formattedDateParts[0].length < 2 ? "0" : ""}${formattedDateParts[0]}/` +
    `${formattedDateParts[1].length < 2 ? "0" : ""}${formattedDateParts[1]}/` +
    `${formattedDateParts[2]}`;

  return `${fullFormattedDate}`;
};

export const fullDateConverter = (date) => {
  const dateObject = new Date(date);
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
  return Math.ceil(difference / (1000 * 3600 * 24));
};

export const getFactOrderDays = (startDate, endDate) => {
  return getDaysDifference(startDate, endDate) + 1;
};

export const groupDates = (dates) => {
  if (dates.length < 1) {
    return [];
  }

  const groupedDates = [];

  const sortedDates = dateSort(dates);

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
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const generateDatesBetween = (start, end) => {
  const datesObj = {};
  const startDate = new Date(start);
  const endDate = new Date(end);

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const formattedDate = separateDate(currentDate);
    datesObj[formattedDate] = true;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Object.keys(datesObj);
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

export const findFirstAvailableDate = (
  blockedDates,
  numOfDays,
  startDate = null
) => {
  if (!startDate || startDate < new Date()) {
    startDate = new Date();
  }

  let firstAvailableDate = null;
  let daysToCheck = 0;

  while (!firstAvailableDate) {
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + daysToCheck);

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

export const increaseDateByOneDay = (dateString) => {
  const date = new Date(dateString);
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

export const dateToSeconds = (days) => days * 24 * 60 * 60 * 1000;

export const getMaxFlatpickrDate = () => {
  const currentDate = new Date();

  return new Date(
    currentDate.getFullYear() + 2,
    currentDate.getMonth(),
    currentDate.getDate()
  );
};

export const dateName = (date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return "Today";
  } else if (isYesterday(dateObj)) {
    return "Yesterday";
  } else {
    return format(dateObj, "dd/MM/yyyy");
  }
};

export const formatTimeWithAmPm = (date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "hh:mm a");
};

export const getMinDate = (dates) => {
  if (!dates.length) {
    return null;
  }

  const dateObjects = dates.map((date) => new Date(date));
  const date = new Date(Math.min(...dateObjects));
  return separateDate(date);
};

export const getMaxDate = (dates) => {
  if (!dates.length) {
    return null;
  }

  const dateObjects = dates.map((date) => new Date(date));
  const date = new Date(Math.max(...dateObjects));
  return separateDate(date);
};

export const checkStartEndHasConflict = (startDate, endDate, conflictDates) => {
  const selectedDates = generateDatesBetween(startDate, endDate);

  const hasBlockedDate = selectedDates.find((selectedDate) =>
    conflictDates.includes(selectedDate)
  );

  return !!hasBlockedDate;
};

export const getOrderBlockedDatesToUpdate = (order) => {
  if (!order) {
    return [];
  }

  let blockedDatesToUpdate = [];

  order.conflictOrders.map((conflictOrder) => {
    const startDate = conflictOrder.requestId
      ? conflictOrder.newStartDate
      : conflictOrder.offerStartDate;

    const endDate = conflictOrder.requestId
      ? conflictOrder.newEndDate
      : conflictOrder.offerEndDate;

    blockedDatesToUpdate = [
      ...blockedDatesToUpdate,
      ...generateDatesBetween(startDate, endDate),
    ];
  });

  return removeDuplicates(blockedDatesToUpdate);
};

export const getStartExtendOrderDate = (offerEndDate, extendOrders) => {
  let lastOrderDate = offerEndDate;

  if (extendOrders && extendOrders.length) {
    const extendOrderDates = extendOrders
      .filter(
        (order) =>
          [
            STATIC.ORDER_STATUSES.PENDING_TENANT_PAYMENT,
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_TENANT,
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
            STATIC.ORDER_STATUSES.FINISHED,
          ].includes(order.status) && !order.cancelStatus
      )
      .map((extendOrder) => extendOrder.offerEndDate);

    lastOrderDate = getMaxDate(extendOrderDates);
  }

  return increaseDateByOneDay(lastOrderDate);
};
