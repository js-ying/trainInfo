<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
    ></loading>
    <!-- 導覽列 -->
    <div class="mb-2">
      <h5
        id="web-title"
        class="mb-4"
        @click="toggleSelectArea('reset')"
      >台鐵時刻表</h5>
      <b-container class="bv-example-row">
        <b-row class="justify-content-md-center">
          <!-- 出發車站 -->
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
            </b-button>
          </b-col>
          <!-- 抵達車站 -->
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
            </b-button>
          </b-col>
          <!-- 出發日期 -->
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
    <b-container
      class="mb-2 bv-example-row"
      id="param-adjustment-area"
    >
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
            variant="secondary"
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
            variant="secondary"
            :value="filterTraStartStation.StationID"
            class="w100"
            :class="{ 'high-level-station' : filterTraStartStation.StationClass === '0' || filterTraStartStation.StationClass === '1' }"
            @click="selectStartStation(filterTraStartStation.StationID, filterTraStartStation.StationName.Zh_tw)"
          >
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
          :key="$index"
        >
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
          :key="$index"
        >
          <b-button
            variant="secondary"
            :value="filterTraEndStation.StationID"
            class="w100"
            :class="{ 'high-level-station' : filterTraEndStation.StationClass === '0' || filterTraEndStation.StationClass === '1' }"
            @click="selectEndStation(filterTraEndStation.StationID, filterTraEndStation.StationName.Zh_tw)"
          >
            {{ filterTraEndStation.StationClass === '0' || filterTraEndStation.StationClass === '1' ? '＊' : '' }}
            {{ filterTraEndStation.StationName.Zh_tw }}
          </b-button>
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
    <!-- 查詢按鈕 -->
    <div class="mb-4">
      <b-button
        variant="dark"
        @click="query()"
      >查詢</b-button>
    </div>
    <!-- 查詢結果 -->
    <b-container
      class="mb-3 bv-example-row"
      v-if="dailyTrainTimetable.TrainTimetables"
    >
      <!-- 車種篩選按鈕群組 -->
      <b-button-group
        size="sm"
        class="mb-3"
      >
        <b-button
          v-for="trainTypeFilterBtn in trainTypeFilterBtns"
          :key="trainTypeFilterBtn.value"
          :class="{ active : trainTypeFilterBtn.actived }"
          @click="filterTrainType(trainTypeFilterBtn.value)"
        >{{ trainTypeFilterBtn.name }}</b-button>
      </b-button-group>
      <!-- 列車資訊 -->
      <b-row>
        <b-col
          cols="12"
          class="mb-3"
          v-for="(filterTrainTimetable, $index) in filterTrainTimetables"
          :key="$index"
        >
          <div class="train-time-col bv-example-row-flex-cols p-2">
            <b-row align-v="center">
              <b-col cols="3">
                <div class="train-time-left-side">
                  {{ filterTrainTimetable.TrainInfo.TrainNo }} {{ transformTripLineToName(filterTrainTimetable.TrainInfo.TripLine) }}
                </div>
                <div class="mb-1">
                  <b-badge :variant="getTrainTypeVariant(filterTrainTimetable.TrainInfo.TrainTypeCode)">{{ transformTrainTypeCodeToName(filterTrainTimetable.TrainInfo.TrainTypeCode) }}</b-badge>
                </div>
                <div class="train-time-left-side">
                  {{ filterTrainTimetable.TrainInfo.StartingStationName.Zh_tw }} - {{ filterTrainTimetable.TrainInfo.EndingStationName.Zh_tw }}
                </div>
              </b-col>
              <b-col cols="6">
                {{ filterTrainTimetable.StopTimes[0].DepartureTime }} - {{ filterTrainTimetable.StopTimes[filterTrainTimetable.StopTimes.length - 1].ArrivalTime }}<br>
                <!-- {{ caculateTimeRange(filterTrainTimetable.StopTimes[0].DepartureTime, filterTrainTimetable.StopTimes[filterTrainTimetable.StopTimes.length - 1].ArrivalTime) }} -->
              </b-col>
              <b-col cols="3">
                <span
                  v-for="(trainService, $index) in trainServices"
                  :key="$index"
                >
                  <img
                    :src="gettrainServiceImgSrc(trainService.imgName)"
                    class="train-service-icon"
                    v-b-tooltip.hover
                    :title="trainService.description"
                    v-if="filterTrainTimetable.TrainInfo[trainService.flagName]"
                  >
                </span>
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
import { TrainTypes, TripLines } from './assets/constants';

