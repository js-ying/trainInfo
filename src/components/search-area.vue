<template>
  <div id="search-area">
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
            class="pr-4 mb-3">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowStartMainLine || isShowStartStation }"
              @click="toggleSelectArea('startMainLine')">
              出發車站<br>
              {{ selected.start.stationName }}
            </b-button>
            <div id="reverse-train-station-button" @click="swapSeletedStation()">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-left-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.146 7.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L12.793 11l-2.647-2.646a.5.5 0 0 1 0-.708z"/>
                <path fill-rule="evenodd" d="M2 11a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 11zm3.854-9.354a.5.5 0 0 1 0 .708L3.207 5l2.647 2.646a.5.5 0 1 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
                <path fill-rule="evenodd" d="M2.5 5a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </div>
          </b-col>
          <!-- 抵達車站 -->
          <b-col
            cols="6"
            md="4"
            class="pl-4 mb-3">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowEndMainLine || isShowEndStation }"
              @click="toggleSelectArea('endMainLine')">
              抵達車站<br>
              {{ selected.end.stationName }}
            </b-button>
          </b-col>
          <!-- 出發日期 -->
          <b-col
            cols="12"
            md="4"
            class="mb-3">
            <b-button
              variant="outline-dark"
              class="menu"
              :class="{ active : isShowDatePicker }"
              @click="toggleSelectArea('datePicker')">
              出發日期<br>
              {{ checkIfBrowserSupportDatetimePicker() ? this.selected.dateTime.split('T')[0] : selected.date }}
              {{ checkIfBrowserSupportDatetimePicker() ? this.selected.dateTime.split('T')[1] : selected.time.slice(0, -3) }}
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
          <template v-if="checkIfBrowserSupportDatetimePicker()">
            <input type="datetime-local" :min="this.$commonService.getNowYYYYMMDD() + 'T' + this.$commonService.getNowTime().slice(0, 5)" class="form-control" id="datetime-picker" :value="selected.dateTime" @input="updateDateTimeValue($event.target.value)" @change="updateDateTimeValue($event.target.value)">
          </template>
          <template v-else>
            <b-form-datepicker
              v-model="selected.date"
              class="mb-2">
            </b-form-datepicker>
            <b-form-timepicker
              v-model="selected.time"
              locale="en">
            </b-form-timepicker>
          </template>
        </b-col>
      </b-row>
    </b-container>
    <!-- 查詢按鈕 -->
    <div class="mb-4">
      <!-- <b-button
        class="mr-3"
        variant="outline-secondary"
        @click="swapSeletedStation()">
        起迄站互換
      </b-button> -->
      <b-button
        variant="dark"
        @click="query()">
        查詢
      </b-button>
    </div>
    <keep-alive include="Search">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import TraStations from '../assets/traStations';

export default {
  name: 'SearchArea',
  components: {
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
        time: this.$commonService.getNowTime(),
        dateTime: this.$commonService.getNowYYYYMMDD() + 'T' + this.$commonService.getNowTime().slice(0, 5),
      },
    };
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
    saveLocalStorage() {
      this.myStorage.setItem('selectedStart', JSON.stringify(this.selected.start));
      this.myStorage.setItem('selectedEnd', JSON.stringify(this.selected.end));
    },
    toggleSelectArea(area) {
      if (area === 'startMainLine') {
        if (this.isShowStartMainLine) {
          this.isShowStartMainLine = false;
        } else {
          this.isShowStartMainLine = true;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatePicker = false;
        }
      } else if (area === 'endMainLine') {
        if (this.isShowEndMainLine) {
          this.isShowEndMainLine = false;
        } else {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = true;
          this.isShowEndStation = false;
          this.isShowDatePicker = false;
        }
      } else if (area === 'datePicker') {
        if (this.isShowDatePicker) {
          this.isShowDatePicker = false;
        } else {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatePicker = true;
        }
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
          time: this.$commonService.getNowTime(),
          dateTime: this.$commonService.getNowYYYYMMDD() + 'T' + this.$commonService.getNowTime().slice(0, 5),
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
    swapSeletedStation() {
      if (!Object.values(this.selected.start).includes(null) && !Object.values(this.selected.end).includes(null)) {
        let start = {}, end = {};
        Object.assign(start, this.selected.start);
        Object.assign(end, this.selected.end);
        Object.assign(this.selected.start, end);
        Object.assign(this.selected.end, start);
      }
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
    simplifyTime(time) {
      return time.split(':')[0] + time.split(':')[1];
    },
    query() {
      this.checkRequired(() => {
        this.checkDateNotInPast(this.selected.dateTime.split('T')[0], () => {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatePicker = false;

          this.saveLocalStorage();

          this.$router.push({
            name: 'SearchResult',
            query: {
              s: this.selected.start.stationName,
              e: this.selected.end.stationName,
              d: this.selected.dateTime.split('T')[0],
              t: this.simplifyTime(this.selected.dateTime.split('T')[1]),
            }
          }).catch(() => {});
        });
      });
    },
    checkIfBrowserSupportDatetimePicker() {
      let input = document.createElement('input');
      let value = 'a';
      input.setAttribute('type', 'datetime-local');
      input.setAttribute('value', value);

      let ifSupport = input.value !== value;

      return ifSupport;
    },
    updateDateTimeValue(value) {
      this.selected.dateTime = value;
      this.$emit('input', value);
    }
  }
}
</script>

<style scoped>
.menu {
  width: 100%;
  height: 60px;
}

#reverse-train-station-button {
  position: absolute;
  z-index: 10;
  right: -20px;
  top: 10px;
  width: 40px;
  height: 40px;
  font-size: 1.3rem;
  cursor: pointer;
  color: #6c757d;
}

#reverse-train-station-button:hover {
  color: #494f54;
}

#datetime-picker {
  
}

@media screen and (max-width: 768px) {
  #param-adjustment-area .btn-secondary:hover {
    background-color: #6c757d !important;
  }
}
</style>