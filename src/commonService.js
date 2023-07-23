import jsSHA from 'jssha';
import { TrainTypes, FareClass } from './assets/constants';

export default {

  getAuthorizationHeader() {
    let AppID = '3b124a10ae70407a94afe8f1a07dcd10';
    let AppKey = 'haEfCNQB6REiBCWwago238-MFAI';

    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username="' + AppID + '", algorithm="hmac-sha1", headers="x-date", signature="' + HMAC + '"';

    return {
      'Authorization': Authorization,
      'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/
    }; // 如果要將 js 運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
  },

  getYesterdayYYYYMMDD() {
    const today = new Date()
    const yesterday = new Date(today)
    return yesterday.setDate(yesterday.getDate() - 1);
  },

  getNowYYYYMMDD() {
    let date = new Date();
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10); // 'YYYY-mm-DD'.
  },

  getTomorrowYYYYMMDD() {
    const today = new Date()
    const tomorrow = new Date(today)
    return tomorrow.setDate(tomorrow.getDate() + 1);
  },

  getTwoMonthsLaterYYYYMMDD() {
    const today = new Date();
    let twoMonthsLater = new Date(today.setMonth(today.getMonth() + 2));
    twoMonthsLater.setDate(twoMonthsLater.getDate() - 2);
    return twoMonthsLater;
  },

  getNowTime() {
    return new Date().toLocaleTimeString('en-GB'); // '00:00:00'
  },

  transformTrainTypeCodeToName(trainTypeCode) {
    const trainTypeMap = {};

    for (const trainType in TrainTypes) {
      trainTypeMap[TrainTypes[trainType].value] = TrainTypes[trainType].name
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
    return this.getTwoMonthsLaterYYYYMMDD().toISOString().substring(0, 10); // 'YYYY-mm-DD'
  },

  // delayInfo
  getDateTimeDiff(aDate, bDate) {
    const diff = Math.abs(aDate - bDate);
    const minutes = Math.floor((diff/1000)/60);
    return minutes;
  },

  getFareClassName(fareClass) {
    return FareClass[fareClass];
  }
}