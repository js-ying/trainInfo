<template>
  <div id="train-time-table">
    <!-- 查詢結果 -->
    <b-container class="mb-3 bv-example-row" v-if="dailyTrainTimetable">
      <div class="d-flex justify-content-between">
        <!-- 車種篩選按鈕群組 -->
        <b-button-group size="sm" class="mb-3" id="train-Type-filter-btns">
          <b-button
            v-for="trainTypeFilterBtn in trainTypeFilterBtns"
            :key="trainTypeFilterBtn.value"
            :class="{ active: trainTypeFilterBtn.actived }"
            @click="filterTrainType(trainTypeFilterBtn.value)"
          >
            {{ trainTypeFilterBtn.name }}
          </b-button>
        </b-button-group>
        <!-- 查詢結果頁數 -->
        <div id="result-number">
          {{
            filterTrainTimetables.length +
            " 筆 / " +
            dailyTrainTimetable.TrainTimetables.length +
            " 筆"
          }}
        </div>
      </div>
      <!-- 列車資訊 -->
      <div v-if="dailyTrainTimetable.TrainTimetables.length > 0">
        <b-row>
          <b-col
            cols="12"
            class="mb-3"
            v-for="(filterTrainTimetable, $index) in filterTrainTimetables"
            :key="$index"
          >
            <div
              class="train-time-col bv-example-row-flex-cols p-2"
              :class="{ 'train-is-pass': isTrainPass(filterTrainTimetable) }"
              @click="showTrainTimeDetail(filterTrainTimetable)"
            >
              <b-row align-v="center">
                <b-col cols="3">
                  <div class="train-time-left-side">
                    {{ filterTrainTimetable.TrainInfo.TrainNo }}
                    {{
                      transformTripLineToName(
                        filterTrainTimetable.TrainInfo.TripLine
                      )
                    }}
                  </div>
                  <div class="mb-1">
                    <b-badge
                      :variant="
                        getTrainTypeVariant(
                          filterTrainTimetable.TrainInfo.TrainTypeCode
                        )
                      "
                      >{{
                        $commonService.transformTrainTypeCodeToName(
                          filterTrainTimetable.TrainInfo.TrainTypeCode
                        )
                      }}</b-badge
                    >
                  </div>
                  <div class="train-time-left-side">
                    {{
                      filterTrainTimetable.TrainInfo.StartingStationName.Zh_tw
                    }}-{{
                      filterTrainTimetable.TrainInfo.EndingStationName.Zh_tw
                    }}
                  </div>
                </b-col>
                <b-col cols="6">
                  <template
                    v-if="
                      filterTrainTimetable.delayInfo &&
                      filterTrainTimetable.delayInfo.length > 0
                    "
                  >
                    <div
                      style="color: #198754"
                      v-if="filterTrainTimetable.delayInfo[0].DelayTime === 0"
                    >
                      準點
                    </div>
                    <div
                      style="color: #dc3545"
                      v-if="filterTrainTimetable.delayInfo[0].DelayTime > 0"
                    >
                      延誤
                      {{ filterTrainTimetable.delayInfo[0].DelayTime }} 分鐘
                    </div>
                  </template>
                  {{ filterTrainTimetable.StopTimes[0].DepartureTime }} -
                  {{
                    filterTrainTimetable.StopTimes[
                      filterTrainTimetable.StopTimes.length - 1
                    ].ArrivalTime
                  }}
                  <div class="train-time-diff">
                    {{
                      getTimeDiff(
                        filterTrainTimetable.StopTimes[0].DepartureTime,
                        filterTrainTimetable.StopTimes[
                          filterTrainTimetable.StopTimes.length - 1
                        ].ArrivalTime
                      )
                    }}
                  </div>
                </b-col>
                <b-col cols="3">
                  <div v-if="filterTrainTimetable.fareList">
                    <span v-for="(fare, $index) in filterTrainTimetable.fareList" :key="$index">
                      <!-- <b-badge variant="secondary">
                        {{ $commonService.getFareClassName(fare.FareClass) }}
                      </b-badge> -->
                      <div class="price">
                        <span
                          v-b-tooltip.hover
                          title="全票票價"
                          :disabled="isTooltipShow()"
                        >
                          {{ fare.Price }} 元
                        </span>
                      </div>
                    </span>
                  </div>                
                </b-col>
                <div class="train-service" v-if="trainServices">
                  <span
                    v-for="(trainService, $index) in trainServices"
                    :key="$index"
                  >
                    <img
                      :src="
                        require('../assets/images/' +
                          trainService.imgName +
                          '.png')
                      "
                      class="train-service-icon"
                      v-b-tooltip.hover
                      :title="trainService.description"
                      :disabled="isTooltipShow()"
                      v-if="
                        filterTrainTimetable.TrainInfo[trainService.flagName]
                      "
                    />
                  </span>
                </div>  
              </b-row>              
            </div>
            <div
              class="train-note"
              :class="{ 'train-is-pass': isTrainPass(filterTrainTimetable) }"
            >
              {{ filterTrainTimetable.TrainInfo.Note }}
            </div>
          </b-col>
        </b-row>
      </div>
      <!-- 查無火車 -->
      <div v-else>
        <b-row>
          <b-col cols="12" class="mb-3">
            <b-alert variant="warning" class="text-left" show>
              沒有找到台鐵車次！有以下兩種可能：
              <ol class="mt-2 mb-0">
                <li>出發時間設定太晚，已無班次。</li>
                <li>起迄車站設定錯誤。</li>
              </ol>
            </b-alert>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import { TripLines, TrainTypes } from "../assets/constants";

