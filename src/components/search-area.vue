<template>
  <div id="search-area">
    <template v-if="$route.name !== 'TrainTimeDetail'">
      <!-- 導覽列 -->
      <div class="mb-2">
        <h5 id="web-title" class="mb-4" @click="toggleSelectArea('reset')">
          台鐵時刻查詢
        </h5>
        <b-container class="bv-example-row">
          <b-row class="justify-content-md-center">
            <!-- 出發車站 -->
            <b-col cols="6" md="4" class="pr-4 mb-3">
              <b-button variant="outline-dark" class="menu" :class="{
                active: isShowStartMainLine || isShowStartStation,
                'error-border': errorShow.startStation.show,
              }" @click="toggleSelectArea('startMainLine')">
                出發車站<br />
                {{ selected.start.stationName }}
              </b-button>
              <error-msg :msg="errorShow.startStation.msg" v-if="errorShow.startStation.show"></error-msg>
              <div id="reverse-train-station-button" @click="swapSeletedStation()">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-left-right" fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M10.146 7.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L12.793 11l-2.647-2.646a.5.5 0 0 1 0-.708z" />
                  <path fill-rule="evenodd"
                    d="M2 11a.5.5 0 0 1 .5-.5H13a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 11zm3.854-9.354a.5.5 0 0 1 0 .708L3.207 5l2.647 2.646a.5.5 0 1 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z" />
                  <path fill-rule="evenodd" d="M2.5 5a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
              </div>
            </b-col>
            <!-- 抵達車站 -->
            <b-col cols="6" md="4" class="pl-4 mb-3">
              <b-button variant="outline-dark" class="menu" :class="{
                active: isShowEndMainLine || isShowEndStation,
                'error-border': errorShow.endStation.show,
              }" @click="toggleSelectArea('endMainLine')">
                抵達車站<br />
                {{ selected.end.stationName }}
              </b-button>
              <error-msg :msg="errorShow.endStation.msg" v-if="errorShow.endStation.show"></error-msg>
            </b-col>
            <!-- 出發日期 -->
            <b-col cols="12" md="4" class="mb-3">
              <button class="btn btn-outline-dark menu" :class="{ 'error-border': errorShow.datetime.show }"
                @click="toggleSelectArea('datetimePicker')">
                出發日期<br />
                {{ $commonService.processDate(selected.datetime) }}
                {{ $commonService.processTime(selected.datetime) }}
              </button>
              <error-msg :msg="errorShow.datetime.msg" v-if="errorShow.datetime.show"></error-msg>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <!-- 參數調整區域 -->
      <b-container class="mb-2 bv-example-row" id="param-adjustment-area">
        <b-form-input v-model="queryInput" @update="filterStations()" :placeholder="queryInputPlaceHoder" class="mb-3"
          @keyup.enter="setStation()" ref="queryInputRef" v-show="isShowStartMainLine ||
            isShowStartStation ||
            isShowEndMainLine ||
            isShowEndStation
            "></b-form-input>
        <b-row v-if="isShowStartMainLine">
          <b-col cols="6" md="4" lg="3" class="mb-3" v-for="(mainLine, $index) in mainLines" :key="$index">
            <b-button variant="secondary" class="w100" @click="selectStartMainLine(mainLine)">
              {{ mainLine }}
            </b-button>
          </b-col>
        </b-row>
        <b-row v-if="isShowStartStation">
          <b-col cols="6" md="4" lg="3" class="mb-3" v-for="(filterTraStartStation, $index) in filterTraStartStations"
            :key="$index">
            <b-button variant="secondary" :value="filterTraStartStation.StationID" class="w100" :class="{
              'high-level-station':
                filterTraStartStation.StationClass === '0' ||
                filterTraStartStation.StationClass === '1',
            }" @click="
  selectStartStation(
    filterTraStartStation.StationID,
    filterTraStartStation.StationName.Zh_tw
  )
  ">
              {{
                filterTraStartStation.StationClass === "0" ||
                filterTraStartStation.StationClass === "1"
                ? "＊"
                : ""
              }}
              {{ filterTraStartStation.StationName.Zh_tw }}
            </b-button>
          </b-col>
        </b-row>
        <b-row v-if="isShowEndMainLine">
          <b-col cols="6" md="4" lg="3" class="mb-3" v-for="(mainLine, $index) in mainLines" :key="$index">
            <b-button variant="secondary" class="w100" @click="selectEndMainLine(mainLine)">{{ mainLine }}</b-button>
          </b-col>
        </b-row>
        <b-row v-if="isShowEndStation">
          <b-col cols="6" md="4" lg="3" class="mb-3" v-for="(filterTraEndStation, $index) in filterTraEndStations"
            :key="$index">
            <b-button variant="secondary" :value="filterTraEndStation.StationID" class="w100" :class="{
              'high-level-station':
                filterTraEndStation.StationClass === '0' ||
                filterTraEndStation.StationClass === '1',
            }" @click="
  selectEndStation(
    filterTraEndStation.StationID,
    filterTraEndStation.StationName.Zh_tw
  )
  ">
              {{
                filterTraEndStation.StationClass === "0" ||
                filterTraEndStation.StationClass === "1"
                ? "＊"
                : ""
              }}
              {{ filterTraEndStation.StationName.Zh_tw }}
            </b-button>
          </b-col>
        </b-row>
        <b-row class="justify-content-center mb-4" v-if="isShowDatetime">
          <date-picker mode="datetime" color="blue" :min-date="$commonService.getNowDate()"
            :max-date="$commonService.getMaxDate()" v-model="selected.datetime"></date-picker>
        </b-row>
      </b-container>
      <!-- 查詢按鈕 -->
      <div class="mb-4">
        <b-button variant="dark" @click="query()"> 查詢 </b-button>
      </div>
    </template>
    <keep-alive exclude="TrainTimeDetail" v-if="notReset">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { DatePicker } from "v-calendar";
