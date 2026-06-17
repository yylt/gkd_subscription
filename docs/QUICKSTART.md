# 快速入门

## 5 分钟上手

### 1. 安装环境

```bash
# 安装 Node.js 22+ 和 pnpm
# https://nodejs.org
# https://pnpm.io/installation

# 验证版本
node -v  # >= 22
pnpm -v  # >= 9
```

### 2. 初始化项目

```bash
git clone <your-repo>
cd gkd_subscription
pnpm install
```

### 3. 添加应用规则

在 `src/apps/` 下创建 `com.example.app.ts`：

```typescript
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.example.app',
  name: '示例应用',
  groups: [
    {
      key: -1,
      name: '开屏广告',
      matchTime: 10000,
      actionMaximum: 1,
      resetMatch: 'app',
      rules: [
        {
          fastQuery: true,
          matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
        },
      ],
    },
  ],
});
```

### 4. 构建订阅

```bash
pnpm build
```

生成文件：`dist/gkd.json5`

### 5. 在 GKD 中使用

1. 打开 GKD → 订阅 → 添加订阅
2. 输入地址：`https://raw.githubusercontent.com/<user>/<repo>/main/dist/gkd.json5`
3. 开启订阅

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装依赖 |
| `pnpm build` | 构建订阅 |
| `pnpm check` | 类型检查 |
| `pnpm format` | 格式化代码 |
| `pnpm lint` | 代码检查 |

---

## 规则速查

### 开屏广告模板

```typescript
{
  key: -1,
  name: '开屏广告',
  matchTime: 10000,
  actionMaximum: 1,
  resetMatch: 'app',
  priorityTime: 10000,
  rules: [
    {
      fastQuery: true,
      matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
    },
  ],
}
```

### 信息流广告模板

```typescript
{
  key: 6,
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
      key: 90,
      matches: '[text*="不感兴趣"]',
    },
  ],
}
```

### 弹窗广告模板

```typescript
{
  key: 7,
  name: '全屏广告-弹窗广告',
  fastQuery: true,
  rules: [
    {
      matches: '[vid="close_btn" || vid="iv_close"]',
    },
  ],
}
```

---

## 调试技巧

1. **开启快照**：GKD 设置 → 规则快照 → 开启
2. **查看日志**：GKD 设置 → 日志 → 查看匹配情况
3. **测试规则**：编写规则后先在本地测试，确认无误再提交

---

## 更多资料

- [完整文档](./README.md)
- [配置参考](./CONFIG_REFERENCE.md)
- [GKD 官方文档](https://gkd-kit.gitee.io/)
