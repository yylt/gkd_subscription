# GKD 订阅使用文档

## 目录

- [项目简介](#项目简介)
- [环境配置](#环境配置)
- [项目结构](#项目结构)
- [应用规则配置](#应用规则配置)
- [全局规则配置](#全局规则配置)
- [构建与使用](#构建与使用)
- [常见问题](#常见问题)

---

## 项目简介

这是一个基于 [GKD](https://gkd-kit.gitee.io/) 的订阅规则项目，用于自动跳过 Android 应用的开屏广告、弹窗广告等。

当前已迁移 **64 个应用**，覆盖社交、视频、办公、应用商店等类别。

---

## 环境配置

### 前置要求

- **Node.js** >= 22（需要 WasmGc 支持）
- **pnpm** >= 9
- **VS Code**（推荐）

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd gkd_subscription

# 安装依赖
pnpm install

# 如果网络问题，使用镜像源
pnpm install --registry=https://registry.npmmirror.com
```

---

## 项目结构

```
gkd_subscription/
├── src/
│   ├── subscription.ts      # 订阅主配置
│   ├── categories.ts        # 规则分类定义
│   ├── globalGroups.ts      # 全局规则（开屏广告、更新提示等）
│   ├── globalDefaultApps.ts # 全局规则黑白名单（可选）
│   └── apps/                # 应用规则目录
│       ├── com.tencent.mm.ts      # 微信
│       ├── com.tencent.mobileqq.ts # QQ
│       └── ...
├── dist/                    # 构建输出目录
├── docs/                    # 文档目录
├── package.json
└── README.md
```

---

## 应用规则配置

### 基本格式

每个应用规则文件位于 `src/apps/` 目录下，文件名为应用包名 + `.ts`。

```typescript
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.example.app',      // 应用包名
  name: '应用名称',            // 应用显示名称
  groups: [
    {
      key: 0,                  // 规则组唯一标识
      name: '开屏广告',        // 规则组名称
      desc: '关闭开屏广告',    // 描述（可选）
      matchTime: 10000,        // 匹配超时时间（毫秒）
      actionMaximum: 1,        // 最大触发次数
      resetMatch: 'app',       // 重置匹配时机
      rules: [
        {
          key: 0,
          fastQuery: true,     // 是否启用快速查询
          activityIds: '.MainActivity',  // 限定 Activity
          matches: '[text*="跳过"]',     // 选择器
          snapshotUrls: ['https://...'], // 快照链接
        },
      ],
    },
  ],
});
```

### 规则组属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `key` | number | 规则组唯一标识，同一应用内不可重复 |
| `name` | string | 规则组名称，用于在 GKD 中显示 |
| `desc` | string | 规则组描述 |
| `matchTime` | number | 匹配超时时间（毫秒），超时后停止匹配 |
| `actionMaximum` | number | 最大触发次数 |
| `resetMatch` | string | 重置匹配时机：`'app'` 应用切换时重置 |
| `forcedTime` | number | 强制匹配时间 |
| `priorityTime` | number | 优先匹配时间 |
| `disableIfAppGroupMatch` | string | 如果应用有同名规则组，禁用此全局规则 |
| `fastQuery` | boolean | 启用快速查询模式 |
| `rules` | Rule[] | 规则列表 |

### 规则属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `key` | number | 规则唯一标识 |
| `name` | string | 规则名称 |
| `desc` | string | 规则描述 |
| `fastQuery` | boolean | 启用快速查询 |
| `activityIds` | string \| string[] | 限定 Activity |
| `matches` | string \| string[] | 选择器表达式 |
| `excludeMatches` | string \| string[] | 排除选择器 |
| `preKeys` | number[] | 前置规则 key，需先匹配前置规则 |
| `action` | string | 动作类型：`'click'`、`'clickCenter'` 等 |
| `matchRoot` | boolean | 是否从根节点匹配 |
| `anyMatches` | string[] | 任意匹配一个即可 |
| `snapshotUrls` | string[] | 快照链接，用于调试 |

### 选择器语法

选择器用于匹配 Android 界面元素：

```typescript
// 基本选择器
'[text="跳过"]'                    // 文本完全匹配
'[text*="跳过"]'                   // 文本包含
'[text^="跳过"]'                   // 文本以...开头
'[text$="跳过"]'                   // 文本以...结尾
'[vid="btn_skip"]'                 // View ID 匹配
'[desc="关闭"]'                    // Content Description 匹配

// 属性选择器
'[clickable=true]'                 // 可点击
'[visibleToUser=true]'             // 可见
'[childCount=0]'                   // 子元素数量

// 组合选择器
'[text*="跳过"][visibleToUser=true]'  // AND 关系
'@View[clickable=true] - [text="广告"]'  // 相邻兄弟

// 层级选择器
'ViewGroup > TextView'             // 直接子元素
'ViewGroup >> TextView'            // 任意后代
```

---

## 全局规则配置

全局规则定义在 `src/globalGroups.ts` 中，对所有应用生效。

### 当前全局规则

本项目**未配置全局规则**，所有规则均在各应用文件中独立定义。

### 如需添加全局规则

参考 [GKD_subscription](https://github.com/AIsouler/GKD_subscription) 的 `globalGroups.ts`：

```typescript
import { defineGkdGlobalGroups } from '@gkd-kit/define';

export default defineGkdGlobalGroups([
  {
    key: 0,
    name: '开屏广告-全局',
    desc: '关闭打开应用时的开屏广告',
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 2,
    resetMatch: 'app',
    rules: [
      {
        key: 0,
        matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
      },
    ],
    // 可选：黑白名单控制
    apps: [
      { id: 'com.example.app1', enable: false },  // 禁用
      { id: 'com.example.app2', enable: true },   // 启用
    ],
  },
]);
```

### 全局规则黑白名单

如需精细控制全局规则对特定应用的生效情况，可创建 `src/globalDefaultApps.ts`：

```typescript
// 全局规则黑名单 - 对这些应用禁用所有全局规则
export const blackListAppIDs: string[] = [
  'com.tencent.mm',      // 微信（有专属规则）
  'li.songe.gkd',        // GKD 自身
  'org.telegram.messenger', // Telegram
  // ... 其他不需要全局规则的应用
];

// 开屏广告黑名单 - 额外禁用开屏广告全局规则
export const openAdBlackListAppIDs = new Set([
  ...blackListAppIDs,
  'com.taptap',  // TapTap
]);

// 开屏广告白名单 - 对系统应用启用开屏广告规则
export const openAdWhiteListAppIDs = new Set([
  'com.bbk.appstore',      // vivo 应用商店
  'com.heytap.themestore', // OPPO 主题商店
]);
```

---

## 构建与使用

### 本地构建

```bash
# 类型检查 + 构建
pnpm build

# 仅类型检查
pnpm check

# 格式化代码
pnpm format

# 代码检查
pnpm lint
```

构建后的订阅文件位于 `dist/gkd.json5`。

### GitHub Actions 自动构建

1. Fork 项目到你的 GitHub
2. 开启 Actions 权限：`Settings > Actions > General > Workflow permissions > Read and write permissions`
3. 运行 `build_release.yml` 工作流

### 在 GKD 中使用

1. 打开 GKD 应用
2. 进入 `订阅` 页面
3. 点击 `+` 添加订阅
4. 输入订阅地址：

```
https://raw.githubusercontent.com/<username>/<repo>/main/dist/gkd.json5
```

国内加速镜像：
```
https://fastly.jsdelivr.net/gh/<username>/<repo>@main/dist/gkd.json5
```

---

## 常见问题

### Q: 全局规则是否会覆盖未迁移的应用？

**A: 会的。** 全局规则（如开屏广告、更新提示、青少年模式）默认对所有应用生效，除非：

1. **应用在黑名单中**：在 `globalDefaultApps.ts` 的 `blackListAppIDs` 中配置
2. **应用有同名规则组**：使用 `disableIfAppGroupMatch` 属性，当应用自身有同名规则组时，全局规则自动禁用
3. **全局规则未启用**：在 GKD 中手动关闭

**当前状态**：本项目未配置全局规则，因此不会影响未迁移的应用。

### Q: 如何添加新应用规则？

1. 在 `src/apps/` 下创建新文件，文件名为包名 + `.ts`
2. 参考现有应用规则编写规则组
3. 运行 `pnpm check` 检查格式
4. 运行 `pnpm build` 构建

### Q: 如何调试规则？

1. 在 GKD 中开启 `规则快照` 功能
2. 触发规则时会生成快照
3. 将快照 URL 添加到规则的 `snapshotUrls` 字段

### Q: 规则不生效怎么办？

1. 检查 `activityIds` 是否正确
2. 检查选择器是否匹配当前界面元素
3. 检查 `matchTime` 是否过短
4. 查看 GKD 日志获取调试信息

---

## 已迁移应用列表

| 类别 | 数量 | 应用 |
|------|------|------|
| 社交 | 25 | 微信、QQ、微博、小红书、知乎、贴吧、豆瓣、Soul、LOFTER、酷安、钉钉、企业微信、飞书、QQ空间、今日头条、百度搜索等 |
| 视频 | 19 | B站、优酷、爱奇艺、腾讯视频、芒果TV、搜狐视频、咪咕、PPTV、斗鱼、央视频等 |
| 办公 | 10 | WPS、腾讯文档、石墨文档、语雀、Flomo等 |
| 应用商店 | 13 | 小米、OPPO、vivo、华为、荣耀、三星、联想等 |
| 其他 | 7 | 雪球、京东、淘宝、支付宝、喜马拉雅、GKD等 |

---

## 参考资料

- [GKD 官方文档](https://gkd-kit.gitee.io/)
- [GKD 订阅模板](https://github.com/gkd-kit/subscription-template)
- [选择器 API](https://gkd.li/api)
- [AIsouler 订阅](https://github.com/AIsouler/GKD_subscription) - 本项目源订阅
