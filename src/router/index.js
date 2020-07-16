import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import NotFound  from '@/views/404'
import Main  from '@/views/Main'
import api from '@/http/api'
import store from '@/store'
import { isURL } from '@/utils/validate'
import {Menu} from "element-ui";

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home,
      children: [
        { path: '', component: Main, name: '系统介绍'},
      ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let userName = sessionStorage.getItem('user');
  if (to.path == '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if(userName  ) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
    if (!userName  ) {
      next({ path: '/login' })
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes(userName )
      next()
    }
  }
})

/**
 * 加载动态菜单和路由
 */
function addDynamicMenuAndRoutes(userName) {
  if (store.state.app.menuRouteLoaded){
  console.log('动态菜单和路由已经存在.')
  return
  }
  api.menu.findNavTree({'userName':userName})
    .then( res => {
      // 添加动态路由
      let dynamicRoutes = addDynamicRoutes(res.data)
      router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
      router.addRoutes(router.options.routes);
      // 保存加载状态
      store.commit('menuRouteLoaded',true)
      // 保存菜单树
      store.commit('setMenuTree',res.data)
    }).then(res => {
    let userName = "admin"
    api.user.findPermissions({'name':userName}).then(res => {
      // 保存用户权限标识集合
      store.commit('setPerms', res.data)
    })
  })
    .catch(function(res) {
      alert(res);
    });
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function addDynamicRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = menuList[i].url
        route['name'] = menuList[i].name
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
          // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
          let array = menuList[i].url.split('/')
          let url = array[0].substring(0,1).toUpperCase()+array[0].substring(1) + '/' + array[1].substring(0,1).toUpperCase()+array[1]  .substring(1)
          route['component'] = resolve => require([`@/views/${url}`], resolve)
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
    console.log(routes)
  }
  return routes
}

export default router

