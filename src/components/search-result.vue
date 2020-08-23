<template>
  <div id="search-result">
    <loading
      :active.sync="isLoading"
      :is-full-page="true">
    </loading>

    <train-time-table
      :dailyTrainTimetable="dailyTrainTimetable" :date="date"
      v-if="dailyTrainTimetable"
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
    console.log('mounted', this.$route.query);
    this.startStationId = this.$route.query.s;
    this.endStationId = this.$route.query.e;
    this.date = this.$route.query.d;
    this.time = this.getTime(this.$route.query.t);

    this.search();
  },
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
    if (to.query) {
      console.log('beforeRouteUpdate', to.query);
      this.startStationId = to.query.s;
      this.endStationId = to.query.e;
      this.date = to.query.d;
      this.time = this.getTime(to.query.t);
      this.search();
      next();
    } else {
      console.log('no query');
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

        this.isLoading = false;
      });
    },
    getTrainStationIdByName(name) {
      return TraStations.filter(traStation => traStation.StationName.Zh_tw === name)[0].StationID;
    },
    getTime(time) {
      return time.substr(0, 2) + ':' + time.substr(2, 4);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // if (to.name === 'TrainTimeDetail') {
  //   //   from.meta.keepAlive = true;
  //   // } else {
  //   //   from.meta.keepAlive = false;
  //   // }

  //   // console.log(to.meta.keepAlive);
    
  //   next(); 
  // }
}
</script>