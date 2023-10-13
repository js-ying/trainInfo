<template>
  <div class="ad-banner">
    <div class="g-a-d-s">
      <ins class="adsbygoogle" style="display:block; width: 100%; height: 100%" data-ad-client="ca-pub-7992139989807299"
        data-ad-slot="1622239321"></ins>
    </div>
    <div class="g-a-d-s-note">
      台鐵資料即將收費，以廣告減少部份負擔，請見諒。<br />
      您的順手點擊廣告，可給予網站作者一臂之力，繼續提供優質的使用體驗給大家。
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdBanner',
  components: {
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style scoped>
.g-a-d-s {
  border: 1px solid #343a40;
  border-radius: 0.25rem;
  /* height: 108px; */
  height: 298px;
  padding: 0.5rem;
}

@media screen and (max-width: 768px) {
  .g-a-d-s {
    /* height: 68px; */
    height: 298px;
  }
}

.g-a-d-s-note {
  color: gray;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  text-align: justify;
}
</style>