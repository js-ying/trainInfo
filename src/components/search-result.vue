<template>
  <div id="search-result">
    <loading :active.sync="isLoading" :is-full-page="true">
    </loading>

    <train-time-table :dailyTrainTimetable="dailyTrainTimetable" :date="date"
      v-if="dailyTrainTimetable && !isLoading"></train-time-table>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import TraStations from "../assets/traStations.js";
import TrainTimeTable from "./train-time-table.vue";

export default {
  name: "SearchResult",
  components: {
    Loading,
    TrainTimeTable,
  },
  data() {
    return {
      isLoading: false,
      dailyTrainTimetable: null,
      startStationName: null,
      endStationName: null,
      date: null,
      time: null,
    };
  },
  mounted() {
    this.startStationName = this.$route.query.s;
    this.endStationName = this.$route.query.e;
    this.date = this.$route.query.d;
    this.time = this.$route.query.t;
    this.checkDateNotInPast(this.date, () => {
      this.search();
    });
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
    if (to.query) {
      this.startStationName = to.query.s;
      this.endStationName = to.query.e;
      this.date = to.query.d;
      this.time = to.query.t;
      this.checkDateNotInPast(this.date, () => {
        this.search();
      });
      next();
    } else {
      next({ name: "Home" });
    }
  },
  methods: {
    search() {
      this.isLoading = true;
      this.dailyTrainTimetable = null;

      this.$ajax({
        method: "post",
        url: `/api/getTrainTimeTable`,
        data: {
          startStationId: `${this.getTrainStationIdByName(
            this.startStationName
          )}`,
          endStationId: this.getTrainStationIdByName(this.endStationName),
          date: this.date,
          time: this.time,
        },
      })
        .then((res) => {
          this.dailyTrainTimetable = JSON.parse(JSON.stringify(res.data))
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          if (error.response?.data?.code) {
            alert(`${error.response.data.message}`);
          } else {
            alert(`${error.response.status ? error.response.status + " " : ""}後台暫無回應，請稍後再試，或請聯繫系統管理員。`);
          }
        });
    },
    getTrainStationIdByName(name) {
      return TraStations.filter(
        (traStation) => traStation.StationName.Zh_tw === name
      )[0].StationID;
    },
    checkDateNotInPast(date, complete) {
      const selectedDate = new Date(date);

      // 如果選擇的日期是過去
      if (
        new Date(selectedDate.toDateString()) <
        new Date(new Date().toDateString())
      ) {
        alert(`無提供歷史資料，請將查詢日期調整為今日(含)以後的兩個月內。`);
      } else {
        complete();
      }
    },
  },
};
</script>
