import moment from "moment";

// export const formatDate = (date) => {
//   if (date?.includes("T") && date?.includes("Z")) {
//     return moment.utc(date).format("YYYY-MM-DD HH:mm:ss");
//   } else {
//     return date;
//   }
// };

export const formatDate = (date) => {
  if (date?.includes("T") && date?.includes("Z")) {
    // Keep it as a moment object in UTC
    return moment.utc(date);
  } else {
    // Return as a moment object without formatting to a string
    return moment(date);
  }
};