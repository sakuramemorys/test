/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-08-20 08:49:11
 * @LastEditors: Your Name
 * @LastEditTime: 2022-02-26 14:16:57
 */
import Vue from 'vue'
import Print from '@/views/energy/print';
Vue.use(Print);
import Cookies from 'js-cookie'

import Element from 'element-ui'
import OptiFspUi from 'yuntrol-ui'
import 'yuntrol-ui/lib/font'
Vue.use(OptiFspUi)
import * as echarts from 'echarts'
// 全局设置点击空白区域不关闭弹窗
Element.Dialog.props.closeOnClickModal.default = false
// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/views/energy/assets/styles/style.scss'
import SYSTEM from './settings'
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import {
  download,
  getDownload
} from '@/utils/request'
import moment from 'moment'
import './assets/icons' // icon
import './permission' // permission control
import {
  getDicts,
  getConfigKey
} from '@/api/main/index.js'
import { getTimeList, addTimeList, editTimeList, propertySelected } from '@/views/energy/api/basic'
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  getFormArray,
  closeTab,
  openLoading,
  loadingSubmit,
  loadingDelete,
  detailField,
  stringIsEmpty,
  stringIsNotEmpty,
  consoleLog
} from '@/utils/ruoyi'
import Pagination from '@/components/Pagination'
// 自定义表格工具扩展
import RightToolbar from '@/components/RightToolbar'
import defaultParams from '@/components/defaultParams'
// 路由参数加密
import {
  Base64
} from './utils/ruoyi'
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
// 左边工具栏部分节点隐藏
Vue.use(OptiFspUi)
Vue.prototype.SYSTEMDEV = SYSTEM
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

//vue全局注入echarts
Vue.prototype.$echarts = echarts
Vue.prototype.$Base64 = Base64
Vue.prototype.defaultDateStr = defaultParams.defaultDateStr
Vue.prototype.moment = moment
moment.suppressDeprecationWarnings = true
// 全局变量
Vue.prototype.repairTeamId = 1
Vue.prototype.maintainTeamId = 2
Vue.prototype.patrolTeamId = 3
Vue.prototype.darkTextColor = '#fff'
Vue.prototype.lightTextColor = '#52466A'
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.getTimeList = getTimeList
Vue.prototype.propertySelected = propertySelected
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.getDownload = getDownload
Vue.prototype.handleTree = handleTree

Vue.prototype.getFormArray = getFormArray
Vue.prototype.closeTab = closeTab
Vue.prototype.openLoading = openLoading
Vue.prototype.loadingSubmit = loadingSubmit
Vue.prototype.loadingDelete = loadingDelete
Vue.prototype.detailField = detailField
Vue.prototype.stringIsEmpty = stringIsEmpty
Vue.prototype.stringIsNotEmpty = stringIsNotEmpty
Vue.prototype.consoleLog = consoleLog
Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: 'success'
  })
}

Vue.prototype.msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: 'error'
  })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

import {createDarkTheme} from './utils/echarts/theme/custom-dark'
// echarts注册自定义主题
echarts.registerTheme('custom-dark', createDarkTheme(Vue.prototype.darkTextColor))

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
