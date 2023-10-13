import { TrainTypes, FareClass } from "./assets/constants";

export default {
  getYesterday() {
    const today = new Date();
    const yesterday = new Date(today);
    return yesterday.setDate(yesterday.getDate() - 1);
  },

  getTwoMonthsLater() {
    const today = new Date();
    let twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));
    twoMonthsLater.setDate(twoMonthsLater.getDate() - 2);
    return twoMonthsLater;
  },

  getTrainNameByTrainTypeCode(trainTypeCode) {
    const trainTypeMap = {};

    for (const trainType in TrainTypes) {
      trainTypeMap[TrainTypes[trainType].value] = TrainTypes[trainType].name;
    }

    return trainTypeMap[trainTypeCode];
  },

  // 新 date-picker
  processDate(data) {
    const offset = data.getTimezoneOffset();
    const date = new Date(data.getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
  },

  processTime(data) {
    return data
      .toTimeString()
      .split(" ")[0]
      .slice(0, 5);
  },

  getNowDate() {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 10); // 'YYYY-mm-DD'.
  },

  getMaxDate() {
    return this.getTwoMonthsLater()
      .toISOString()
      .substring(0, 10); // 'YYYY-mm-DD'
  },

  getNameByFareClass(fareClass) {
    return FareClass[fareClass];
  },
};
