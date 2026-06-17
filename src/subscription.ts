import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';
import globalGroups from './globalGroups';

export default defineGkdSubscription({
  id: 233,
  name: '小哇的GKD订阅',
  version: 0,
  author: '小哇',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/yylt/gkd_subscription',
  categories,
  globalGroups,
  apps: await batchImportApps(`${import.meta.dirname}/apps`),
});
