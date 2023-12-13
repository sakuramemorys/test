<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-23 18:12:22
 * @LastEditors: Your Name
 * @LastEditTime: 2022-07-04 10:37:42
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { verifyAuth } from "@/api/login";

export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      timer: undefined,
    };
  },
  computed: {
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    },
  },
  watch: {
    sideTheme(val) {
      //监听主题变化
      this.toggleClass(
        //动态修改根节点class
        document.body,
        "custom-" + (val === "theme-dark" ? "dark" : "light")
      );
    },
  },
  created() {
    if (
      localStorage.getItem("energyStore") != "null" &&
      localStorage.getItem("energyStore")
    ) {
      this.$store.state.energy = JSON.parse(
        localStorage.getItem("energyStore")
      );
    }
    if (
      localStorage.getItem("energyWs") != "null" &&
      localStorage.getItem("energyWs")
    ) {
      this.$store.state.websocket = JSON.parse(
        localStorage.getItem("energyWs")
      );
    }
    this.$store.state.energy.dataCalibrate = { isCalibrate: false, obid: "" };
    this.$store.state.app.innerWidth = window.innerWidth

    window.addEventListener("beforeunload", () => {
      localStorage.setItem(
        "energyStore",
        JSON.stringify(this.$store.state.energy)
      );
      localStorage.setItem(
        "energyWs",
        JSON.stringify(this.$store.state.websocket)
      );
    });
  },
  mounted() {
    // if (window.location.origin.includes('localhost') > -1) {
    //   let fspTheme = localStorage.getItem("bodyClass");
    //   this.$store.state.settings.sideTheme = fspTheme === "custom-light" ? "theme-light" : "theme-dark";
    // }
    if (window.location.pathname != "/energy/authorization") this.verifyAuth();
    let fspTheme = localStorage.getItem("fspTheme");

    // 启用暗色主题，用于调试
    // fspTheme = 'custom-dark'

    fspTheme ? this.changeThem(fspTheme === "custom-light" ? "theme-light" : "theme-dark") : this.toggleClass(document.body, "custom-" + (this.sideTheme === "theme-dark" ? "dark" : "light"));

    window.addEventListener("message", (e) => {
      // 过滤非法theme数据
      if (['theme-light', 'theme-dark'].includes(e.data)) {
        this.changeThem(e.data);
      }
    });
    this.timer = setInterval(() => {
      this.verifyAuth();
    }, 60 * 60 * 1000);
    this.$store.dispatch("webSocketInit");
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.localStorage.removeItem("utoken");
    this.$store.dispatch("webSocketClose");
  },
  methods: {
    changeThem(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "sideTheme",
        value: val,
      });
    },
    logout() {
      if (window.location.pathname != "/energy/authorization")
        this.$store.dispatch("LogOut").then(() => {
          window.top.location.href =
            window.location.origin + "/energy/authorization";
        });
    },
    toggleClass(element, className) {
      if (!element || !className) {
        return;
      }
      element.className = className;
      this.$store.commit("SET_THEME", className);
    },
    verifyAuth() {
      verifyAuth()
        .then((res) => {
          if (res.data) {
            let date1 = Date.parse(res.data.endTime),
              date2 = Date.parse(res.data.currentTime),
              time = res.data.currentTime.split(" ")[1].split(":")[0],
              interval = Math.ceil(
                Math.abs(date1 - date2) / (24 * 3600 * 1000)
              );
            if (!(self.frameElement && self.frameElement.tagName == "IFRAME")) {
              if (date1 - date2 <= 0) {
                this.$message.error("授权已过期，请重新授权！");
                this.logout();
              } else if (interval <= 30) {
                this.$alert("授权将于" + interval + "天后过期，请及时处理！", {
                  confirmButtonText: "知道了",
                  type: "warning",
                });
              } else if (interval <= 10 && time == "10") {
                this.$alert("授权将于" + interval + "天后过期，请及时处理！", {
                  confirmButtonText: "知道了",
                  type: "warning",
                });
              }
            }
          }
        })
        .catch(() => {
          this.logout();
        });
    },
  },
};
</script>
<style>
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll !important;
}
#app {
  min-width: 1140px;
  /* min-height: 625px; */
  min-height: 520px;
}
</style>
