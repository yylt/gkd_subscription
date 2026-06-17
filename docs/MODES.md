# 模式说明文档

本文档详细说明 GKD 订阅中的各种规则模式及其作用。

---

## 目录

- [全局规则模式](#全局规则模式)
  - [开屏广告](#开屏广告)
  - [更新提示](#更新提示)
  - [青少年模式](#青少年模式)
- [分类规则模式](#分类规则模式)
  - [评价提示](#评价提示)
  - [通知提示](#通知提示)
  - [权限提示](#权限提示)
  - [局部广告](#局部广告)
  - [全屏广告](#全屏广告)
  - [分段广告](#分段广告)
  - [功能类](#功能类)
- [黑白名单机制](#黑白名单机制)
- [已配置的黑白名单](#已配置的黑白名单)

---

## 全局规则模式

全局规则对所有应用生效，无需为每个应用单独配置。

### 开屏广告

**作用：** 自动跳过应用启动时显示的全屏广告（通常持续 3-5 秒）

**触发时机：** 应用冷启动或热启动时

**典型表现：**
- 应用启动后显示全屏图片/视频广告
- 广告右上角有"跳过"按钮（倒计时 3-5 秒）
- 点击跳过或等待倒计时结束进入应用

**规则逻辑：**
```
匹配：[text*="跳过"][text.length<10][visibleToUser=true]
```
- 查找包含"跳过"文字的元素
- 文字长度小于 10（避免误匹配"跳过片头"等）
- 元素可见时自动点击

**配置：**
- `matchTime: 10000` - 10 秒内匹配
- `actionMaximum: 2` - 最多触发 2 次
- `resetMatch: 'app'` - 应用切换时重置
- `disableIfAppGroupMatch: '开屏广告'` - 应用有专属规则时禁用全局规则

---

### 更新提示

**作用：** 自动关闭应用的更新弹窗，避免每次打开都提示更新

**触发时机：** 应用启动后或使用过程中弹出更新提示

**典型表现：**
- 弹窗提示"发现新版本"、"有新版本可用"
- 包含"立即更新"、"稍后"、"取消"等按钮
- 可能有"不再提醒"复选框

**规则逻辑：**
```
匹配：[text*="更新" || text*="升级" || text*="新版"]
关闭：[text*="取消" || text*="暂不" || text*="稍后" || text*="关闭"]
```
- 检测更新相关的文字
- 自动点击关闭/取消按钮

**配置：**
- `matchTime: 10000` - 10 秒内匹配
- `actionMaximum: 1` - 最多触发 1 次
- `disableIfAppGroupMatch: '更新提示'` - 应用有专属规则时禁用

---

### 青少年模式

**作用：** 自动关闭应用的青少年模式弹窗

**触发时机：** 应用启动时或特定时间段弹出

**典型表现：**
- 弹窗提示"青少年模式已开启"、"未成年人保护模式"
- 包含"我知道了"、"已满18周岁"等按钮
- 部分应用在夜间时段强制弹出

**规则逻辑：**
```
匹配：[text*="青少年" || text*="未成年" || text*="儿童"][text*="模式" || text*="守护"]
关闭：[text*="知道了" || text*="我已知晓" || text*="已满"]
```
- 检测青少年/未成年/儿童 + 模式/守护的组合
- 自动点击确认关闭按钮

**配置：**
- `matchTime: 10000` - 10 秒内匹配
- `actionMaximum: 1` - 最多触发 1 次
- `disableIfAppGroupMatch: '青少年模式'` - 应用有专属规则时禁用

**注意事项：**
- 此功能仅为方便使用，不建议用于绕过家长控制
- 部分应用的青少年模式可能有实际内容限制需求

---

## 分类规则模式

以下规则需要为各应用单独配置。

### 评价提示

**作用：** 自动关闭应用的评分/评价弹窗

**key:** 3

**典型表现：**
- 弹窗提示"喜欢这个应用吗？给个好评吧"
- 包含"去评价"、"以后再说"等按钮
- 可能出现星级评分界面

**配置建议：**
```typescript
{
  key: 3,
  name: '评价提示',
  desc: '关闭评分弹窗',
  fastQuery: true,
  matchTime: 10000,
  actionMaximum: 1,
  resetMatch: 'app',
  rules: [
    {
      matches: '[text*="评价" || text*="评分" || text*="好评"]',
    },
  ],
}
```

---

### 通知提示

**作用：** 自动关闭通知权限请求弹窗

**key:** 4

**典型表现：**
- 弹窗提示"是否允许发送通知"
- 包含"允许"、"拒绝"等按钮
- 部分应用首次启动时弹出

**配置建议：**
```typescript
{
  key: 4,
  name: '通知提示',
  desc: '关闭通知权限请求',
  fastQuery: true,
  actionMaximum: 1,
  resetMatch: 'app',
  rules: [
    {
      matches: '[text*="通知"][visibleToUser=true]',
    },
  ],
}
```

---

### 权限提示

**作用：** 自动关闭各种权限请求弹窗（定位、存储、相机等）

**key:** 5

**典型表现：**
- 系统权限弹窗"是否允许应用访问位置/存储/相机"
- 应用自定义权限请求弹窗
- 包含"允许"、"拒绝"、"仅在使用时允许"等按钮

**配置建议：**
```typescript
{
  key: 5,
  name: '权限提示',
  desc: '关闭权限请求弹窗',
  fastQuery: true,
  actionMaximum: 1,
  resetMatch: 'app',
  rules: [
    {
      matches: '[text*="权限" || text*="允许访问"]',
    },
  ],
}
```

**注意：** 系统权限弹窗可能需要无障碍权限才能操作

---

### 局部广告

**作用：** 关闭不影响使用的广告卡片及悬浮广告按钮

**key:** 6

**典型表现：**
- 信息流中的广告卡片（带"广告"标识）
- 搜索结果中的推广内容
- 页面角落的悬浮广告按钮
- 评论区的广告推荐

**配置建议：**
```typescript
{
  key: 6,
  name: '局部广告-信息流广告',
  desc: '点击关闭信息流广告',
  fastQuery: true,
  rules: [
    {
      key: 0,
      matches: '@[clickable=true] - [text*="广告"]',
    },
    {
      preKeys: [0],
      key: 90,
      matches: '[text*="不感兴趣"]',
    },
  ],
}
```

---

### 全屏广告

**作用：** 关闭阻碍用户操作的弹窗广告

**key:** 7

**典型表现：**
- 启动时弹出的全屏广告（非开屏广告）
- 使用过程中弹出的广告弹窗
- 必须关闭才能继续操作的广告
- 浮层广告覆盖在内容上方

**配置建议：**
```typescript
{
  key: 7,
  name: '全屏广告-弹窗广告',
  desc: '关闭弹窗广告',
  fastQuery: true,
  rules: [
    {
      matches: '[vid="close_btn" || vid="iv_close"]',
    },
  ],
}
```

---

### 分段广告

**作用：** 关闭需要多步操作才能关闭的广告

**key:** 8

**典型表现：**
- 需要点击关闭 → 再点击"不感兴趣"的广告
- 微信朋友圈广告（需长按 → 不感兴趣）
- 酷安帖子广告、贴吧帖子广告
- 操作过程可能造成屏幕闪烁

**配置建议：**
```typescript
{
  key: 8,
  name: '分段广告-信息流广告',
  desc: '点击关闭-点击不感兴趣',
  fastQuery: true,
  rules: [
    {
      key: 0,
      matches: '@[clickable=true] - [text*="广告"]',
    },
    {
      preKeys: [0],
      key: 1,
      matches: '@[clickable=true] > [text*="关闭"]',
    },
    {
      preKeys: [1],
      key: 90,
      matches: '[text*="不感兴趣" || text*="不想看到"]',
    },
  ],
}
```

---

### 功能类

**作用：** 自动执行某些功能操作（非广告相关）

**key:** 9+

**典型功能：**
- 自动签到（微博超话、贴吧等）
- 自动展开全文（知乎回答、文章等）
- 自动点击"展开更多"
- 自动切换到指定 Tab

**配置示例 - 自动签到：**
```typescript
{
  key: 90,
  name: '功能类-自动签到',
  rules: [
    {
      fastQuery: true,
      matches: [
        '[text="签到"][visibleToUser=true]',
        '[text="立即签到"][visibleToUser=true]',
      ],
    },
  ],
}
```

**配置示例 - 自动展开：**
```typescript
{
  key: 91,
  name: '功能类-自动展开回答',
  rules: [
    {
      fastQuery: true,
      matches: '[text="展开" || text="查看全文"][visibleToUser=true]',
    },
  ],
}
```

---

## 黑白名单机制

### 工作原理

```
全局规则
    │
    ▼
┌─────────────────────────────────────┐
│ 检查 disableIfAppGroupMatch         │
│ 应用是否有同名规则组？              │
└─────────────────────────────────────┘
    │                   │
   是                   否
    │                   │
    ▼                   ▼
禁用全局规则      ┌─────────────────┐
                  │ 检查黑白名单    │
                  └─────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
        白名单       不在名单      黑名单
          │            │            │
          ▼            ▼            ▼
       强制启用     正常生效      禁用规则
```

### 优先级

1. **白名单** > 黑名单：白名单中的应用强制启用规则
2. **黑名单**：禁用对应规则
3. **默认**：不在名单中的应用，全局规则正常生效

---

## 已配置的黑白名单

### 全局黑名单（blackListAppIDs）

以下应用禁用所有全局规则：

| 应用 | 包名 | 原因 |
|------|------|------|
| 微信 | com.tencent.mm | 有专属规则 |
| GKD | li.songe.gkd | 自身应用 |
| Telegram | org.telegram.messenger | 有专属规则 |
| Twitter/X | com.twitter.android | 有专属规则 |
| Instagram | com.instagram.android | 有专属规则 |
| Facebook | com.facebook.katana | 有专属规则 |
| Reddit | com.reddit.frontpage | 有专属规则 |
| Chrome | com.android.chrome | 浏览器 |
| Edge | com.microsoft.emmx | 浏览器 |
| 夸克 | com.quark.browser | 浏览器 |
| GitHub | com.github.android | 工具 |
| DeepSeek | com.deepseek.chat | AI |
| ChatGPT | com.openai.chatgpt | AI |
| Spotify | com.spotify.music | 音乐 |
| 支付宝 | com.eg.android.AlipayGphone | 支付 |
| MT管理器 | bin.mt.plus | 文件管理 |
| ZArchiver | ru.zdevs.zarchiver | 文件管理 |
| ES文件管理器 | com.estrongs.android.pop | 文件管理 |
| 迅雷 | com.xunlei.downloadprovider | 下载 |
| PikPak | com.pikcloud.pikpak | 下载 |
| Clash Meta | com.github.metacubex.clash.meta | VPN |
| v2ray | com.v2ray.bizer | VPN |
| Steam | com.valvesoftware.android.steam.community | 游戏 |
| Signal | org.thoughtcrime.securesms | 社交 |

### 开屏广告白名单

以下系统应用启用开屏广告规则：

| 应用 | 包名 |
|------|------|
| vivo 应用商店 | com.bbk.appstore |
| 黑鲨应用市场 | com.tencent.southpole.appstore |
| 一加浏览器 | com.heytap.browser |
| OPPO 主题商店 | com.heytap.themestore |
| vivo 主题商店 | com.bbk.theme |
| vivo 游戏中心 | com.vivo.game |
| 魅族视频 | com.meizu.media.video |
| 荣耀商城 | com.hihonor.vmall |
| 小米智能服务 | com.miui.systemAdSolution |

### 青少年模式黑名单

以下应用禁用青少年模式规则（避免误触）：

| 应用 | 包名 | 原因 |
|------|------|------|
| 网易云音乐 | com.netease.cloudmusic | 误触风险 |
| 知乎 | com.zhihu.android | 误触风险 |
| 汽水音乐 | com.luna.music | 误触风险 |
| 百度贴吧 | com.baidu.tieba | 误触风险 |
| 农业银行 | com.android.bankabc | 银行应用 |
| 高德地图 | com.autonavi.minimap | 出行应用 |
| 铁路12306 | com.MobileTicket | 出行应用 |
| 滴滴出行 | com.sdu.didi.psnger | 出行应用 |
| 美团 | com.sankuai.meituan | 生活服务 |
| 饿了么 | me.ele | 生活服务 |
| 淘宝 | com.taobao.taobao | 购物应用 |
| 闲鱼 | com.taobao.idlefish | 购物应用 |
| 京东 | com.jingdong.app.mall | 购物应用 |
| QQ | com.tencent.mobileqq | 社交应用 |
| 小红书 | com.xingin.xhs | 社交应用 |
| 酷安 | com.coolapk.market | 社交应用 |
| 钉钉 | com.alibaba.android.rimet | 办公应用 |

---

## 当前应用状态

### 已有专属规则（64个）

这些应用有独立的规则配置，全局规则会自动禁用：

**社交类：**
- 微信、QQ、微博、小红书、知乎、贴吧、豆瓣
- Soul、LOFTER、酷安、钉钉、企业微信、飞书、QQ空间
- 今日头条、百度搜索

**视频类：**
- B站、优酷、爱奇艺、腾讯视频、芒果TV
- 搜狐视频、咪咕视频、PPTV、斗鱼、央视频

**办公类：**
- WPS、腾讯文档、石墨文档、语雀、Flomo

**应用商店：**
- 小米、OPPO、vivo、华为、荣耀、三星、联想等

**其他：**
- 雪球、京东、淘宝、支付宝、喜马拉雅

### 在黑名单中（3个）

这些应用在全局黑名单中，所有全局规则禁用：
- 微信
- GKD
- 支付宝

---

## 相关文档

- [使用文档](./README.md)
- [配置参考](./CONFIG_REFERENCE.md)
- [快速入门](./QUICKSTART.md)
