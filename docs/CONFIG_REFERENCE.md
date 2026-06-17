# 配置参考手册

## 目录

- [subscription.ts 配置](#subscriptionts-配置)
- [categories.ts 分类配置](#categoriests-分类配置)
- [globalGroups.ts 全局规则](#globalgroupsts-全局规则)
- [globalDefaultApps.ts 黑白名单](#globaldefaultappsts-黑白名单)
- [应用规则配置](#应用规则配置)

---

## subscription.ts 配置

订阅主配置文件，定义订阅的基本信息。

```typescript
import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';
import globalGroups from './globalGroups';

export default defineGkdSubscription({
  id: 233,                    // 订阅唯一 ID，必须修改避免冲突
  name: 'My Subscription',    // 订阅名称
  version: 0,                 // 版本号，构建时自动更新
  author: 'author',           // 作者
  checkUpdateUrl: './gkd.version.json5',  // 更新检查地址
  supportUri: 'https://github.com/...',   // 支持链接
  categories,                 // 规则分类
  globalGroups,               // 全局规则
  apps: await batchImportApps(`${import.meta.dirname}/apps`),  // 应用规则
});
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | number | ✅ | 订阅唯一标识，建议使用大随机数 |
| `name` | string | ✅ | 订阅显示名称 |
| `version` | number | ✅ | 版本号，构建时自动更新 |
| `author` | string | ❌ | 作者名称 |
| `checkUpdateUrl` | string | ❌ | 更新检查地址 |
| `supportUri` | string | ❌ | 支持/捐赠链接 |
| `categories` | Category[] | ❌ | 规则分类列表 |
| `globalGroups` | GlobalGroup[] | ❌ | 全局规则列表 |
| `apps` | App[] | ✅ | 应用规则列表 |

---

## categories.ts 分类配置

定义规则的分类，用于在 GKD 中分组显示。

```typescript
import { defineGkdCategories } from '@gkd-kit/define';

export default defineGkdCategories([
  {
    key: 0,
    name: '开屏广告',
    enable: true,    // 默认启用
  },
  {
    key: 1,
    name: '青少年模式',
    enable: false,   // 默认禁用
  },
  {
    key: 2,
    name: '更新提示',
    enable: false,
  },
  {
    key: 3,
    name: '评价提示',
    enable: false,
  },
  {
    key: 4,
    name: '通知提示',
    enable: false,
  },
  {
    key: 5,
    name: '权限提示',
    enable: false,
  },
  {
    key: 6,
    name: '局部广告',
    enable: false,
  },
  {
    key: 7,
    name: '全屏广告',
    enable: false,
  },
  {
    key: 8,
    name: '分段广告',
    enable: false,
  },
  {
    key: 9,
    name: '功能类',
    enable: false,
  },
  {
    key: 10,
    name: '其他',
    enable: false,
  },
]);
```

### 分类字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | number | 分类唯一标识 |
| `name` | string | 分类名称 |
| `enable` | boolean | 是否默认启用 |

### 常用分类

| key | 名称 | 说明 |
|-----|------|------|
| 0 | 开屏广告 | 应用启动时的全屏广告 |
| 1 | 青少年模式 | 青少年模式弹窗 |
| 2 | 更新提示 | 应用更新弹窗 |
| 3 | 评价提示 | 评分/评价弹窗 |
| 4 | 通知提示 | 通知权限请求等 |
| 5 | 权限提示 | 各种权限请求弹窗 |
| 6 | 局部广告 | 信息流广告、卡片广告 |
| 7 | 全屏广告 | 弹窗广告、浮层广告 |
| 8 | 分段广告 | 需要多步操作关闭的广告 |
| 9 | 功能类 | 自动签到、展开等辅助功能 |
| 10 | 其他 | 未分类规则 |

---

## globalGroups.ts 全局规则

全局规则对所有应用生效，无需为每个应用单独配置。

```typescript
import { defineGkdGlobalGroups } from '@gkd-kit/define';

export default defineGkdGlobalGroups([
  {
    key: 0,
    name: '开屏广告-全局',
    desc: '关闭打开应用时的开屏广告',
    order: -10,                    // 排序优先级
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 2,
    resetMatch: 'app',
    forcedTime: 10000,
    priorityTime: 10000,
    disableIfAppGroupMatch: '开屏广告',  // 应用有同名规则时禁用
    rules: [
      {
        key: 0,
        matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
        excludeMatches: '...',     // 排除误触情况
        snapshotUrls: ['https://...'],
        excludeSnapshotUrls: ['https://...'],
      },
    ],
    apps: [
      // 黑名单 - 禁用此规则
      { id: 'com.tencent.mm', enable: false },
      // 白名单 - 启用此规则（用于系统应用）
      { id: 'com.bbk.appstore', enable: true },
    ],
  },
]);
```

### 全局规则字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | number | 规则组唯一标识 |
| `name` | string | 规则组名称 |
| `desc` | string | 规则组描述 |
| `order` | number | 排序优先级，数值越小越靠前 |
| `disableIfAppGroupMatch` | string | 应用有同名规则组时自动禁用 |
| `fastQuery` | boolean | 启用快速查询 |
| `matchTime` | number | 匹配超时时间 |
| `actionMaximum` | number | 最大触发次数 |
| `resetMatch` | string | 重置时机：`'app'` 应用切换时 |
| `forcedTime` | number | 强制匹配时间 |
| `priorityTime` | number | 优先匹配时间 |
| `rules` | Rule[] | 规则列表 |
| `apps` | AppControl[] | 应用黑白名单 |

### `disableIfAppGroupMatch` 机制

当全局规则设置了 `disableIfAppGroupMatch: '开屏广告'` 时：

- 如果应用自身定义了名为 `开屏广告` 的规则组，全局规则自动禁用
- 避免全局规则和应用专属规则重复触发
- 推荐为常用应用编写专属规则

---

## globalDefaultApps.ts 黑白名单

集中管理全局规则对各应用的生效情况。

```typescript
// ============================================
// 全局规则黑名单
// 这些应用禁用所有全局规则
// ============================================
export const blackListAppIDs: string[] = [
  'com.tencent.mm',           // 微信（有专属规则）
  'li.songe.gkd',             // GKD 自身
  'com.eg.android.AlipayGphone', // 支付宝
  'org.telegram.messenger',   // Telegram
  'com.twitter.android',      // Twitter/X
  'com.github.android',       // GitHub
  'com.android.chrome',       // Chrome
  'com.deepseek.chat',        // DeepSeek
  'com.spotify.music',        // Spotify
  // ... 更多应用
];

// ============================================
// 开屏广告规则
// ============================================

// 黑名单：禁用开屏广告规则
export const openAdBlackListAppIDs = new Set([
  ...blackListAppIDs,         // 继承全局黑名单
  'com.taptap',               // TapTap（误触风险）
  'com.sankuai.meituan',      // 美团（误触风险）
]);

// 白名单：启用开屏广告规则（用于系统应用）
export const openAdWhiteListAppIDs = new Set([
  'com.bbk.appstore',         // vivo 应用商店
  'com.heytap.themestore',    // OPPO 主题商店
  'com.bbk.theme',            // vivo 主题商店
  'com.hihonor.vmall',        // 荣耀商城
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
  // 不更新会强制退出的应用
  'com.jingdong.app.mall',    // 京东
]);

export const updateWhiteListAppIDs = new Set([
  'com.hihonor.phoneservice', // 我的荣耀
]);

// ============================================
// 青少年模式规则
// ============================================

export const yongBlackListAppIDs = new Set([
  ...blackListAppIDs,
  'com.netease.cloudmusic',   // 网易云音乐（误触风险）
  'com.zhihu.android',        // 知乎（误触风险）
  'com.baidu.tieba',          // 百度贴吧
  'com.taptap',               // TapTap
]);

export const yongWhiteListAppIDs = new Set([]);
```

### 黑白名单优先级

1. **白名单** > 黑名单：白名单中的应用强制启用规则
2. **黑名单**：禁用对应规则
3. **默认**：不在名单中的应用，全局规则正常生效

---

## 应用规则配置

### 完整示例

```typescript
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.example.app',
  name: '示例应用',
  groups: [
    // ==========================================
    // 开屏广告
    // ==========================================
    {
      key: -1,                 // 使用负数表示开屏广告
      name: '开屏广告',
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      priorityTime: 10000,
      rules: [
        {
          fastQuery: true,
          matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
          snapshotUrls: ['https://i.gkd.li/i/xxx'],
        },
      ],
    },

    // ==========================================
    // 分段广告（信息流广告）
    // ==========================================
    {
      key: 6,
      name: '分段广告-信息流广告',
      desc: '点击关闭-点击不感兴趣',
      fastQuery: true,
      rules: [
        {
          key: 0,
          activityIds: '.MainActivity',
          matches: '@[clickable=true] - [text*="广告"]',
          snapshotUrls: ['https://i.gkd.li/i/xxx'],
        },
        {
          preKeys: [0],        // 依赖规则 0
          key: 90,
          matches: '[text*="不感兴趣"]',
        },
      ],
    },

    // ==========================================
    // 权限提示
    // ==========================================
    {
      key: 10,
      name: '权限提示-通知权限',
      fastQuery: true,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          activityIds: '.MainActivity',
          matches: '[text*="通知"][visibleToUser=true]',
          snapshotUrls: ['https://i.gkd.li/i/xxx'],
        },
      ],
    },

    // ==========================================
    // 功能类（自动签到等）
    // ==========================================
    {
      key: 20,
      name: '功能类-自动签到',
      rules: [
        {
          fastQuery: true,
          activityIds: '.SignActivity',
          matches: [
            '[text="签到"][visibleToUser=true]',
            '[text="立即签到"][visibleToUser=true]',
          ],
        },
      ],
    },
  ],
});
```

### 常用 key 值约定

| key 范围 | 用途 |
|----------|------|
| -1 ~ -9 | 开屏广告 |
| 0 ~ 9 | 青少年模式、更新提示、评价提示 |
| 10 ~ 19 | 权限提示、通知提示 |
| 20 ~ 29 | 全屏广告、弹窗广告 |
| 30 ~ 39 | 局部广告、卡片广告 |
| 40 ~ 49 | 悬浮广告 |
| 50 ~ 59 | 分段广告 |
| 90+ | 功能类 |
| 100+ | 其他 |

### preKeys 前置规则

用于实现多步操作（如：点击关闭 → 点击不感兴趣）：

```typescript
rules: [
  {
    key: 0,
    matches: '[text*="广告"]',  // 第一步：找到广告
  },
  {
    preKeys: [0],               // 依赖规则 0
    key: 1,
    matches: '[text="×"]',      // 第二步：点击关闭
  },
  {
    preKeys: [1],               // 依赖规则 1
    key: 2,
    matches: '[text*="不感兴趣"]', // 第三步：点击不感兴趣
  },
]
```

### 快照链接

快照用于调试规则，格式：

```typescript
snapshotUrls: [
  'https://i.gkd.li/i/12345678',  // GKD 官方快照
  'https://e.gkd.li/xxx',         // 示例快照
],
excludeSnapshotUrls: [
  'https://i.gkd.li/i/87654321',  // 排除的快照（误触示例）
],
```

---

## 选择器高级语法

### 基本选择器

```typescript
'[text="完全匹配"]'           // 文本完全相等
'[text*="包含"]'              // 文本包含
'[text^="开头"]'              // 文本以...开头
'[text$="结尾"]'              // 文本以...结尾
'[text.length<10]'            // 文本长度小于 10
'[vid="view_id"]'             // View ID
'[desc="描述"]'               // Content Description
'[name$="TextView"]'          // 类名以 TextView 结尾
```

### 属性选择器

```typescript
'[clickable=true]'            // 可点击
'[visibleToUser=true]'        // 对用户可见
'[checked=true]'              // 已选中
'[enabled=true]'              // 已启用
'[childCount=0]'              // 无子元素
'[childCount>1]'              // 多于 1 个子元素
'[width<500]'                 // 宽度小于 500
'[height<300]'                // 高度小于 300
```

### 层级关系

```typescript
'Parent > Child'              // 直接子元素
'Parent >> Child'             // 任意后代
'Parent >n Child'             // 第 n 个子元素
'@Target < Parent'            // 目标元素的父元素
'@Target <n Parent'           // 向上 n 层
'@Target + Sibling'           // 下一个兄弟
'@Target - Sibling'           // 上一个兄弟
'@Target +n Sibling'          // 后第 n 个兄弟
'@Target -n Sibling'          // 前第 n 个兄弟
```

### 组合条件

```typescript
// AND 条件（同一选择器内）
'[text*="广告"][visibleToUser=true][clickable=true]'

// OR 条件（使用 ||）
'[text="跳过" || text="关闭" || text="取消"]'

// 数组形式（AND 条件，多行）
[
  '[text*="广告"]',
  '[visibleToUser=true]',
]

// anyMatches（OR 条件，任意匹配）
anyMatches: [
  '[text="跳过"]',
  '[vid="btn_skip"]',
]
```

### 正则表达式

```typescript
'[text~="(?i)skip"]'          // 不区分大小写匹配
'[vid~="(?is).*skip.*"]'      // 包含 skip（不区分大小写）
'[text!~="(?i)video"]'        // 不匹配 video
```

### 排除条件

```typescript
// excludeMatches：排除误触情况
excludeMatches: [
  '[text*="跳过片头"]',         // 排除"跳过片头"
  '[text*="跳过片尾"]',         // 排除"跳过片尾"
],
```

---

## 常用技巧

### 1. 防止误触

```typescript
{
  matches: '[text*="跳过"]',
  excludeMatches: [
    '[text*="跳过片头"]',
    '[text*="跳过片尾"]',
    '[text*="跳过广告视频"]',
  ],
}
```

### 2. 限定 Activity

```typescript
{
  activityIds: [
    '.MainActivity',
    '.SplashActivity',
  ],
}
```

### 3. 延迟匹配

```typescript
{
  matchTime: 10000,      // 10 秒内匹配
  priorityTime: 5000,    // 5 秒内优先匹配
}
```

### 4. 限制触发次数

```typescript
{
  actionMaximum: 1,      // 最多触发 1 次
  resetMatch: 'app',     // 应用切换时重置计数
}
```

---

## 参考资源

- [GKD 官方文档](https://gkd-kit.gitee.io/)
- [选择器 API](https://gkd.li/api)
- [订阅模板](https://github.com/gkd-kit/subscription-template)
- [AIsouler 订阅](https://github.com/AIsouler/GKD_subscription) - 规则参考
