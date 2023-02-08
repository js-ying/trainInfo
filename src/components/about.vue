<template>
  <div id="about">
    <b-container class="bv-example-row mb-3">
      <b-row class="justify-content-md-center">
        <b-col cols="12">
          <h5 id="web-title" @click="goHome()">
            台鐵時刻查詢
            <br />
            <small>Ver.3</small>
          </h5>
        </b-col>
        <b-col cols="12" md="6" class="mt-4 text-left">
          <p>
            作者：JS Ying<br />
            個人網站：<a href="https://jsy.tw" target="_blanl"
              >https://jsy.tw</a
            >
          </p>

          <p class="mt-4">
            <u>Ver.4 版本更新資訊 (2023-02)</u><br />
            1. 新增 文字快速篩選車站功能<br />
            2. 修正 列車詳細資訊被快取的問題<br />
            3. 修正 使用 URL 帶入查詢結果時，上方車站為空白的問題
          </p>

          <p class="mt-4">
            <u>Ver.3 版本更新資訊 (2021-11)</u><br />
            1. 更新 日期選擇方式<br />
            2. 新增 列車誤點資訊<br />
            3. 新增 當日過期火車特效
          </p>

          <p class="mt-4">
            <u>Ver.2 版本更新資訊 (2020-08)</u><br />
            1. 更新 出發日期選擇方式<br />
            2. 新增 首頁歷史查詢記錄功能<br />
            3. 移除 所有彈跳視窗<br />
            4. 更新 起迄站互換功能位置<br />
            5. 部落格介紹
            <a href="https://jsy.tw/blog/1525/" target="_blank"
              >【作品】台鐵時刻查詢——查詢火車時刻，簡單又快速。</a
            >
          </p>

          <p class="mt-4">
            <u>Ver.1 版本特色 (2020-04)</u><br />
            1. 選擇車站只要用點的就行<br />
            2. 查詢結果可透過按鈕篩選「對號列車」或「非對號列車」<br />
            3.
            每一結果會簡單呈現車次、車種、起迄站、時間範圍與列車服務（哺乳室、身障旅客專用車、訂便當服務、人車同行……）<br />
            4. 點擊任一結果可看到更詳細的列車資訊<br />
            5. 每次重新進入首頁，系統會自動帶入最後一次查詢車站
          </p>

          <p class="pt-4">
            手機使用者可以把這個網頁變成 APP 放在桌面上。<a
              href="https://jsy.tw/blog/1370/"
              target="_blank"
              >查看更多</a
            >
          </p>

          <div class="footer">
            <div id="icon-source">
              <b-icon icon="link45deg" variant="secondary" class="mr-2"></b-icon
              >素材來源：<a
                :href="iconSource.link"
                target="_blank"
                v-for="(iconSource, $index) in iconSources"
                :key="$index"
              >
                <img
                  class="mr-1"
                  width="15px"
                  :src="
                    require('../assets/images/' + iconSource.imgName + '.png')
                  "
                />
              </a>
            </div>
            <div id="time">
              <b-icon
                icon="exclamation-circle-fill"
                variant="secondary"
                class="mr-2"
              ></b-icon
              >發行日：2020-04-13，最後更新：2023-02
            </div>
          </div>
        </b-col>
        <b-col cols="12" class="mt-5">
          <!-- 返回按鈕 -->
          <button
            type="button"
            class="btn btn-secondary btn-sm mt-3 mb-4"
            @click="goBack()"
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              class="bi bi-arrow-return-left"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.854 5.646a.5.5 0 0 1 0 .708L3.207 9l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
              />
              <path
                fill-rule="evenodd"
                d="M13.5 2.5a.5.5 0 0 1 .5.5v4a2.5 2.5 0 0 1-2.5 2.5H3a.5.5 0 0 1 0-1h8.5A1.5 1.5 0 0 0 13 7V3a.5.5 0 0 1 .5-.5z"
              />
            </svg>
            返回
          </button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      iconSources: [
        {
          link:
            "https://www.flaticon.com/free-icon/train_565410?term=train&page=1&position=9",
          author: "Google",
          imgName: "logo"
        },
        {
          link:
            "https://www.flaticon.com/free-icon/disability_414221?term=disabled&page=1&position=26",
          author: "Freepik",
          imgName: "disability"
        },
        {
          link:
            "https://www.flaticon.com/free-icon/breastfeeding_1320921?term=breastfeeding&page=1&position=49",
          author: "Freepik",
          imgName: "breast-feeding"
        },
        {
          link:
            "https://www.flaticon.com/free-icon/bike_2636494?term=bike&page=1&position=63",
          author: "Freepik",
          imgName: "bicycle"
        }
      ]
    };
  },
  computed: {},
  methods: {
    goHome() {
      this.$router.push({ name: "Home" }).catch(() => {});
    },
    goBack() {
      window.history.back();
    }
  }
};
</script>

<style scoped>
.footer {
  font-size: 0.85em;
  color: #6c757d;
  margin-top: 2.5rem;
}
</style>