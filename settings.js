/*
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2022-02-14 13:37:28
 * @LastEditors: Your Name
 * @LastEditTime: 2022-06-27 10:53:55
 */

module.exports = {
    /**
     * 系统名称
     */
    // title: '节能管理优化平台',
    title: process.env.VUE_APP_SYSTEM_FLAG == "ENERGYPLUS" ? '节能管理优化平台' : '源创演示云',
    /**
     * 版本号
     */
    version: 'V0.8.2',

    /**
     * 版权信息
     */
    copyright: 'Copyright © 2020-2022 源创智控 All Rights Reserved.',

    /**
     * 备案号
     */
    icp: " 浙ICP备2022014024号-2",
    /**
     * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
     */
    sideTheme: 'theme-light',

    /**
     * 是否系统布局配置
     */
    showSettings: false,

    /**
     * 是否显示 tagsView
     */
    tagsView: true,

    /**
     * 是否固定头部
     */
    fixedHeader: false,

    /**
     * 是否显示logo
     */
    sidebarLogo: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production'
}