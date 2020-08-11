<template>
  <div id="about">
    <b-container class="bv-example-row mb-3">
        <b-row class="justify-content-md-center">
          <b-col cols="12">
            <h5
              id="web-title"
              class="mb-4"
              @click="goHome()">
              台鐵時刻查詢
            </h5>
          </b-col>
          <b-col
            cols="12"
            md="6"
            class="mt-4 text-left">

            <p>
              作者：JS Ying<br />
              個人網站：<a
                href="https://jsy.tw"
                target="_blanl"
              >https://jsy.tw</a>
            </p>
            <p class="pt-4">
              別問我為什麼要做大家都做過的東西，因為我就想。<br />
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
                ></b-icon>發行日：2020-04-13，最後更新：2020-08
              </div>
            </div>

          </b-col>
        </b-row>
      </b-container>
  </div>
</template>

<script>
export default {
  name: 'about',
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
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' }).catch(() => { });
    }
  }
};
</script>

<style scoped>
.footer {
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 3rem;
}
</style>