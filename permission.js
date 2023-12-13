/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-08-04 13:22:04
 * @LastEditors: Your Name
 * @LastEditTime: 2022-02-18 11:02:45
 */
import router from './router'
import store from './store'
import Vue from 'vue'

import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken
} from '@/utils/auth'
import {
  getConfigKey
} from '@/api/main/index.js'
import { verifyAuth } from '@/api/login'

NProgress.configure({
  showSpinner: false
})
const whiteList = ['/auth-redirect', '/bind', '/energy', '/register', '/energy/authorization']
const systemList = ['TemplateEnergySetting', 'TemplatePriceScheme', 'Project']
router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (store.state.main.cancelList.length > 0) {
      store.state.main.cancelList.forEach((cancel, index) => {
        cancel()
      })
      store.state.main.cancelList = []
    }
    verifyAuth().then(res => {
      let date1 = Date.parse(res.data.endTime),
        date2 = Date.parse(res.data.currentTime)
      if (!(self.frameElement && self.frameElement.tagName === 'IFRAME')) {
        if (date1 - date2 <= 0) {
          Message.error('授权已过期，请重新授权！')
          if (window.location.pathname !== '/energy/authorization') {
            store.dispatch('LogOut').then(() => {
              window.top.location.href = window.location.origin + '/energy/authorization'
            })
          }
        }
      }
    })
    // 一、 to.matched.length === 0如果没有匹配到路由
    if (store.getters.roles.length === 0 || to.matched.length === 0) {
      // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(() => {
        store.dispatch('GenerateRoutes').then(accessRoutes => {
          let filterMenu = accessRoutes.filter(e => ['Energy/houtai', 'Energy', 'Energy/energySaving', 'Energy/qiantai'].includes(e.name))
          console.log("filterMenu:", filterMenu)
          // 根据roles权限生成可访问的路由表
          router.addRoutes(filterMenu) // 动态添加可访问路由表
          if (to.path == '/energy' || to.path == '/energy/' || to.path == '/' || to.path == '/login') {
            if (store.state.user && store.state.user.name == 'guest') {
              next({ path: '/energy/board?name=TemplateBoard' })
            } else {
              next({ ...filterMenu[0].children[0] })
            }
          } else {
            // if (!to.name) {
            //   next({ path: '/energy/404' })
            // } else {
            //   next({ ...to })
            // } // hack方法 确保addRoutes已完成
            next({ ...to })
            NProgress.done()
          }
        })
      }).catch(err => {
        store.dispatch('LogOut').then(() => {
          Message.error(err)
          next({
            ...to
          })
        })
      })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      getConfigKey('energy.logout.href').then(res => {
        if (res.code == 200) {
          window.top.location.href = res.msg
        }
      })
    }
  }
}
)

router.afterEach((to) => {
  document.body.getAttribute('class') !== '-' ? localStorage.setItem('bodyClass', document.body.getAttribute('class')) : ''
  document.body.setAttribute('class', localStorage.getItem('bodyClass'))

  NProgress.done()
})
