import jsSHA from 'jssha';
import { TrainTypes } from './assets/constants';

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

}