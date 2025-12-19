#!/bin/bash

# ProJSON macOS 应用构建脚本
# 这个脚本会自动构建并打包 macOS DMG 安装包

set -e  # 遇到错误立即退出

echo "======================================"
echo "  ProJSON macOS 应用构建脚本"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo ""
    echo "请先安装 Node.js："
    echo "  方法 1：brew install node"
    echo "  方法 2：访问 https://nodejs.org/ 下载安装"
    echo ""
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
    echo ""
else
    echo "✅ 依赖已安装"
    echo ""
fi

# 构建 React 应用
echo "🔨 构建 React 应用..."
npm run build
echo ""

# 打包为 macOS 应用
echo "📦 打包为 macOS 应用和 DMG..."
npm run build:mac-dmg
echo ""

# 显示结果
echo "======================================"
echo "  ✅ 构建完成！"
echo "======================================"
echo ""
echo "生成的文件："
ls -lh dist/*.dmg dist/*.app 2>/dev/null || ls -lh dist/mac*/*.app 2>/dev/null
echo ""
echo "📂 文件位置："
echo "   $(pwd)/dist/"
echo ""
echo "🎉 您可以："
echo "   1. 运行应用：双击 ProJSON.app"
echo "   2. 安装应用：拖动到 /Applications/ 文件夹"
echo "   3. 分发 DMG：将 .dmg 文件发送给其他用户"
echo ""
