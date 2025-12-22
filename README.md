# ProJSON - 专业 JSON 格式化工具

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg?logo=react)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848f.svg?logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6.svg?logo=typescript)

### 🚀 强大的 JSON 编辑器和格式化工具 | macOS 原生桌面应用

[English](#english) | [中文](#chinese)

</div>

---

<a name="chinese"></a>

## 📖 简介

**ProJSON** 是一款功能强大的 JSON 格式化和编辑工具，专为 macOS 打造。采用现代化的技术栈构建，提供流畅的用户体验和丰富的功能特性。无论是格式化、压缩还是对比 JSON 数据，ProJSON 都能轻松胜任。

## ✨ 核心功能

### 🎯 主要特性

- **🔍 JSON 格式化** - 一键美化 JSON 数据，提升可读性
- **📦 JSON 压缩** - 快速压缩 JSON 为单行格式
- **🔄 JSON 比较** - 并排对比两个 JSON 对象的差异
- **✅ 实时验证** - 即时检测 JSON 语法错误
- **🎨 主题切换** - 支持亮色/暗色主题
- **⌨️ 全局快捷键** - 提升工作效率的键盘快捷键
- **💾 自动同步** - 输入输出双向实时同步

### 🎨 界面特性

- 🖥️ **原生 macOS 体验** - 完美融入 macOS 系统
- 📝 **Monaco 编辑器** - 使用 VS Code 同款编辑器
- 🎭 **优雅的 UI 设计** - 现代化、简洁的用户界面
- 📱 **响应式布局** - 适配不同屏幕尺寸
- 🔧 **侧边栏导航** - 快速切换不同工具模式
- 📊 **状态栏显示** - 实时显示字符数和验证状态

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd + F` | 格式化 JSON |
| `Cmd + M` | 压缩 JSON |
| `Cmd + D` | 切换格式化/比较模式 |
| `Cmd + T` | 切换深色/浅色主题 |
| `Cmd + ,` | 打开快捷键帮助 |

## 🛠️ 技术栈

- **前端框架**: React 18.2.0 + TypeScript 5.3.3
- **桌面框架**: Electron 28.0.0
- **构建工具**: Vite 5.0.8
- **编辑器**: Monaco Editor 4.7.0
- **图标库**: Lucide React 0.562.0
- **打包工具**: Electron Builder 24.9.1

## 🚀 快速开始

### 前置要求

- **Node.js** 18.x 或更高版本
- **npm** 9.x 或更高版本
- **macOS** 操作系统

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/LukaBryant/pro-json-formatter.git

# 进入项目目录
cd pro-json-formatter

# 安装依赖
npm install
```

### 开发模式

```bash
# 启动开发服务器（Vite + Electron）
npm run dev

# 或分别启动
npm run dev:vite      # 启动 Vite 开发服务器
npm run dev:electron  # 启动 Electron
```

### 构建应用

```bash
# 构建 React 应用
npm run build

# 打包为 macOS 应用
npm run build:mac

# 打包为 DMG 安装包
npm run build:mac-dmg
```

构建完成后，应用文件位于 `dist/` 目录：
- `ProJSON.app` - macOS 应用程序
- `ProJSON-1.0.0.dmg` - 通用 DMG 安装包
- `ProJSON-1.0.0-arm64.dmg` - Apple Silicon (M1/M2) 专用
- `ProJSON-1.0.0-x64.dmg` - Intel Mac 专用

## 📁 项目结构

```
pro-json-formatter/
├── main.js                   # Electron 主进程入口
├── App.tsx                   # React 应用主组件
├── index.tsx                 # React 应用入口
├── index.html                # HTML 模板
├── types.ts                  # TypeScript 类型定义
├── vite.config.ts            # Vite 配置文件
├── tsconfig.json             # TypeScript 配置
├── package.json              # 项目配置和依赖
│
├── components/               # React 组件
│   ├── EditorPanel.tsx      # 编辑器面板组件
│   ├── Sidebar.tsx          # 侧边栏导航组件
│   ├── ComparisonTool.tsx   # JSON 比较工具组件
│   └── HotkeyModal.tsx      # 快捷键帮助弹窗
│
├── build/                    # Vite 构建输出（自动生成）
└── dist/                     # Electron 打包输出（自动生成）
```

## 🎯 使用场景

- **开发调试** - 快速格式化和验证 API 响应数据
- **数据分析** - 清晰展示复杂的 JSON 结构
- **配置管理** - 编辑和验证 JSON 配置文件
- **数据对比** - 比较不同版本的 JSON 数据差异
- **代码审查** - 美化 JSON 数据，提升可读性

## 📋 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发模式（Vite + Electron） |
| `npm run dev:vite` | 仅启动 Vite 开发服务器 |
| `npm run dev:electron` | 仅启动 Electron 窗口 |
| `npm run build` | 构建 React 应用到 build/ 目录 |
| `npm run build:mac` | 打包为 macOS .app 应用 |
| `npm run build:mac-dmg` | 打包为 DMG 安装包 |
| `npm run package` | 打包应用（同 build:mac） |

## 🔧 配置说明

### Electron Builder 配置

应用打包配置位于 `package.json` 的 `build` 字段：

```json
{
  "build": {
    "appId": "com.projson.formatter",
    "productName": "ProJSON",
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": ["dmg"]
    }
  }
}
```

### Vite 配置

构建配置位于 `vite.config.ts`，包含 React 插件和输出目录设置。

## 🐛 常见问题

### Q: 安装依赖时遇到错误？
```bash
# 清理缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

### Q: 构建失败？
确保：
- Node.js 版本 >= 18.x
- 有足够的磁盘空间（至少 500MB）
- 已正确安装所有依赖

### Q: macOS 提示"无法打开应用"？
首次打开时：
1. 右键点击应用
2. 选择"打开"
3. 在弹出对话框中点击"打开"

### Q: 应用体积为什么这么大？
Electron 应用包含完整的 Chromium 引擎和 Node.js 运行时，这是正常现象（约 150-200MB）。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- **GitHub**: [LukaBryant/pro-json-formatter](https://github.com/LukaBryant/pro-json-formatter)

---

<a name="english"></a>

## 📖 Introduction (English)

**ProJSON** is a powerful JSON formatting and editing tool designed specifically for macOS. Built with modern technology stack, it provides smooth user experience and rich features. Whether formatting, compressing, or comparing JSON data, ProJSON handles it all with ease.

## ✨ Key Features

- **🔍 JSON Formatting** - Beautify JSON data with one click
- **📦 JSON Compression** - Quickly minify JSON to single line
- **🔄 JSON Comparison** - Side-by-side diff of two JSON objects
- **✅ Real-time Validation** - Instant JSON syntax error detection
- **🎨 Theme Toggle** - Support for light/dark themes
- **⌨️ Global Shortcuts** - Keyboard shortcuts for efficiency
- **💾 Auto Sync** - Real-time bidirectional synchronization

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **macOS** operating system

### Installation

```bash
# Clone the repository
git clone https://github.com/LukaBryant/pro-json-formatter.git

# Navigate to project directory
cd pro-json-formatter

# Install dependencies
npm install
```

### Development

```bash
# Start development mode
npm run dev
```

### Build

```bash
# Build for macOS
npm run build:mac-dmg
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Cmd + F` | Format JSON |
| `Cmd + M` | Minify JSON |
| `Cmd + D` | Toggle Formatter/Comparison mode |
| `Cmd + T` | Toggle Light/Dark theme |
| `Cmd + ,` | Open Shortcuts Help |

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **Desktop**: Electron 28
- **Build Tool**: Vite 5
- **Editor**: Monaco Editor
- **Icons**: Lucide React

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for JSON developers

⭐ **如果这个项目对你有帮助，请给它一个星标！** ⭐

</div>
