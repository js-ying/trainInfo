<template>
  <div id="app">
    <!-- 導覽列 -->
    <div class="mb-2">
      <h5
        id="web-title"
        class="mb-4"
        @click="toggleSelectArea('reset')">
        台鐵時刻查詢
      </h5>
      <b-container class="bv-example-row">
        <b-row class="justify-content-md-center">
          <!-- 出發車站 -->
          <b-col
            cols="6"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('startMainLine')">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowStartMainLine || isShowStartStation }">
              出發車站<br>
              {{ selected.start.stationName }}
            </b-button>
          </b-col>
          <!-- 抵達車站 -->
          <b-col
            cols="6"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('endMainLine')">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowEndMainLine || isShowEndStation }">
              抵達車站<br>
              {{ selected.end.stationName }}
            </b-button>
          </b-col>
          <!-- 出發日期 -->
          <b-col
            cols="12"
            md="4"
            class="mb-3"
            @click="toggleSelectArea('datePicker')">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowDatePicker }">
              出發日期<br>
              {{ selected.date }}
              {{ selected.time.slice(0, -3) }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <!-- 參數調整區域 -->
    <b-container
      class="mb-2 bv-example-row"
      id="param-adjustment-area">
      <b-row v-if="isShowStartMainLine">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(mainLine, $index) in mainLines"
          :key="$index">
          <b-button
            variant="secondary"
            class="w100"
            @click="selectStartMainLine(mainLine)">
            {{ mainLine }}
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowStartStation">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(filterTraStartStation, $index) in filterTraStartStations"
          :key="$index">
          <b-button
            variant="secondary"
            :value="filterTraStartStation.StationID"
            class="w100"
            :class="{ 'high-level-station' : filterTraStartStation.StationClass === '0' || filterTraStartStation.StationClass === '1' }"
            @click="selectStartStation(filterTraStartStation.StationID, filterTraStartStation.StationName.Zh_tw)">
            {{ filterTraStartStation.StationClass === '0' || filterTraStartStation.StationClass === '1' ? '＊' : '' }}
            {{ filterTraStartStation.StationName.Zh_tw }}
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowEndMainLine">
        <b-col
          cols="6"
          md="4"
          lg="3"
          class="mb-3"
          v-for="(mainLine, $index) in mainLines"
          :key="$index">
          <b-button
            variant="secondary"
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
          :key="$index">
          <b-button
            variant="secondary"
            :value="filterTraEndStation.StationID"
            class="w100"
            :class="{ 'high-level-station' : filterTraEndStation.StationClass === '0' || filterTraEndStation.StationClass === '1' }"
            @click="selectEndStation(filterTraEndStation.StationID, filterTraEndStation.StationName.Zh_tw)">
            {{ filterTraEndStation.StationClass === '0' || filterTraEndStation.StationClass === '1' ? '＊' : '' }}
            {{ filterTraEndStation.StationName.Zh_tw }}
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="isShowDatePicker">
        <b-col
          cols="12"
          class="mb-3">
          <b-form-datepicker
            v-model="selected.date"
            class="mb-2">
          </b-form-datepicker>
          <b-form-timepicker
            v-model="selected.time"
            locale="en">
          </b-form-timepicker>
        </b-col>
      </b-row>
    </b-container>
    <!-- 查詢按鈕 -->
    <div class="mb-4">
      <b-button
        class="mr-3"
        variant="outline-secondary"
        @click="swapSeletedStation()">
        起迄站互換
      </b-button>
      <b-button
        variant="dark"
        @click="query()">
        查詢
      </b-button>
    </div>
    <router-view></router-view>
    <!-- 列車時刻詳細資料 modal -->
    <b-modal
      v-model="isShowTrainTimeDetail"
      title="列車資訊"
      :hideHeaderClose="true"
      okTitle="關閉"
      ok-only
      :centered="true">
      <b-row
        align-v="center"
        class="text-center mb-3">
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100">站名</b-badge>
        </b-col>
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100">
            到站時間
          </b-badge>
        </b-col>
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100">
            離站時間
          </b-badge>
        </b-col>
      </b-row>
      <template v-if="clickedTrainTimeDetail && clickedTrainTimeDetail.StopTimes">
        <b-row
          align-v="center"
          class="text-center mb-2"
          v-for="(stopTime, $index) in clickedTrainTimeDetail.StopTimes"
          :key="$index">
          <b-col cols="4">{{ stopTime.StationName.Zh_tw }}</b-col>
          <b-col cols="4">{{ stopTime.ArrivalTime }}</b-col>
          <b-col cols="4">{{ stopTime.DepartureTime }}</b-col>
        </b-row>
      </template>
    </b-modal>
    <!-- 關於台鐵時刻表 icon -->
    <b-icon
      icon="house-door-fill"
      variant="light"
      class="rounded-circle bg-secondary p-2"
      id="about-me"
      @click="isShowAboutMeModal = true">
    </b-icon>
    <!-- 關於台鐵時刻表 modal -->
    <about-me-modal
      :callShow="isShowAboutMeModal"
      @callHide="isShowAboutMeModal = false">
    </about-me-modal>
  </div>
</template>

<script>
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import TraStations from './assets/traStations';

import AboutMeModal from './modal/AboutMeModal';

export default {
  name: 'App',
  components: {
    AboutMeModal,
  },
  data() {
    return {
      myStorage: null,
      mainLines: ['基隆市', '新北市', '臺北市', '桃園市', '新竹縣', '新竹市', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣'],
      traStations: [],
      filterTraStartStations: [],
      filterTraEndStations: [],
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
        date: this.$commonService.getNowYYYYMMDD(),
        time: new Date().toLocaleTimeString('en-GB'),
      },
      isShowTrainTimeDetail: false,
      clickedTrainTimeDetail: null,
      isShowAboutMeModal: false,
    }
  },
  mounted() {
    this.gettTraStation();
    this.myStorage = window.localStorage;
    this.setLocalStorage();
  },
  methods: {
    gettTraStation() {
      // this.isLoading = true;
      // this.$ajax({
      //   method: 'get',
      //   url: 'https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/Station?$orderby=StationUID&$format=JSON',
      //   headers: this.$getAuthorizationHeader(),
      // }).then((res) => {
      //   this.traStations = res.data.Stations;
      //   this.isLoading = false;
      // });

      this.traStations = TraStations;
    },
    setLocalStorage() {
      if (this.myStorage.selectedStart && this.myStorage.selectedEnd) {
        this.selected.start = JSON.parse(this.myStorage.selectedStart);
        this.selected.end = JSON.parse(this.myStorage.selectedEnd);
      }
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
          date: this.$commonService.getNowYYYYMMDD(),
          time: new Date().toLocaleTimeString('en-GB'),
        };

        this.dailyTrainTimetable = {};

        this.$router.push({
          name: 'Home',
          
        }).catch(() => {});
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

        this.$bvModal.msgBoxOk('請選擇' + errMsg + '。', {
          title: '錯誤',
          okTitle: "關閉",
          okVariant: 'primary',
          headerClass: 'border-bottom-0',
          footerClass: 'border-top-0',
          centered: true,
        });

      } else {
        complete();
      }

    },
    checkDateNotInPast(date, complete) {
      const selectedDate = new Date(date);
      // 如果選擇的日期是過去
      if (new Date(selectedDate.toDateString()) < new Date(new Date().toDateString())) {
        this.$bvModal.msgBoxOk('出發日期不能小於今天。', {
          title: '錯誤',
          okTitle: "關閉",
          okVariant: 'primary',
          headerClass: 'border-bottom-0',
          footerClass: 'border-top-0',
          centered: true,
        });
      } else {
        complete();
      }
    },
    swapSeletedStation() {
      if (!Object.values(this.selected.start).includes(null) && !Object.values(this.selected.end).includes(null)) {
        let start = {}, end = {};
        Object.assign(start, this.selected.start);
        Object.assign(end, this.selected.end);
        Object.assign(this.selected.start, end);
        Object.assign(this.selected.end, start);
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

          this.saveLocalStorage();

          this.$router.push({
            name: 'Search',
            query: {
              s: this.selected.start.stationName,
              e: this.selected.end.stationName,
              d: this.selected.date,
              t: this.simplifyTime(this.selected.time),
            }
          }).catch(() => {});
        });
      });
    },
    saveLocalStorage() {
      this.myStorage.setItem('selectedStart', JSON.stringify(this.selected.start));
      this.myStorage.setItem('selectedEnd', JSON.stringify(this.selected.end));
    },
    simplifyTime(time) {
      return time.split(':')[0] + time.split(':')[1];
    }
  },
}
</script>

<style>
#app {
  font-family: "Helvetica Neue For Number", "Chinese Quote", -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

.w100 {
  width: 100%;
}

.t100 {
  font-size: 100%;
}

#about-me {
  position: fixed;
  z-index: 10;
  right: 20px;
  bottom: 20px;
  font-size: 2em;
  cursor: pointer;
}

#web-title {
  cursor: pointer;
}

.menu {
  width: 100%;
  height: 60px;
}

@media screen and (max-width: 768px) {
  #param-adjustment-area .btn-secondary:hover {
    background-color: #6c757d !important;
  }
}
</style>