export default {
  name: "TrainTimeTable",
  props: ["dailyTrainTimetable", "date"],
  components: {},
  data() {
    return {
      trainTypeFilterBtns: [
        {
          actived: true,
          name: "全部",
          value: "all"
        },
        {
          actived: false,
          name: "對號列車",
          value: "express"
        },
        {
          actived: false,
          name: "非對號列車",
          value: "non-express"
        }
      ],
      filterTrainTypesRegExp: "",
      trainServices: [
        {
          imgName: "disability",
          flagName: "WheelChairFlag",
          description: "身障旅客專用座位車"
        },
        {
          imgName: "suitcase",
          flagName: "PackageServiceFlag",
          description: "行李服務"
        },
        {
          imgName: "lunch",
          flagName: "DiningFlag",
          description: "訂便當服務"
        },
        {
          imgName: "breast-feeding",
          flagName: "BreastFeedFlag",
          description: "哺(集)乳室車廂"
        },
        {
          imgName: "bicycle",
          flagName: "BikeFlag",
          description: "人車同行"
        },
        {
          imgName: "car",
          flagName: "CarFlag",
          description: "小汽車上火車"
        },
        {
          imgName: "train",
          flagName: "ExtraTrainFlag",
          description: "為加班車"
        }
      ]
    };
  },
  mounted() {},
  computed: {
    filterTrainTimetables() {
      return this.dailyTrainTimetable.TrainTimetables.filter(trainTimetable =>
        trainTimetable.TrainInfo.TrainTypeCode.match(
          new RegExp(this.filterTrainTypesRegExp)
        )
      );
    }
  },
  methods: {
    isTrainPass(trainTime) {
      // 若查詢日期與當下日期相同
      if (this.date === this.$commonService.processDate(new Date())) {
        const trainDatetime = new Date(
          `${this.date.replace(/-/g, "/")} ${
            trainTime.StopTimes[0].DepartureTime
          }`
        );
        const nowDatetime = new Date();
        // 若火車時間小於當下時間則代表火車已過時
        if (trainDatetime < nowDatetime) {
          return true;
        }
      }

      return false;
    },
    getTrainTypeVariant(trainTypeCode) {
      const trainTypeVariantMap = {};

      for (const trainType in TrainTypes) {
        trainTypeVariantMap[TrainTypes[trainType].value] =
          TrainTypes[trainType].labelColorClass;
      }

      return trainTypeVariantMap[trainTypeCode];
    },
    transformTripLineToName(tripLine) {
      const tripLineMap = {};

      for (const tripLine in TripLines) {
        tripLineMap[TripLines[tripLine].value] = TripLines[tripLine].name;
      }

      return tripLineMap[tripLine];
    },
    getTimeDiff(startTime, endTime) {
      let endDateTime = this.date;
      if (endTime < startTime) {
        let date = new Date(this.date);
        endDateTime = new Date(date.setDate(date.getDate() + 1));
        endDateTime = new Date(
          endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000
        )
          .toISOString()
          .substring(0, 10);
      }

      let date1 = new Date(this.date + "T" + startTime); // 開始時間
      let date2 = new Date(endDateTime + "T" + endTime); // 結束時間
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

      return hours + " 時 " + minutes + " 分";
    },
    isTooltipShow() {
      if (window.innerWidth < 768) {
        return true;
      }
      return false;
    },
    filterTrainType(value) {
      this.filterTrainTypesRegExp = "";

      // 1. 控制按鈕 actived 狀態
      this.trainTypeFilterBtns.forEach(trainTypeFilterBtn => {
        if (trainTypeFilterBtn.value === value) {
          trainTypeFilterBtn.actived = true;
        } else {
          trainTypeFilterBtn.actived = false;
        }
      });

      // 2. 製作篩選車種的正規表達式
      if (value === "all") {
        this.filterTrainTypesRegExp = "";
      } else if (value === "express") {
        this.filterTrainTypesRegExp = `^${TrainTypes.TAROKO.value}$|^${TrainTypes.PUYUMA.value}$|^${TrainTypes.TZE_CHIANG.value}$|^${TrainTypes.CHU_KUANG.value}$|^${TrainTypes.FU_HSING.value}$|^${TrainTypes.TZE_CHIANG_3000.value}`;
      } else {
        this.filterTrainTypesRegExp = `^${TrainTypes.LOCAL.value}$|^${TrainTypes.ORDINARY.value}$|^${TrainTypes.FAST_LOCAL.value}$`;
      }
    },
    showTrainTimeDetail(trainTime) {
      this.$router
        .push({
          name: "TrainTimeDetail",
          params: {
            trainTime: trainTime
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
#result-number {
  font-size: 85%;
  padding-top: 5px;
}

.train-is-pass {
  opacity: 0.5;
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

.price {
  font-size: 85%;
}

.train-service {
  position: absolute;
  right: 1.5rem;
  top: 0;
}

.train-service-icon {
  width: 13px;
  margin-left: 3px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}

.train-note {
  color: gray;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  text-align: justify;
}

@media screen and (max-width: 768px) {
  .train-time-left-side {
    font-size: 75%;
  }
}
</style>