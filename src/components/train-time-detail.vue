<template>
  <div id="train-time-detail">
    <b-container class="mb-3 bv-example-row">
      <!-- 返回按鈕 -->
      <b-row>
        <b-col class="text-left mb-3">
          <button type="button" class="btn btn-secondary btn-sm" @click="goBack()">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-return-left" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M5.854 5.646a.5.5 0 0 1 0 .708L3.207 9l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z" />
              <path fill-rule="evenodd"
                d="M13.5 2.5a.5.5 0 0 1 .5.5v4a2.5 2.5 0 0 1-2.5 2.5H3a.5.5 0 0 1 0-1h8.5A1.5 1.5 0 0 0 13 7V3a.5.5 0 0 1 .5-.5z" />
            </svg>
            返回結果列表
          </button>
        </b-col>
      </b-row>
      <!-- 詳細資訊 -->
      <div v-if="clickedTrainTimeDetail && Object.getOwnPropertyNames(clickedTrainTimeDetail).length > 0">
        <b-row class="mb-4 d-flex justify-content-center">
          <b-col cols="12" id="train-name">
            {{ clickedTrainTimeDetail.TrainInfo.TrainNo }} {{
              $commonService.getTrainNameByTrainTypeCode(clickedTrainTimeDetail.TrainInfo.TrainTypeCode) }}
          </b-col>
          <b-col cols="12" id="train-note">
            {{ clickedTrainTimeDetail.TrainInfo.Note }}
          </b-col>
        </b-row>

        <b-row align-v="center" class="text-center mb-3">
          <b-col cols="4">
            <b-badge pill variant="primary" class="t100">站名</b-badge>
          </b-col>
          <b-col cols="4">
            <b-badge pill variant="primary" class="t100">
              到站時間
            </b-badge>
          </b-col>
          <b-col cols="4">
            <b-badge pill variant="primary" class="t100">
              離站時間
            </b-badge>
          </b-col>
        </b-row>
        <template v-if="clickedTrainTimeDetail && clickedTrainTimeDetail.StopTimes">
          <b-row align-v="center" class="text-center mb-2" v-for="(stopTime, $index) in clickedTrainTimeDetail.StopTimes"
            :key="$index">
            <b-col cols="4">{{ stopTime.StationName.Zh_tw }}</b-col>
            <b-col cols="4">{{ stopTime.ArrivalTime }}</b-col>
            <b-col cols="4">{{ stopTime.DepartureTime }}</b-col>
          </b-row>
        </template>
      </div>
      <!-- 資訊遺失（refresh） -->
      <div v-if="dataLose">
        <b-row>
          <b-col cols="12" class="mb-3">
            <b-alert variant="warning" show>
              請重新查詢。
            </b-alert>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'TrainTimeDetail',
  components: {
  },
  data() {
    return {
      clickedTrainTimeDetail: null,
      dataLose: false,
    };
  },
  mounted() {
    if (Object.getOwnPropertyNames(this.$route.params).length > 0) {
      this.clickedTrainTimeDetail = this.$route.params.trainTime;
    } else {
      this.dataLose = true;
    }

    window.scrollTo(0, 0);
  },
  methods: {
    goBack() {
      window.history.back();
    },
  },
}
</script>

<style scoped>
#train-name {
  font-size: 1.2rem;
  font-weight: 700;
}

#train-note {
  color: gray;
  font-size: 0.9rem;
}
</style>