export default {
  name: 'App',
  data() {
    return {
      mainLines: ['基隆市', '新北市', '臺北市', '桃園市', '新竹縣', '新竹市', '苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣', '臺東縣', '花蓮縣', '宜蘭縣'],
      trainServices: [
        {
          imgName: 'disability',
          flagName: 'WheelChairFlag',
          description: '身障旅客專用座位車',
        },
        {
          imgName: 'suitcase',
          flagName: 'PackageServiceFlag',
          description: '行李服務',
        },
        {
          imgName: 'lunch',
          flagName: 'DiningFlag',
          description: '訂便當服務',
        },
        {
          imgName: 'breast-feeding',
          flagName: 'BreastFeedFlag',
          description: '哺(集)乳室車廂',
        },
        {
          imgName: 'bicycle',
          flagName: 'BikeFlag',
          description: '人車同行',
        },
        {
          imgName: 'car',
          flagName: 'CarFlag',
          description: '小汽車上火車',
        },
        {
          imgName: 'train',
          flagName: 'ExtraTrainFlag',
          description: '為加班車',
        },
      ],
      isLoading: false,
      traStations: [],
      filterTraStartStations: [],
      filterTraEndStations: [],
      dailyTrainTimetable: {},
      isShowStartMainLine: false,
      isShowStartStation: false,
      isShowEndMainLine: false,
      isShowEndStation: false,
      isShowDatePicker: false,
      selected: {
        // start: {
        //   mainLine: null,
        //   stationId: null,
        //   stationName: null,
        // },
        // end: {
        //   mainLine: null,
        //   stationId: null,
        //   stationName: null,
        // },
        start: {
          mainLine: null,
          stationId: '1000',
          stationName: '臺北',
        },
        end: {
          mainLine: null,
          stationId: '1210',
          stationName: '新竹',
        },
        date: this.getDateString(),
        time: new Date().toLocaleTimeString('en-GB'),
      },
      trainTypeFilterBtns: [],
      filterTrainTypesRegExp: '',
    }
  },
  components: {
    Loading,
  },
  mounted() {
    this.gettTraStation();
    this.getTrainTypeFilterBtns();
  },
  computed: {
    filterTrainTimetables() {
      return this.dailyTrainTimetable.TrainTimetables.filter(trainTimetable =>
        trainTimetable.TrainInfo.TrainTypeCode.match(new RegExp(this.filterTrainTypesRegExp))
      );
    }
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

      this.traStations = traStations;
    },
    getTrainTypeFilterBtns() {
      for (const trainType in TrainTypes) {
        this.trainTypeFilterBtns.push({
          name: TrainTypes[trainType].name,
          value: TrainTypes[trainType].value,
          actived: TrainTypes[trainType].value === TrainTypes.ALL.value ? true : false,
        });
      }
    },
    gettrainServiceImgSrc(name) {
      let images = require.context('./assets/train-service-icon', false, /\.png$/);
      return images('./' + name + ".png")
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
          time: new Date().toLocaleTimeString('en-GB'),
        };

        this.dailyTrainTimetable = {};
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
            url: `https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/DailyTrainTimetable/OD/Inclusive/${this.selected.start.stationId}/to/${this.selected.end.stationId}/${this.selected.date}?$format=JSON`,
            headers: this.$getAuthorizationHeader(),
          }).then((res) => {
            Object.assign(this.dailyTrainTimetable, res.data);

            // 依駛離日期由小到大排序
            this.dailyTrainTimetable.TrainTimetables.sort((a, b) => {
              return a.StopTimes[0].DepartureTime.localeCompare(b.StopTimes[0].DepartureTime);
            });

            // 只顯示大於查詢條件【出發日期 HH:mm】的結果
            this.dailyTrainTimetable.TrainTimetables = this.dailyTrainTimetable.TrainTimetables.filter((trainTimeTable) => {
              return trainTimeTable.StopTimes[0].DepartureTime > this.selected.time.slice(0, -3);
            });

            console.log('query', this.dailyTrainTimetable.TrainTimetables);

            this.isLoading = false;
          });
        });
      });
    },
    getTrainTypeVariant(trainTypeCode) {
      const trainTypeVariantMap = {};

      for (const trainType in TrainTypes) {
        trainTypeVariantMap[TrainTypes[trainType].value] = TrainTypes[trainType].labelColorClass;
      }

      return trainTypeVariantMap[trainTypeCode];
    },
    transformTrainTypeCodeToName(trainTypeCode) {
      const trainTypeMap = {};

      for (const trainType in TrainTypes) {
        trainTypeMap[TrainTypes[trainType].value] = TrainTypes[trainType].name
      }

      return trainTypeMap[trainTypeCode];
    },
    // caculateTimeRange(startTime, endTime) {
    //   console.log(startTime, endTime);
    //   return '';
    // },
    transformTripLineToName(tripLine) {
      const tripLineMap = {};

      for (const tripLine in TripLines) {
        tripLineMap[TripLines[tripLine].value] = TripLines[tripLine].name
      }

      return tripLineMap[tripLine];
    },
    filterTrainType(value) {
      this.filterTrainTypesRegExp = '';

      // 1. 控制按鈕 actived 狀態

      if (value === TrainTypes.ALL.value) {
        // 除了全部按鈕，其它皆取消 actived
        this.trainTypeFilterBtns.forEach(trainTypeFilterBtn => {
          if (trainTypeFilterBtn.value === TrainTypes.ALL.value) {
            trainTypeFilterBtn.actived = true;
          } else {
            trainTypeFilterBtn.actived = false;
          }
        });
      } else {
        // 取消全部按鈕的 actived，並將該按鈕 actived 設為相反
        this.trainTypeFilterBtns.forEach(trainTypeFilterBtn => {
          if (trainTypeFilterBtn.value === TrainTypes.ALL.value) {
            trainTypeFilterBtn.actived = false;
          }
          if (trainTypeFilterBtn.value === value) {
            trainTypeFilterBtn.actived = !trainTypeFilterBtn.actived;
          }
        });
      }

      // 2. 製作篩選車種的正規表達式

      this.filterTrainTypesRegExp = '^';
      this.trainTypeFilterBtns.forEach(trainTypeFilterBtn => {
        if (trainTypeFilterBtn.actived === true) {
          this.filterTrainTypesRegExp = this.filterTrainTypesRegExp + trainTypeFilterBtn.value + '|'
        }
      });

      if (this.filterTrainTypesRegExp === '^all|') {
        this.filterTrainTypesRegExp = '';
      } else if (this.filterTrainTypesRegExp === '^') {
        this.filterTrainTypesRegExp = '';
        this.trainTypeFilterBtns[0].actived = true;
      } else {
        this.filterTrainTypesRegExp = this.filterTrainTypesRegExp.substring(0, this.filterTrainTypesRegExp.length - 1) + '$';
      }
    },
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

#web-title {
  cursor: pointer;
}

.menu {
  width: 100%;
  height: 60px;
}

.high-level-station {
}

.train-time-col {
  border: 1px solid #343a40;
  border-radius: 0.25rem;
}

.train-service-icon {
  width: 20px;
}

@media screen and (max-width: 768px) {
  #param-adjustment-area .btn-secondary:hover {
    background-color: #6c757d !important;
  }

  .train-time-left-side {
    font-size: 75%;
  }
}
</style>