import TraStations from "../assets/traStations";
import ErrorMsg from "./common/error-msg.vue";

export default {
  name: "SearchArea",
  components: {
    DatePicker,
    ErrorMsg
  },
  data() {
    return {
      myStorage: null,
      mainLines: [
        "基隆市",
        "新北市",
        "臺北市",
        "桃園市",
        "新竹縣",
        "新竹市",
        "苗栗縣",
        "臺中市",
        "彰化縣",
        "南投縣",
        "雲林縣",
        "嘉義縣",
        "嘉義市",
        "臺南市",
        "高雄市",
        "屏東縣",
        "臺東縣",
        "花蓮縣",
        "宜蘭縣"
      ],
      traStations: [],
      filterTraStartStations: [],
      filterTraEndStations: [],
      isShowStartMainLine: false,
      isShowStartStation: false,
      isShowEndMainLine: false,
      isShowEndStation: false,
      isShowDatetime: false,
      queryInput: "",
      selected: {
        start: {
          mainLine: null,
          stationId: null,
          stationName: null
        },
        end: {
          mainLine: null,
          stationId: null,
          stationName: null
        },
        datetime: new Date()
      },
      errorShow: {
        startStation: {
          show: false,
          msg: "請選擇出發車站"
        },
        endStation: {
          show: false,
          msg: "請選擇抵達車站"
        },
        datetime: {
          show: false,
          msg: "出發日期不能小於今天"
        }
      },
      notReset: true // 是否「非點選 title 重置回到 Home」
    };
  },
  mounted() {
    this.gettTraStation();
    this.myStorage = window.localStorage;
    this.setLocalStorage();
    this.setUrlStation();
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
      this.myStorage.setItem(
        "selectedStart",
        JSON.stringify(this.selected.start)
      );
      this.myStorage.setItem("selectedEnd", JSON.stringify(this.selected.end));
    },
    saveHistoryLocalStorage() {
      let historySelectedList = [];
      if (this.myStorage.historySelectedList) {
        historySelectedList = JSON.parse(this.myStorage.historySelectedList);

        if (historySelectedList.length > 5) {
          historySelectedList.shift();
          // historySelectedList = [];
        }
      }
      const nowSelected = [this.selected.start, this.selected.end];

      let isDuplicate = false;
      let duplicateIndex;
      if (historySelectedList.length > 0) {
        historySelectedList.forEach((historySelected, index) => {
          if (JSON.stringify(historySelected) === JSON.stringify(nowSelected)) {
            isDuplicate = true;
            duplicateIndex = index;
          }
        });
      }

      if (isDuplicate) {
        historySelectedList.splice(duplicateIndex, 1);
      }

      historySelectedList.push(nowSelected);
      this.myStorage.setItem(
        "historySelectedList",
        JSON.stringify(historySelectedList)
      );
    },

    /**
     * toggle from SearchHistory.
     */
    setHistoryToSelected(historySelected) {
      this.selected.start = JSON.parse(JSON.stringify(historySelected[0]));
      this.selected.end = JSON.parse(JSON.stringify(historySelected[1]));
    },

    toggleSelectArea(area) {
      this.queryInput = "";

      if (area === "startMainLine") {
        setTimeout(() => {
          this.$refs.queryInputRef.focus();
        }, 0);

        if (this.isShowStartMainLine) {
          this.isShowStartMainLine = false;
        } else {
          this.isShowStartMainLine = true;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatetime = false;
        }
      } else if (area === "endMainLine") {
        setTimeout(() => {
          this.$refs.queryInputRef.focus();
        }, 0);

        if (this.isShowEndMainLine) {
          this.isShowEndMainLine = false;
        } else {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = true;
          this.isShowEndStation = false;
          this.isShowDatetime = false;
        }
      } else if (area === "datetimePicker") {
        if (this.isShowDatetime) {
          this.isShowDatetime = false;
        } else {
          this.isShowStartMainLine = false;
          this.isShowStartStation = false;
          this.isShowEndMainLine = false;
          this.isShowEndStation = false;
          this.isShowDatetime = true;
        }
      } else if (area === "reset") {
        this.isShowStartMainLine = false;
        this.isShowStartStation = false;
        this.isShowEndMainLine = false;
        this.isShowEndStation = false;
        this.isShowDatetime = false;

        this.selected = {
          start: {
            mainLine: null,
            stationId: null,
            stationName: null
          },
          end: {
            mainLine: null,
            stationId: null,
            stationName: null
          },
          datetime: new Date()
        };
        this.notReset = false;

        this.$router
          .push({
            path: "/"
          })
          .catch(() => { });
      }
    },
    selectStartMainLine(mainLine) {
      this.isShowStartMainLine = false;
      this.isShowStartStation = true;

      this.selected.start.mainLine = mainLine;

      const filterTraStations = this.traStations.filter(
        traStation =>
          traStation.StationAddress.replace(/[0-9]/g, "").substr(0, 3) ===
          mainLine
      );
      this.filterTraStartStations = [];
      Object.assign(this.filterTraStartStations, filterTraStations);
    },
    selectStartStation(stationId, stationName) {
      this.isShowStartStation = false;

      this.selected.start.stationId = stationId;
      this.selected.start.stationName = stationName;

      this.errorShow.startStation.show = false;
    },
    selectEndMainLine(mainLine) {
      this.isShowEndMainLine = false;
      this.isShowEndStation = true;

      this.selected.end.mainLine = mainLine;

      const filterTraStations = this.traStations.filter(
        traStation =>
          traStation.StationAddress.replace(/[0-9]/g, "").substr(0, 3) ===
          mainLine
      );
      this.filterTraEndStations = [];
      Object.assign(this.filterTraEndStations, filterTraStations);
    },
    selectEndStation(stationId, stationName) {
      this.isShowEndStation = false;

      this.selected.end.stationId = stationId;
      this.selected.end.stationName = stationName;

      this.errorShow.endStation.show = false;
    },
    filterStations() {
      this.selected.start.mainLine = null;
      this.selected.end.mainLine = null;

      if (this.queryInput) {
        if (this.isShowStartMainLine || this.isShowStartStation) {
          this.isShowStartMainLine = false;
          this.isShowStartStation = true;

          const filterTraStations = this.traStations.filter(
            traStation =>
              traStation.StationName.Zh_tw.includes(this.queryInput) ||
              traStation.StationName.Zh_tw.replace("臺", "台").includes(
                this.queryInput
              )
          );
          this.filterTraStartStations = [];
          Object.assign(this.filterTraStartStations, filterTraStations);
        } else if (this.isShowEndMainLine || this.isShowEndStation) {
          this.isShowEndMainLine = false;
          this.isShowEndStation = true;

          const filterTraStations = this.traStations.filter(
            traStation =>
              traStation.StationName.Zh_tw.includes(this.queryInput) ||
              traStation.StationName.Zh_tw.replace("臺", "台").includes(
                this.queryInput
              )
          );
          this.filterTraEndStations = [];
          Object.assign(this.filterTraEndStations, filterTraStations);
        }
      } else {
        if (this.isShowStartMainLine || this.isShowStartStation) {
          this.isShowStartMainLine = true;
          this.isShowStartStation = false;
        } else if (this.isShowEndMainLine || this.isShowEndStation) {
          this.isShowEndMainLine = true;
          this.isShowEndStation = false;
        }
        this.filterTraStartStations = this.traStations;
        this.filterTraEndStations = this.traStations;
      }
    },
    setStation() {
      if (!this.queryInput) return;
      let selectedStation = null;
      let filterTraStations =
        this.isShowStartMainLine || this.isShowStartStation
          ? this.filterTraStartStations
          : this.filterTraEndStations;
      let selectStation =
        this.isShowStartMainLine || this.isShowStartStation
          ? this.selectStartStation
          : this.selectEndStation;

      if (filterTraStations.length <= 2) {
        if (filterTraStations.length === 2) {
          const highstation = filterTraStations.find(station =>
            ["0", "1"].includes(station.StationClass)
          );
          if (highstation) {
            selectedStation = highstation;
          }
        } else if (filterTraStations.length === 1) {
          selectedStation = filterTraStations[0];
        }

        if (selectedStation) {
          selectStation(
            selectedStation.StationID,
            selectedStation.StationName.Zh_tw
          );
        }
      }
    },
    swapSeletedStation() {
      let start = {},
        end = {};
      Object.assign(start, this.selected.start);
      Object.assign(end, this.selected.end);
      Object.assign(this.selected.start, end);
      Object.assign(this.selected.end, start);
    },
    setUrlStation() {
      if (this.$route.query.s) {
        this.selected.start.stationName = this.$route.query.s;
      }

      if (this.$route.query.e) {
        this.selected.end.stationName = this.$route.query.e;
      }
    },
    isPastDate(date) {
      return (
        date < this.$commonService.getYesterday() ||
        date > this.$commonService.getTwoMonthsLater()
      );
    },
    checkRequired(complete) {
      this.errorShow.startStation.show = false;
      this.errorShow.endStation.show = false;

      if (!this.selected.start.stationId || !this.selected.end.stationId) {
        if (!this.selected.start.stationId && !this.selected.end.stationId) {
          this.errorShow.startStation.show = true;
          this.errorShow.endStation.show = true;
        } else if (!this.selected.start.stationId) {
          this.errorShow.startStation.show = true;
        } else if (!this.selected.end.stationId) {
          this.errorShow.endStation.show = true;
        }
      } else {
        complete();
      }
    },
    checkDateNotInPast(date, complete) {
      this.errorShow.datetime.show = false;

      const selectedDate = new Date(date);
      // 如果選擇的日期是過去
      if (
        new Date(selectedDate.toDateString()) <
        new Date(new Date().toDateString())
      ) {
        this.errorShow.datetime.show = true;
      } else {
        complete();
      }
    },
    simplifyTime(time) {
      return time.split(":")[0] + time.split(":")[1];
    },
    query() {
      this.checkRequired(() => {
        this.checkDateNotInPast(
          this.$commonService.processDate(this.selected.datetime),
          () => {
            this.isShowStartMainLine = false;
            this.isShowStartStation = false;
            this.isShowEndMainLine = false;
            this.isShowEndStation = false;
            this.isShowDatetime = false;

            this.saveLocalStorage();
            this.saveHistoryLocalStorage();

            this.notReset = true;

            this.$router
              .push({
                name: "SearchResult",
                query: {
                  s: this.selected.start.stationName,
                  e: this.selected.end.stationName,
                  d: this.$commonService.processDate(this.selected.datetime),
                  t: this.$commonService.processTime(this.selected.datetime)
                }
              })
              .catch(() => { });
          }
        );
      });
    }
  },
  computed: {
    queryInputPlaceHoder() {
      if (this.isShowStartMainLine || this.isShowStartStation) {
        return "出發車站（e.g. 新竹）";
      } else if (this.isShowEndMainLine || this.isShowEndStation) {
        return "抵達車站（e.g. 台北）";
      }

      return "";
    }
  }
};
</script>

<style scoped>
.menu {
  width: 100%;
  height: 60px;
}

.error-border {
  border-color: #dc3545;
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

.vdpComponent.vdpWithInput {
  display: inherit;
}

@media screen and (max-width: 768px) {
  #param-adjustment-area .btn-secondary:hover {
    background-color: #6c757d !important;
  }
}
</style>