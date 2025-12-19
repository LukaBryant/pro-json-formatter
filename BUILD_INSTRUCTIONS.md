# ProJSON - macOS 桌面应用构建指南

## 📋 前置要求

### 1. 安装 Node.js

您需要先安装 Node.js（建议版本 18 或更高）。

**方法 1：使用 Homebrew（推荐）**
```bash
# 如果还没有安装 Homebrew，先安装它
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 使用 Homebrew 安装 Node.js
brew install node
```

**方法 2：从官网下载**
- 访问 https://nodejs.org/
- 下载 macOS 安装包（推荐 LTS 版本）
- 运行安装程序

### 2. 验证安装
```bash
node --version   # 应该显示 v18.x.x 或更高
npm --version    # 应该显示 9.x.x 或更高
```

---

## 🚀 构建步骤

安装好 Node.js 后，按照以下步骤构建 macOS 应用：

### 步骤 1：安装项目依赖
```bash
cd /Users/zhangyongqi/Downloads/pro-json-formatter
npm install
```

这将安装所有必需的包，包括：
- React 和相关库
- Vite（构建工具）
- Electron（桌面应用框架）
- electron-builder（打包工具）

**预计时间**：3-5 分钟（取决于网络速度）

### 步骤 2：构建 React 应用
```bash
npm run build
```

这会使用 Vite 将 React 应用构建为静态文件，输出到 `build/` 目录。

**预计时间**：30 秒 - 1 分钟

### 步骤 3：打包为 macOS 应用（生成 DMG）
```bash
npm run build:mac-dmg
```

这会执行以下操作：
1. 构建 React 应用
2. 使用 electron-builder 将应用打包为 .app 文件
3. 创建 DMG 安装包

**预计时间**：2-3 分钟

**输出文件位置**：
```
dist/
├── ProJSON.app              # macOS 应用程序
├── ProJSON-1.0.0.dmg        # DMG 安装包（可分发）
└── ProJSON-1.0.0-arm64.dmg  # ARM64 架构专用（Apple Silicon）
└── ProJSON-1.0.0-x64.dmg    # x64 架构专用（Intel Mac）
```

---

## 🎯 快速命令参考

| 命令 | 说明 |
|------|------|
| `npm install` | 安装所有依赖 |
| `npm run dev` | 开发模式（热重载） |
| `npm run build` | 仅构建 React 应用 |
| `npm run build:mac` | 构建 macOS .app 应用 |
| `npm run build:mac-dmg` | 构建 DMG 安装包 |

---

## 📦 应用体积说明

- **最终 DMG 大小**：约 150-200 MB
- **原因**：包含完整的 Chromium 浏览器引擎 + Node.js 运行时
- **这是 Electron 应用的正常体积**

---

## 🔧 开发模式（可选）

如果您想在开发模式下运行应用：

```bash
# 终端 1：启动 Vite 开发服务器
npm run dev:vite

# 终端 2（新窗口）：启动 Electron
npm run dev:electron
```

或使用一条命令同时启动：
```bash
npm run dev
```

---

## ⚠️ 常见问题

### 问题 1：依赖安装失败
```bash
# 尝试清理缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 2：构建失败 - 权限错误
```bash
# 确保有写入权限
chmod +x node_modules/.bin/*
```

### 问题 3：应用打开后无法使用
- 如果是第一次打开，macOS 会提示安全警告
- 解决方法：
  1. 右键点击应用
  2. 选择"打开"
  3. 在弹出的对话框中点击"打开"

### 问题 4：DMG 无法安装
如果需要分发给其他用户，建议申请 Apple Developer 账户进行代码签名。

---

## 📝 项目结构

```
pro-json-formatter/
├── main.js              # Electron 主进程
├── App.tsx              # React 主应用
├── components/          # React 组件
│   └── EditorPanel.tsx
├── vite.config.ts       # Vite 配置
├── package.json         # 项目配置和依赖
├── build/              # Vite 构建输出（生成）
└── dist/               # Electron 打包输出（生成）
```

---

## ✅ 完成！

构建完成后，您可以：

1. **直接运行**：双击 `dist/ProJSON.app`
2. **分发 DMG**：将 `dist/ProJSON-1.0.0.dmg` 发送给其他用户
3. **安装到应用程序文件夹**：拖动 .app 到 `/Applications/`

---

## 🎨 自定义图标（可选）

如果您想添加自定义应用图标：

1. 创建一个 1024x1024 的 PNG 图标
2. 使用在线工具转换为 .icns 格式（如 https://cloudconvert.com/png-to-icns）
3. 将 .icns 文件保存到 `assets/icon.icns`
4. 在 `package.json` 中添加：
   ```json
   "mac": {
     "icon": "assets/icon.icns",
     ...
   }
   ```
5. 重新构建应用

---

## 📞 需要帮助？

如果遇到问题，请检查：
- Node.js 版本是否正确（`node --version`）
- 所有依赖是否安装成功
- 是否有足够的磁盘空间（至少 500MB）
