import moment from "moment";

export const formatDate = (date) => {
  if (date?.includes("T") && date?.includes("Z")) {
    return moment.utc(date).format("YYYY-MM-DD HH:mm:ss");
  } else {
    return date;
  }
};