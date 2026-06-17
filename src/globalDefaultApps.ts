// 全局规则黑白名单配置
// 参考: https://github.com/AIsouler/GKD_subscription/blob/main/src/globalDefaultApps.ts

// ============================================
// 全局规则黑名单
// 在这些应用中禁用所有全局规则
// ============================================
export const blackListAppIDs: string[] = [
  // 社交（有专属规则）
  'com.tencent.mm', // 微信
  'li.songe.gkd', // GKD
  'org.telegram.messenger', // Telegram
  'com.twitter.android', // Twitter/X
  'com.instagram.android', // Instagram
  'com.facebook.katana', // Facebook
  'com.reddit.frontpage', // Reddit

  // 浏览器
  'com.android.chrome', // Chrome
  'com.microsoft.emmx', // Edge
  'com.quark.browser', // 夸克

  // 工具
  'com.github.android', // GitHub
  'com.deepseek.chat', // DeepSeek
  'com.openai.chatgpt', // ChatGPT
  'com.spotify.music', // Spotify

  // 支付
  'com.eg.android.AlipayGphone', // 支付宝

  // 文件管理
  'bin.mt.plus', // MT管理器
  'ru.zdevs.zarchiver', // ZArchiver
  'com.estrongs.android.pop', // ES文件管理器

  // 下载
  'com.xunlei.downloadprovider', // 迅雷
  'com.pikcloud.pikpak', // PikPak

  // VPN
  'com.github.metacubex.clash.meta', // Clash Meta
  'com.v2ray.bizer', // v2ray

  // 其他
  'com.valvesoftware.android.steam.community', // Steam
  'org.thoughtcrime.securesms', // Signal
];

// ============================================
// 开屏广告规则
// ============================================

// 黑名单：禁用开屏广告规则
export const openAdBlackListAppIDs = new Set([
  ...blackListAppIDs,
  'com.taptap', // TapTap
  'com.sankuai.meituan', // 美团（误触）
]);

// 白名单：对系统应用启用开屏广告规则
export const openAdWhiteListAppIDs = new Set([
  'com.bbk.appstore', // vivo 应用商店
  'com.tencent.southpole.appstore', // 黑鲨应用市场
  'com.heytap.browser', // 一加浏览器
  'com.heytap.themestore', // OPPO 主题商店
  'com.bbk.theme', // vivo 主题商店
  'com.vivo.game', // vivo 游戏中心
  'com.meizu.media.video', // 魅族视频
  'com.hihonor.vmall', // 荣耀商城
  'com.miui.systemAdSolution', // 小米智能服务
]);

// ============================================
// 更新提示规则
// ============================================

export const updateBlackListAppIDs = new Set([
  ...blackListAppIDs,

  // 系统安装器
  'com.miui.packageinstaller',
  'com.android.packageinstaller',
  'com.google.android.packageinstaller',
  'com.oplus.appdetail',
  'com.samsung.android.packageinstaller',

  // 不更新会强制退出的应用
  'info.muge.appshare', // AppShare
  'com.jingdong.app.mall', // 京东
  'com.netease.uuremote', // UU远程
]);

export const updateWhiteListAppIDs = new Set([
  'com.hihonor.phoneservice', // 我的荣耀
]);

// ============================================
// 青少年模式规则
// ============================================

export const yongBlackListAppIDs = new Set([
  ...blackListAppIDs,

  // 全局规则误触风险
  'com.netease.cloudmusic', // 网易云音乐
  'com.zhihu.android', // 知乎
  'com.luna.music', // 汽水音乐
  'com.baidu.tieba', // 百度贴吧

  // 银行
  'com.android.bankabc', // 农业银行

  // 出行
  'com.autonavi.minimap', // 高德地图
  'com.MobileTicket', // 铁路12306
  'com.sdu.didi.psnger', // 滴滴出行

  // 生活服务
  'com.sankuai.meituan', // 美团
  'me.ele', // 饿了么

  // 购物
  'com.taobao.taobao', // 淘宝
  'com.taobao.idlefish', // 闲鱼
  'com.jingdong.app.mall', // 京东

  // 社交
  'com.tencent.mobileqq', // QQ
  'com.xingin.xhs', // 小红书
  'com.coolapk.market', // 酷安
  'com.alibaba.android.rimet', // 钉钉

  // 其他
  'com.baidu.netdisk', // 百度网盘
  'com.taptap', // TapTap
  'com.tencent.qqmusic', // QQ音乐
  'com.ct.client', // 中国电信
  'com.sinovatech.unicom.ui', // 中国联通
  'com.max.xiaoheihe', // 小黑盒
  'com.xunlei.downloadprovider', // 迅雷
]);

export const yongWhiteListAppIDs = new Set([]);
