import { uniStorage } from './uni-storage'

// 页面白名单，不受拦截
const whiteList = [
  '/',
  '/pages/login/login',
  '/pages/privacy/privacy',
  '/pages/userService/userService',
  '/pages/evaluation/evaluation'
]
// 所有路由
const allRoutes = [
  '/',
  '/pages/login/login',
  '/pages/registrationForm/registrationForm',
  '/pages/experience/experience',
  '/pages/inspect/inspect',
  '/pages/draw/draw',
  '/pages/login/authCode',
  '/pages/finish/finish',
  '/pages/privacy/privacy',
  '/pages/userService/userService',
  '/pages/evaluation/evaluation'
]

// 是否登录
const isLogin = () => !!uniStorage.getSync('user.AccessToken')

// 是否在白名单中
const isContainsWhiteList = (url: string) =>
  whiteList.some((item) => url.includes(item))

// 是否存在路由
const isExist = (url: string) => allRoutes.some((item) => url.includes(item))

window.addEventListener('hashchange', function (e) {
  if (
    !isLogin() &&
    !e.newURL.includes('/login/login') &&
    !e.newURL.includes('/')
  ) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })

    uni.reLaunch({
      url: '/pages/login/login'
    })
  }

  if (!isExist(e.newURL)) {
    uni.showToast({
      title: '不存在该路由',
      icon: 'none'
    })
  }

  if (!isLogin() && !isContainsWhiteList(e.newURL)) {
    uni.showToast({
      title: '该路由无法访问',
      icon: 'none'
    })
  }
})
