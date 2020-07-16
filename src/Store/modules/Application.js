export default {
  state: {
    appName: "Ling",  // 应用名称
    themeColor: "#14889A",
    oldThemeColor: "#14889A",
    collapse:false,  // 导航栏收缩状态
    menuRouteLoaded: false
  },
  getters: {
    collapse(state){// 对应着上面state
      return collapse;
    }
  },
  mutations: {
    onCollapse(state){  // 改变收缩状态
      state.collapse = !state.collapse;
    },
    themeColor(state, themeColor){
      state.themeColor = themeColor;
    },
    oldThemeColor(state, oldThemeColor){
      state.oldThemeColor = oldThemeColor;
    },
    menuRouteLoaded(state, menuRouteLoaded){
      state.menuRouteLoaded = menuRouteLoaded;
    }
  },
  actions: {
    onThemeChange ({ commit, state }, data){
         commit('themeColor',data.themeColor)
         commit('oldThemeColor',data.oldThemeColor)
    }
  }
}
