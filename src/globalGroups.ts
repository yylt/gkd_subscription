import { defineGkdGlobalGroups } from '@gkd-kit/define';
import * as appList from './globalDefaultApps';

export default defineGkdGlobalGroups([
  {
    key: 0,
    name: '开屏广告-全局',
    desc: '关闭打开应用时的开屏广告',
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 2,
    resetMatch: 'app',
    priorityTime: 10000,
    disableIfAppGroupMatch: '开屏广告',
    rules: [
      {
        key: 0,
        anyMatches: [
          '[text*="跳过"][text.length<10][width<500 && height<300][visibleToUser=true]',
        ],
      },
    ],
    apps: [...appList.openAdBlackListAppIDs]
      .map((id) => ({ id, enable: false }))
      .concat(
        [...appList.openAdWhiteListAppIDs].map((id) => ({ id, enable: true })),
      ),
  },
  {
    key: 1,
    name: '更新提示-全局',
    desc: '关闭应用的更新弹窗',
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 1,
    resetMatch: 'app',
    disableIfAppGroupMatch: '更新提示',
    rules: [
      {
        key: 0,
        matches: [
          '[text*="更新" || text*="升级" || text*="新版"][childCount=0][visibleToUser=true]',
          '[text*="取消" || text*="暂不" || text*="稍后" || text*="关闭"][text.length<6][childCount=0][visibleToUser=true]',
        ],
      },
    ],
    apps: [...appList.updateBlackListAppIDs]
      .map((id) => ({ id, enable: false }))
      .concat(
        [...appList.updateWhiteListAppIDs].map((id) => ({ id, enable: true })),
      ),
  },
  {
    key: 2,
    name: '青少年模式-全局',
    desc: '关闭应用的青少年模式弹窗',
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 1,
    resetMatch: 'app',
    disableIfAppGroupMatch: '青少年模式',
    rules: [
      {
        key: 0,
        matches: [
          '[text*="青少年" || text*="未成年" || text*="儿童"][text*="模式" || text*="守护"][text.length<15][visibleToUser=true]',
          '[text*="知道了" || text*="我已知晓" || text*="已满" || text*="不再提醒"][text.length<8][visibleToUser=true]',
        ],
      },
    ],
    apps: [...appList.yongBlackListAppIDs]
      .map((id) => ({ id, enable: false }))
      .concat(
        [...appList.yongWhiteListAppIDs].map((id) => ({ id, enable: true })),
      ),
  },
]);
