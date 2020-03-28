<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
    ></loading>
    <div class="mb-2">
      <h4
        id="webTitle"
        @click="toggleSelectArea('reset')"
      >台鐵時刻表</h4>
      <b-container class="mt-4 bv-example-row">
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
            >
              出發車站<br>
              {{ selected.start.stationName }}
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
            >
              抵達車站<br>
              {{ selected.end.stationName }}
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
            >
              出發日期<br>
              {{ selected.date.toISOString().slice(0, 10) }}
              {{ selected.time.substr(0, 5) }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <b-container class="bv-example-row mb-2">
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
    <div class="mb-3">
      <b-button
        variant="dark"
        @click="query()"
      >query</b-button>
    </div>
    <div class="mb-3">
      {{ data }}
    </div>
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
      traStations: [],
      filterTraStartStations: [],
      filterTraEndStations: [],
      data: [],
      isLoading: false,
      isShowStartMainLine: true,
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
        date: new Date(),
        time: new Date().toLocaleTimeString().substr(2),
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
        this.isShowStartMainLine = true;
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
          date: new Date(),
          time: new Date().toLocaleTimeString().substr(2),
        };
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

      this.selected.end.stationName = stationName;


    },
    query() {
      this.isLoading = true;
      this.$ajax({
        method: 'get',
        url: 'http://ptx.transportdata.tw/MOTC/v3/Rail/TRA/DailyTrainTimetable/OD/Inclusive/1020/to/0900/2020-03-29?$top=1&$format=JSON',
        headers: this.$getAuthorizationHeader(),
      }).then((res) => {
        this.data = res;
        this.isLoading = false;
      });
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
</style>
