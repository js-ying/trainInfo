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
      <b-icon
        icon="house-door-fill"
        variant="light"
        class="rounded-circle bg-secondary p-2"
        id="about-me"
        @click="isShowAboutMeDetail = !isShowAboutMeDetail"
      ></b-icon>
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
        class="mr-3"
        variant="outline-secondary"
        @click="swapSeletedStation()"
      >起迄站互換</b-button>
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
      <div class="d-flex justify-content-between">
        <!-- 車種篩選按鈕群組 -->
        <b-button-group
          size="sm"
          class="mb-3"
          id="train-Type-filter-btns"
        >
          <b-button
            v-for="trainTypeFilterBtn in trainTypeFilterBtns"
            :key="trainTypeFilterBtn.value"
            :class="{ active : trainTypeFilterBtn.actived }"
            @click="filterTrainType(trainTypeFilterBtn.value)"
          >{{ trainTypeFilterBtn.name }}</b-button>
        </b-button-group>
        <!-- 查詢結果頁數 -->
        <div id="result-number">
          {{ filterTrainTimetables.length + ' 筆 / ' + dailyTrainTimetable.TrainTimetables.length + ' 筆'}}
        </div>
      </div>
      <!-- 列車資訊 -->
      <b-row>
        <b-col
          cols="12"
          class="mb-3"
          v-for="(filterTrainTimetable, $index) in filterTrainTimetables"
          :key="$index"
        >
          <div
            class="train-time-col bv-example-row-flex-cols p-2"
            @click="showTrainTimeDetail(filterTrainTimetable)"
          >
            <b-row align-v="center">
              <b-col cols="3">
                <div class="train-time-left-side">
                  {{ filterTrainTimetable.TrainInfo.TrainNo }} {{ transformTripLineToName(filterTrainTimetable.TrainInfo.TripLine) }}
                </div>
                <div class="mb-1">
                  <b-badge :variant="getTrainTypeVariant(filterTrainTimetable.TrainInfo.TrainTypeCode)">{{ transformTrainTypeCodeToName(filterTrainTimetable.TrainInfo.TrainTypeCode) }}</b-badge>
                </div>
                <div class="train-time-left-side">
                  {{ filterTrainTimetable.TrainInfo.StartingStationName.Zh_tw }}-{{ filterTrainTimetable.TrainInfo.EndingStationName.Zh_tw }}
                </div>
              </b-col>
              <b-col cols="6">
                {{ filterTrainTimetable.StopTimes[0].DepartureTime }} - {{ filterTrainTimetable.StopTimes[filterTrainTimetable.StopTimes.length - 1].ArrivalTime }}
                <div class="train-time-diff">{{ getTimeDiff(filterTrainTimetable.StopTimes[0].DepartureTime, filterTrainTimetable.StopTimes[filterTrainTimetable.StopTimes.length - 1].ArrivalTime) }}</div>
              </b-col>
              <b-col cols="3">
                <span
                  v-for="(trainService, $index) in trainServices"
                  :key="$index"
                >
                  <img
                    :src="getImagesSrc(trainService.imgName)"
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
    <!-- 列車時刻詳細資料 modal -->
    <b-modal
      v-model="isShowTrainTimeDetail"
      title="列車資訊"
      :hideHeaderClose="true"
      okTitle="關閉"
      ok-only
      :centered="true"
    >
      <b-row
        align-v="center"
        class="text-center mb-3"
      >
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100"
          >站名</b-badge>
        </b-col>
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100"
          >到站時間</b-badge>
        </b-col>
        <b-col cols="4">
          <b-badge
            pill
            variant="primary"
            class="t100"
          >離站時間</b-badge>
        </b-col>
      </b-row>
      <template v-if="clickedTrainTimeDetail && clickedTrainTimeDetail.StopTimes">
        <b-row
          align-v="center"
          class="text-center mb-2"
          v-for="(stopTime, $index) in clickedTrainTimeDetail.StopTimes"
          :key="$index"
        >
          <b-col cols="4">{{ stopTime.StationName.Zh_tw }}</b-col>
          <b-col cols="4">{{ stopTime.ArrivalTime }}</b-col>
          <b-col cols="4">{{ stopTime.DepartureTime }}</b-col>
        </b-row>
      </template>
    </b-modal>
    <!-- 關於台鐵時刻表 modal -->
    <b-modal
      v-model="isShowAboutMeDetail"
      title="關於台鐵時刻查詢"
      :hideHeaderClose="true"
      okTitle="關閉"
      ok-only
      :centered="true"
    >
      <p>
        作者：JS Ying<br />
        個人網站：<a
          href="https://jsy.tw"
          target="_blanl"
        >https://jsy.tw</a>
      </p>
      <p>
        別問我為什麼要做大家都做過的東西，因為我就想。
      </p>
      <div id="about-update-time">
        <b-icon
          icon="link45deg"
          variant="secondary"
          class="mr-2"
        ></b-icon>素材來源：<a
          :href="iconSource.link"
          target="_blank"
          v-for="(iconSource, $index) in iconSources"
          :key="$index"
        >
          <img
            :src="getImagesSrc(iconSource.imgSrc)"
            width="15px"
            class="mr-1"
          >
        </a>
      </div>
      <div id="about-update-time">
        <b-icon
          icon="exclamation-circle-fill"
          variant="secondary"
          class="mr-2"
        ></b-icon>發行日：2020/04，最後更新：2020/04
      </div>
    </b-modal>
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
      myStorage: null,
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
        // start: {
        //   mainLine: '臺北市',
        //   stationId: '1000',
        //   stationName: '臺北',
        // },
        // end: {
        //   mainLine: '新竹市',
        //   stationId: '1210',
        //   stationName: '新竹',
        // },
        date: this.getDateString(),
        time: new Date().toLocaleTimeString('en-GB'),
      },
      trainTypeFilterBtns: [
        {
          actived: true,
          name: '全部',
          value: 'all',
        },
        {
          actived: false,
          name: '對號列車',
          value: 'express',
        },
        {
          actived: false,
          name: '非對號列車',
          value: 'non-express',
        },
      ],
      filterTrainTypesRegExp: '',
      isShowTrainTimeDetail: false,
      clickedTrainTimeDetail: null,
      isShowAboutMeDetail: false,
      iconSources: [
        {
          link: 'https://www.flaticon.com/free-icon/train_712163?term=train&page=1&position=50',
          author: 'DinosoftLabs',
          imgSrc: 'logo',
        },
        {
          link: 'https://www.flaticon.com/free-icon/disability_414221?term=disabled&page=1&position=26',
          author: 'Freepik',
          imgSrc: 'disability',
        },
        {
          link: 'https://www.flaticon.com/free-icon/breastfeeding_1320921?term=breastfeeding&page=1&position=49',
          author: 'Freepik',
          imgSrc: 'breast-feeding',
        },
        {
          link: 'https://www.flaticon.com/free-icon/bike_2636494?term=bike&page=1&position=63',
          author: 'Freepik',
          imgSrc: 'bicycle',
        }
      ],
    }
  },
  components: {
    Loading,
  },
  mounted() {
    this.gettTraStation();
    this.myStorage = window.localStorage;
    this.setLocalStorage();
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
    setLocalStorage() {
      if (this.myStorage.selectedStart && this.myStorage.selectedEnd) {
        this.selected.start = JSON.parse(this.myStorage.selectedStart);
        this.selected.end = JSON.parse(this.myStorage.selectedEnd);
      }
    },
    getImagesSrc(name) {
      let images = require.context('./assets/images', false, /\.png$/);
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
          this.dailyTrainTimetable = {};
          this.isLoading = true;
          this.saveLocalStorage();

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

            this.isLoading = false;
          });
        });
      });
    },
    saveLocalStorage() {
      this.myStorage.setItem('selectedStart', JSON.stringify(this.selected.start));
      this.myStorage.setItem('selectedEnd', JSON.stringify(this.selected.end));
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
    getTimeDiff(startTime, endTime) {
      let endDateTime = this.selected.date;
      if (endTime < startTime) {
        let date = new Date(this.selected.date);
        endDateTime = new Date(date.setDate(date.getDate() + 1));
        endDateTime = new Date(endDateTime.getTime() - (endDateTime.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
      }

      let date1 = new Date(this.selected.date + 'T' + startTime); // 開始時間
      let date2 = new Date(endDateTime + 'T' + endTime); // 結束時間
      let date3 = date2.getTime() - date1.getTime(); // 時間差的毫秒數

      //計算出相差天數
      // let days = Math.floor(date3 / (24 * 3600 * 1000))

      //計算出小時數
      let leave1 = date3 % (24 * 3600 * 1000); // 計算天數後剩餘的毫秒數
      let hours = Math.floor(leave1 / (3600 * 1000));

      //計算相差分鐘數
      let leave2 = leave1 % (3600 * 1000); // 計算小時數後剩餘的毫秒數
      let minutes = Math.floor(leave2 / (60 * 1000));

      //計算相差秒數
      // let leave3 = leave2 % (60 * 1000); // 計算分鐘數後剩餘的毫秒數
      // let seconds = Math.round(leave3 / 1000);

      return hours + ' 時 ' + minutes + ' 分';
    },
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
      this.trainTypeFilterBtns.forEach(trainTypeFilterBtn => {
        if (trainTypeFilterBtn.value === value) {
          trainTypeFilterBtn.actived = true;
        } else {
          trainTypeFilterBtn.actived = false;
        }
      });

      // 2. 製作篩選車種的正規表達式
      if (value === 'all') {
        this.filterTrainTypesRegExp = '';
      } else if (value === 'express') {
        this.filterTrainTypesRegExp = `^${TrainTypes.TAROKO.value}$|^${TrainTypes.PUYUMA.value}$|^${TrainTypes.TZE_CHIANG.value}$|^${TrainTypes.CHU_KUANG.value}$|^${TrainTypes.FU_HSING.value}$`;
      } else {
        this.filterTrainTypesRegExp = `^${TrainTypes.LOCAL.value}$|^${TrainTypes.ORDINARY.value}$|^${TrainTypes.FAST_LOCAL.value}$`;
      }

    },
    showTrainTimeDetail(trainTime) {
      this.isShowTrainTimeDetail = true;
      this.clickedTrainTimeDetail = trainTime;
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

#result-number {
  font-size: 85%;
  padding-top: 5px;
}

.train-time-col {
  border: 1px solid #343a40;
  border-radius: 0.25rem;
  cursor: pointer;
}

.train-time-diff {
  font-size: 85%;
  color: #545b62;
}

.train-service-icon {
  width: 20px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}

#about-update-time {
  font-size: 0.85em;
  color: #6c757d;
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
