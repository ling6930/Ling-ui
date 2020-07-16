import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);

import app from "./modules/Application.js";
import tab from './modules/tab'
import Menu from './modules/Menu.js';
import user from './modules/user.js';

const store = new vuex.Store({
  modules:{
    app: app,
    tab: tab,
    // 其他
    menu: Menu,
    user: user,
  }
})

export default store
