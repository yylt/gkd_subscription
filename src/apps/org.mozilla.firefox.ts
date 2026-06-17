import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'org.mozilla.firefox',
  name: 'Firefox',
  groups: [
    {
      key: 1,
      name: '全屏广告-更新提示',
      desc: '关闭更新提示',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: [
            '.App',
            'org.mozilla.fenix.HomeActivity',
            'org.mozilla.fenix.IntentReceiverActivity',
          ],
          matches: [
            '[text*="更新" || text*="Update" || text*="有新版本"][visibleToUser=true]',
            '[text*="取消" || text*="稍后" || text*="以后" || text*="Cancel"][visibleToUser=true]',
          ],
        },
      ],
    },
    {
      key: 2,
      name: '全屏广告-登录弹窗',
      desc: '关闭登录/同步提示',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: [
            'org.mozilla.fenix.HomeActivity',
            'org.mozilla.fenix.IntentReceiverActivity',
          ],
          matches: [
            '[text*="登录" || text*="同步" || text*="Sign in" || text*="Log in" || text*="Sync"][visibleToUser=true]',
            '[text*="关闭" || text*="取消" || text*="Close" || text*="Cancel" || vid*="close" || vid*="dismiss"][visibleToUser=true]',
          ],
        },
      ],
    },
    {
      key: 3,
      name: '全屏广告-通知提示',
      desc: '关闭通知请求',
      fastQuery: true,
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: [
            'org.mozilla.fenix.HomeActivity',
            'org.mozilla.fenix.IntentReceiverActivity',
          ],
          matches: [
            '[text*="通知" || text*="Notifications" || text*="推送"][visibleToUser=true]',
            '[text*="不允许" || text*="拒绝" || text*="取消" || text*="Don\'t allow" || text*="Deny"][visibleToUser=true]',
          ],
        },
      ],
    },
  ],
});
