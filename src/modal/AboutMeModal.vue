<template>
  <div id="about-me-modal">
    <b-modal
      title="關於台鐵時刻查詢"
      v-model="isShowAboutMeModal"
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
      <p>
        手機使用者可以把這個網頁變成 APP 放在桌面上唷。<a
          href="https://jsy.tw/blog/1370/"
          target="_blank"
        >查看更多</a>
      </p>
      <div class="footer">
        <div id="icon-source">
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
              class="mr-1"
              width="15px"
              :src="require('../assets/images/' + iconSource.imgName + '.png')"
            >
          </a>
        </div>
        <div id="time">
          <b-icon
            icon="exclamation-circle-fill"
            variant="secondary"
            class="mr-2"
          ></b-icon>發行日：2020-04-13，最後更新：
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'about-me-modal',
  props: ['callShow'],
  data() {
    return {
      iconSources: [
        {
          link:
            'https://www.flaticon.com/free-icon/train_565410?term=train&page=1&position=9',
          author: 'Google',
          imgName: 'logo'
        },
        {
          link:
            'https://www.flaticon.com/free-icon/disability_414221?term=disabled&page=1&position=26',
          author: 'Freepik',
          imgName: 'disability'
        },
        {
          link:
            'https://www.flaticon.com/free-icon/breastfeeding_1320921?term=breastfeeding&page=1&position=49',
          author: 'Freepik',
          imgName: 'breast-feeding'
        },
        {
          link:
            'https://www.flaticon.com/free-icon/bike_2636494?term=bike&page=1&position=63',
          author: 'Freepik',
          imgName: 'bicycle'
        }
      ],
    };
  },
  computed: {
    isShowAboutMeModal: {
      get() {
        return this.callShow;
      },
      set() {
        this.$emit('callHide');
        return this.callShow;
      }
    }
  },
  methods: {
  }
};
</script>

<style scoped>
.footer {
  font-size: 0.85em;
  color: #6c757d;
}
</style>