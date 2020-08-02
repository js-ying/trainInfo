<template>
  <div id="train-time-detail">
    <b-container
      class="mb-3 bv-example-row"
    >
      <!-- 詳細資訊 -->
      <div v-if="Object.getOwnPropertyNames(this.$route.params).length > 0">
        {{ this.$route.params }}
      </div>
      <!-- 資訊遺失（refresh） -->
      <div v-else>
        <b-row>
          <b-col
            cols="12"
            class="mb-3"
          >
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
      
    };
  },
  mounted() {
    console.log('mounted:', this.$route.params);
  },
  methods: {
  }
}
</script>