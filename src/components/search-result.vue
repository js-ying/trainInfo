<template>
  <div id="search-result">
    <loading
      :active.sync="isLoading"
      :is-full-page="true">
    </loading>

    <train-time-table
      :dailyTrainTimetable="dailyTrainTimetable" :date="date"
      v-if="dailyTrainTimetable && !isLoading"
    ></train-time-table>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import TraStations from '../assets/traStations.js';
import TrainTimeTable from './train-time-table.vue';

export default {
  name: 'SearchResult',
  components: {
    Loading,
    TrainTimeTable,
  },
  data() {
    return {
      isLoading: false,
      dailyTrainTimetable: null,
      startStationId: null,
      endStationId: null,
      date: null,
      time: null,
    };
  },
  mounted() {
    this.startStationId = this.$route.query.s;
    this.endStationId = this.$route.query.e;
    this.date = this.$route.query.d;
    this.time = this.$route.query.t;

    this.search();
  },
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
    if (to.query) {
      this.startStationId = to.query.s;
      this.endStationId = to.query.e;
      this.date = to.query.d;
      this.time = to.query.t;
      this.search();
      next();
    } else {
      next({ name: 'Home', });
    }
  },
  methods: {
    search() {
      this.isLoading = true;
      this.dailyTrainTimetable = null;

      this.$ajax({
        method: 'get',
        url: `https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/DailyTrainTimetable/OD/Inclusive/${this.getTrainStationIdByName(this.startStationId)}/to/${this.getTrainStationIdByName(this.endStationId)}/${this.date}?$format=JSON`,
        headers: this.$commonService.getAuthorizationHeader(),
      }).then((res) => {
        this.dailyTrainTimetable = JSON.parse(JSON.stringify(res.data));

        // 依駛離日期由小到大排序
        this.dailyTrainTimetable.TrainTimetables.sort((a, b) => {
          return a.StopTimes[0].DepartureTime.localeCompare(b.StopTimes[0].DepartureTime);
        });

        // 只顯示大於查詢條件【出發日期 HH:mm】的結果
        this.dailyTrainTimetable.TrainTimetables = this.dailyTrainTimetable.TrainTimetables.filter((trainTimeTable) => {
          return trainTimeTable.StopTimes[0].DepartureTime > this.time;
        });

        // 處理誤點資訊
        this.processDelayInfo(this.dailyTrainTimetable.TrainTimetables, () => {
          this.isLoading = false;
        });
      });
    },
    getTrainStationIdByName(name) {
      return TraStations.filter(traStation => traStation.StationName.Zh_tw === name)[0].StationID;
    },
    processDelayInfo(trainTimetable, complete) {
      // 若查詢日期與當下日期相同
      if (this.date === this.$commonService.processDate(new Date())) {
        // 從 trainTimeTable 中篩選出與當下時間相差一小時內的列車物件
        const inOneHourTrainList = trainTimetable.filter(trainTime => {
          const diff = Math.abs(new Date(`${this.date} ${trainTime.StopTimes[0].DepartureTime}`) - new Date());
          const minutes = Math.floor((diff/1000)/60);
          return minutes <= 60;
        });

        // 若篩選出來有資料
        if (inOneHourTrainList.length > 0) {
          let count = inOneHourTrainList.length;
          // 將相差一小時內的所有列車都發查指定[車次]的列車即時位置動態資料 API
          inOneHourTrainList.forEach(train => {
            this.$ajax({
              method: 'get',
              url: `https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/TrainLiveBoard/TrainNo/${train.TrainInfo.TrainNo}?$format=JSON`,
              headers: this.$commonService.getAuthorizationHeader(),
            }).then((res) => {
              // 在 trainTimeTable 裡建立 delayInfo 欄位存放發查回來的資料
              train.delayInfo = JSON.parse(JSON.stringify(res.data.TrainLiveBoards));
            
              // 計數器 for 所有資料回傳回來才能 callback
              count = count - 1;
              if (count === 0) {
                complete();
              }
            });
          });

          // 直接 callback
        } else {
          complete();
        }
      } else {
        complete();
      }
    },
  },
}
</script>