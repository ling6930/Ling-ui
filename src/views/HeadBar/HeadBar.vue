<template>
  <div class="headbar" :style="{'background':themeColor}" :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 导航收缩 -->
    <span class="hamburg" :style="{'background':themeColor}">
      <Hamburger :onClick="onCollapse" :isActive="collapse"></Hamburger>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
            <el-menu :default-active="activeIndex" class="el-menu-demo" :style="{'background-color':themeColor}"
               text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar()">
        <el-menu-item index="1" @click="$router.push('/')">{{$t("common.home")}}</el-menu-item>
        <el-menu-item index="2">{{$t("common.doc")}}</el-menu-item>
        <el-menu-item index="3">{{$t("common.msgCenter")}}</el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </el-menu-item>
        <el-menu-item index="2" v-popover:popover-lang>
          <!-- 语言切换 -->
          <li style="color:#fff;" class="fa fa-language fa-lg"></li>
          <el-popover ref="popover-lang" placement="bottom-start" trigger="hover" v-model="langVisible">
            <div class="lang-item" @click="changeLanguage('zh_cn')">简体中文</div>
            <div class="lang-item" @click="changeLanguage('en_us')">English</div>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3">
          <!-- 用户信息 -->
          <el-dropdown class="user-info" trigger="hover" @command="handleCommand">
            <span class="el-dropdown-link"><img :src="this.userAvatar" />{{userName}}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="msg">{{$t("common.myMsg")}}</el-dropdown-item>
              <el-dropdown-item command="config">{{$t("common.config")}}</el-dropdown-item>
              <el-dropdown-item command="bakcup">{{$t("common.backupRestore")}}</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">{{$t("common.logout")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
    import { mapState } from 'vuex'
    import mock from "@/mock/index";
    import Hamburger from "@/components/Hamburger"
    import ThemePicker from "@/components/ThemePicker"
    import LangSelector from "@/components/LangSelector"
    import Action from "@/components/Toolbar/Action"
    export default {
        components:{
            Hamburger,
            ThemePicker,
            LangSelector,
            Action
        },
        data() {
            return {
                userName: "Admin",
                userAvatar: "",
                activeIndex: '1',
                langVisible: false
            };
        },
        methods: {
            selectNavBar(key, keyPath) {
                console.log(key, keyPath)
            },
            //折叠导航栏
            onCollapse: function() {
                this.$store.commit('onCollapse');
            },
            //切换主题
            onThemeChange: function(themeColor, oldThemeColor){
            this.$store.dispatch('onThemeChange', {themeColor, oldThemeColor});
            },
            // 语言切换
            changeLanguage(lang) {
                lang === '' ? 'zh_cn' : lang
                this.$i18n.locale = lang
                this.langVisible = false
            },
            // 处理下拉选项
            handleCommand(command) {
                if('bakcup' === command) {
                    this.handleBackup()
                }
            },
            //退出登录
            logout: function() {
                var _this = this;
                this.$confirm("确认退出吗?", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        sessionStorage.removeItem("user");
                        this.$router.push
                        ("/login");
                    })
                    .catch(() => {});
            }
        },
        computed:{
            ...mapState({
                themeColor: state=>state.app.themeColor,
                collapse: state=>state.app.collapse
            })
        }
    };
</script>

<style scoped lang="scss">
  .headbar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1030;
    height: 60px;
    line-height: 60px;
    border-color: rgba(180, 190, 190, 0.8);
    border-left-width: 1px;
    border-left-style: solid;
  }
  .hamburg, .navbar {
    float: left;
  }
  .toolbar {
    float: right;
  }
  .lang-item {
    font-size: 16px;
    padding-left: 8px;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: pointer;
  }
  .lang-item:hover {
    font-size: 18px;
    background: #b0d6ce4d;
  }
  .user-info {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin: 10px 0px 10px 10px;
      float: right;
    }
  }
  .badge {
    line-height: 18px;
  }
  .position-left {
    left: 200px;
  }
  .position-collapse-left {
    left: 65px;
  }
</style>
