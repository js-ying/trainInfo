<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
    ></loading>
    <!-- 導覽列 -->
    <div class="mb-2">
      <h4
        id="webTitle"
        @click="toggleSelectArea('reset')"
      >台鐵時刻表</h4>
      <b-container class="mt-3 bv-example-row">
        <b-row class="justify-content-md-center">
          <b-col
            cols="6"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('startMainLine')"
          >
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowStartMainLine || isShowStartStation }"
            >
              出發車站<br>
              {{ selected.start.stationName }}
              {{ selected.start.stationId }}
            </b-button>
          </b-col>
          <b-col
            cols="6"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('endMainLine')"
          >
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowEndMainLine || isShowEndStation }"
            >
              抵達車站<br>
              {{ selected.end.stationName }}
              {{ selected.end.stationId }}
            </b-button>
          </b-col>
          <b-col
            cols="12"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('datePicker')"
          >
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowDatePicker }"
            >
              出發日期<br>
              {{ selected.date }}
              {{ selected.time.slice(0, -3) }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <!-- 參數調整區域 -->
    <b-container class="mb-2 bv-example-row">
      <b-row v-if="isShowStartMainLine">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(mainLine, $index) in mainLines"
          :key="$index"
        >
          <b-button
            variant="info"
            class="w100"
            @click="selectStartMainLine(mainLine)"
          >{{ mainLine }}</b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowStartStation">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(filterTraStartStation, $index) in filterTraStartStations"
          :key="$index"
        >
          <b-button
            variant="info"
            :value="filterTraStartStation.StationID"
            class="w100"
            @click="selectStartStation(filterTraStartStation.StationID, filterTraStartStation.StationName.Zh_tw)"
          > {{ filterTraStartStation.StationName.Zh_tw }}</b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowEndMainLine">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(mainLine, $index) in mainLines"
          :key="$index"
        >
          <b-button
            variant="primary"
            class="w100"
            @click="selectEndMainLine(mainLine)"
          >{{ mainLine }}</b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowEndStation">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(filterTraEndStation, $index) in filterTraEndStations"
          :key="$index"
        >
          <b-button
            variant="info"
            :value="filterTraEndStation.StationID"
            class="w100"
            @click="selectEndStation(filterTraEndStation.StationID, filterTraEndStation.StationName.Zh_tw)"
          > {{ filterTraEndStation.StationName.Zh_tw }}</b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowDatePicker">
        <b-col
          cols="12"
          class="mb-3"
        >
          <b-form-datepicker
            v-model="selected.date"
            class="mb-2"
          ></b-form-datepicker>
          <b-form-timepicker
            v-model="selected.time"
            locale="en"
          ></b-form-timepicker>
        </b-col>
      </b-row>
    </b-container>
    <!-- 按鈕 -->
    <div class="mb-4">
      <b-button
        variant="dark"
        @click="query()"
      >查詢</b-button>
    </div>
    <!-- 查詢結果 -->
    <b-container class="mb-3 bv-example-row">
      <b-row>
        <b-col
          cols="12"
          class="mb-3"
          v-for="(filterTrainTime, $index) in filterDailyTrainTimetable.TrainTimetables"
          :key="$index"
        >
          <div class="trainTimeCol bv-example-row-flex-cols p-2">
            <b-row align-v="center">
              <b-col cols="3">
                {{ filterTrainTime.TrainInfo.TrainNo }} {{ tripLineToName(filterTrainTime.TrainInfo.TripLine) }}<br>
                <b-badge :variant="getTrainTypeVariant(filterTrainTime.TrainInfo.TrainTypeCode)">{{ trainTypeCodeToName(filterTrainTime.TrainInfo.TrainTypeCode) }}</b-badge><br>
                {{ filterTrainTime.TrainInfo.StartingStationName.Zh_tw }} - {{ filterTrainTime.TrainInfo.EndingStationName.Zh_tw }}
              </b-col>
              <b-col cols="6">
                {{ filterTrainTime.StopTimes[0].DepartureTime }} - {{ filterTrainTime.StopTimes[filterTrainTime.StopTimes.length - 1].ArrivalTime }}<br>
                {{ caculateTimeRange(filterTrainTime.StopTimes[0].DepartureTime, filterTrainTime.StopTimes[filterTrainTime.StopTimes.length - 1].ArrivalTime) }}
              </b-col>
              <b-col cols="3">
                <img
                  src="../src/assets/train-service-icon/disability.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.WheelChairFlag"
                >
                <img
                  src="../src/assets/train-service-icon/suitcase.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.PackageServiceFlag"
                >
                <img
                  src="../src/assets/train-service-icon/lunch.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.DiningFlag"
                >
                <img
                  src="../src/assets/train-service-icon/breast-feeding.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.BreastFeedFlag"
                >
                <img
                  src="../src/assets/train-service-icon/bicycle.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.BikeFlag"
                >
                <img
                  src="../src/assets/train-service-icon/car.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.CarFlag"
                >
                <img
                  src="../src/assets/train-service-icon/train.png"
                  class="trainServiceIcon"
                  v-if="filterTrainTime.TrainInfo.ExtraTrainFlag"
                >
              </b-col>
            </b-row>
            <!-- {{ filterTrainTime }} -->
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import traStations from './assets/traStations';

export default {
  name: 'App',
  data() {
    return {
      mainLines: ['基隆市', '新北市', '臺北市', '桃園市', '新竹縣', '新竹市', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣'],
      isLoading: false,
      traStations: [],
      filterTraStartStations: [],
      filterTraEndStations: [],
      dailyTrainTimetable: {},
      filterDailyTrainTimetable: {},
      isShowStartMainLine: false,
      isShowStartStation: false,
      isShowEndMainLine: false,
      isShowEndStation: false,
      isShowDatePicker: false,
      selected: {
        start: {
          mainLine: null,
          stationId: null,
          stationName: null,
        },
        end: {
          mainLine: null,
          stationId: null,
          stationName: null,
        },
        date: this.getDateString(),
        time: new Date().toLocaleTimeString('en-GB'),
      },
    }
  },
  components: {
    Loading,
  },
  mounted() {
    this.gettTraStation();
  },
  methods: {
    gettTraStation() {
      // this.isLoading = true;
      // this.$ajax({
      //   method: 'get',
      //   url: 'http://ptx.transportdata.tw/MOTC/v3/Rail/TRA/Station?$orderby=StationUID&$format=JSON',
      //   headers: this.$getAuthorizationHeader(),
      // }).then((res) => {
      //   this.traStations = res.data.Stations;
      //   this.isLoading = false;
      // });

      this.traStations = traStations;
    },
    getDateString() {
      let date = new Date(); // Or the date you'd like converted.
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
    },
    toggleSelectArea(area) {
      if (area === 'startMainLine') {
        this.isShowStartMainLine = true;
        this.isShowStartStation = false;
        this.isShowEndMainLine = false;
        this.isShowEndStation = false;
        this.isShowDatePicker = false;
      } else if (area === 'endMainLine') {
        this.isShowStartMainLine = false;
        this.isShowStartStation = false;
        this.isShowEndMainLine = true;
        this.isShowEndStation = false;
        this.isShowDatePicker = false;
      } else if (area === 'datePicker') {
        this.isShowStartMainLine = false;
        this.isShowStartStation = false;
        this.isShowEndMainLine = false;
        this.isShowEndStation = false;
        this.isShowDatePicker = true;
      } else if (area === 'reset') {
        this.isShowStartMainLine = false;
        this.isShowStartStation = false;
        this.isShowEndMainLine = false;
        this.isShowEndStation = false;
        this.isShowDatePicker = false;

        this.selected = {
          start: {
            mainLine: null,
            stationId: null,
            stationName: null,
          },
          end: {
            mainLine: null,
            stationId: null,
            stationName: null,
          },
          date: this.getDateString(),
          time: new Date().toLocaleTimeString().substr(2),
        };

        this.dailyTrainTimetable = {};
        this.filterDailyTrainTimetable = {};
      }
    },
    selectStartMainLine(mainLine) {
      this.isShowStartMainLine = false;
      this.isShowStartStation = true;

      this.selected.start.mainLine = mainLine;

      const filterTraStations = this.traStations.filter(traStation => traStation.StationAddress.replace(/[0-9]/g, '').substr(0, 3) === mainLine);
      this.filterTraStartStations = [];
      Object.assign(this.filterTraStartStations, filterTraStations);
    },
    selectStartStation(stationId, stationName) {
      this.isShowStartStation = false;
      this.isShowEndMainLine = true;

      this.selected.start.stationId = stationId;
      this.selected.start.stationName = stationName;
    },
    selectEndMainLine(mainLine) {
      this.isShowEndMainLine = false;
      this.isShowEndStation = true;

      this.selected.end.mainLine = mainLine;

      const filterTraStations = this.traStations.filter(traStation => traStation.StationAddress.replace(/[0-9]/g, '').substr(0, 3) === mainLine);
      this.filterTraEndStations = [];
      Object.assign(this.filterTraEndStations, filterTraStations);
    },
    selectEndStation(stationId, stationName) {
      this.isShowEndStation = false;
      this.isShowDatePicker = true;

      this.selected.end.stationId = stationId;
      this.selected.end.stationName = stationName;
    },
    checkRequired(complete) {

      if (!this.selected.start.stationId || !this.selected.end.stationId) {

        let errMsg = '';

        if (!this.selected.start.stationId && !this.selected.end.stationId) {
          errMsg = '【出發車站】與【抵達車站】'
        } else if (!this.selected.start.stationId) {
          errMsg = '【出發車站】'
        } else if (!this.selected.end.stationId) {
          errMsg = '【抵達車站】'
        }

        this.$swal({
          title: '必填未填',
          text: '請選擇' + errMsg + '。',
          icon: 'error',
          confirmButtonText: '關閉'
        });

      } else {
        complete();
      }

    },
    checkDateNotInPast(date, complete) {
      const selectedDate = new Date(date);
      // 如果選擇的日期是過去
      if (new Date(selectedDate.toDateString()) < new Date(new Date().toDateString())) {
        this.$swal({
          title: '參數錯誤',
          text: '出發日期不能小於今天。',
          icon: 'error',
          confirmButtonText: '關閉'
        });
      } else {
        complete();
      }
    },
    query() {
      this.checkRequired(() => {
        this.checkDateNotInPast(this.selected.date, () => {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatePicker = false;
          this.isLoading = true;

          this.$ajax({
            method: 'get',
            url: `http://ptx.transportdata.tw/MOTC/v3/Rail/TRA/DailyTrainTimetable/OD/Inclusive/${this.selected.start.stationId}/to/${this.selected.end.stationId}/${this.selected.date}?$format=JSON`,
            headers: this.$getAuthorizationHeader(),
          }).then((res) => {
            this.dailyTrainTimetable = res.data;
            Object.assign(this.filterDailyTrainTimetable, this.dailyTrainTimetable);
            this.filterDailyTrainTimetable.TrainTimetables.sort((a, b) => {
              return a.StopTimes[0].DepartureTime.localeCompare(b.StopTimes[0].DepartureTime);
            });
            this.isLoading = false;
          });
        });
      });
    },
    getTrainTypeVariant(trainTypeCode) {
      const trainTypeMap = {
        '1': 'success',
        '2': 'dark',
        '3': 'info',
        '4': 'danger',
        '5': 'warning',
        '6': 'primary',
        '7': 'primary',
        '10': 'primary',
      }

      return trainTypeMap[trainTypeCode];
    },
    trainTypeCodeToName(trainTypeCode) {
      const trainTypeMap = {
        '1': '太魯閣',
        '2': '普悠瑪',
        '3': '自強',
        '4': '莒光',
        '5': '復興',
        '6': '區間',
        '7': '普快',
        '10': '區間快',
      }

      return trainTypeMap[trainTypeCode];
    },
    caculateTimeRange(startTime, endTime) {
      let a = startTime;
      let b = endTime;
      console.log(a, b);
      return '';
    },
    tripLineToName(tripLine) {
      const trainLineMap = {
        '0': '', // 不經山海線
        '1': '山線',
        '2': '海遍',
      }

      return trainLineMap[tripLine];
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

#webTitle {
  cursor: pointer;
}

.menu {
  width: 100%;
  height: 60px;
}

.w100 {
  width: 100%;
}

.trainTimeCol {
  border: 1px solid #343a40;
  border-radius: 0.25rem;
}

.trainServiceIcon {
  width: 20px;
}
</style>
