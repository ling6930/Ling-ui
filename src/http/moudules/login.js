import axios from '../axios'

/*
 * 系统登录模块
 */

// 单独导出
export const login = data => {
  return axios({
    url: '/sys/login',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 登出
export const logout = () => {
  return axios({
    url: '/logout',
    method: 'get'
  })
}
