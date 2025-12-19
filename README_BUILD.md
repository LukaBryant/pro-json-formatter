# ProJSON - 构建 macOS DMG 安装包

## 🚀 快速开始（3 步完成）

### 第 1 步：安装 Node.js

**如果您已经安装了 Node.js，请跳到第 2 步。**

```bash
# 使用 Homebrew 安装（推荐）
brew install node

# 或者从官网下载：https://nodejs.org/
```

### 第 2 步：运行构建脚本

```bash
# 进入项目目录
cd /Users/zhangyongqi/Downloads/pro-json-formatter

# 运行一键构建脚本
./build-dmg.sh
```

### 第 3 步：获取应用

构建完成后，在 `dist/` 目录中找到：
- ✅ **ProJSON.app** - 可直接运行的应用
- ✅ **ProJSON-1.0.0.dmg** - DMG 安装包

---

## 📋 详细说明

如果您想了解更多细节或遇到问题，请查看：
👉 **[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)** - 完整的构建指南

---

## ⚡ 命令速查

```bash
# 一键构建 DMG
./build-dmg.sh

# 或手动执行
npm install              # 安装依赖
npm run build           # 构建应用
npm run build:mac-dmg   # 打包 DMG
```

---

## 📦 最终产物

```
dist/
├── ProJSON.app                    # macOS 应用（约 150-200MB）
├── ProJSON-1.0.0.dmg             # 通用 DMG 安装包
├── ProJSON-1.0.0-arm64.dmg       # Apple Silicon 专用
└── ProJSON-1.0.0-x64.dmg         # Intel Mac 专用
```

---

## 🎯 使用方式

1. **运行应用**：双击 `ProJSON.app`
2. **安装应用**：将 `ProJSON.app` 拖到 `/Applications/` 文件夹
3. **分发应用**：将 `.dmg` 文件发送给其他用户

---

## ⚠️ 首次打开可能遇到的问题

如果 macOS 提示"无法打开，因为它来自身份不明的开发者"：

1. 右键点击应用
2. 选择"打开"
3. 在弹出的对话框中点击"打开"

---

## 🆘 需要帮助？

查看详细文档：[BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)
