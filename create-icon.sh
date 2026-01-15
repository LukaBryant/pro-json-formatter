#!/bin/bash

# ProJSON 图标生成脚本
# 该脚本帮助您从 assets/logo.svg 生成 macOS 所需的图标格式

LOGO_SVG="assets/logo.svg"
ICON_PNG="assets/icon.png"
ICON_ICNS="assets/icon.icns"

echo "=== ProJSON 图标生成工具 ==="

if [ ! -f "$LOGO_SVG" ]; then
    echo "错误: 未找到 $LOGO_SVG"
    exit 1
fi

echo "1. 已为您生成了渐变色 'Json' Logo: $LOGO_SVG"
echo "2. 请使用以下任一方式将其转换为 1024x1024 的 PNG 文件，并保存为 $ICON_PNG:"
echo "   - 在浏览器中打开 $LOGO_SVG 并截图或保存"
echo "   - 使用在线工具 (如 https://svgtopng.com/)"
echo "   - 如果安装了 rsvg-convert: rsvg-convert -w 1024 -h 1024 $LOGO_SVG -o $ICON_PNG"
echo ""

if [ -f "$ICON_PNG" ]; then
    echo "检测到 $ICON_PNG，正在生成 macOS .icns 图标..."
    
    # 创建 iconset
    ICONSET="assets/icon.iconset"
    mkdir -p "$ICONSET"
    
    # 使用 sips 生成不同尺寸的图片
    sips -z 16 16     "$ICON_PNG" --out "$ICONSET/icon_16x16.png"
    sips -z 32 32     "$ICON_PNG" --out "$ICONSET/icon_16x16@2x.png"
    sips -z 32 32     "$ICON_PNG" --out "$ICONSET/icon_32x32.png"
    sips -z 64 64     "$ICON_PNG" --out "$ICONSET/icon_32x32@2x.png"
    sips -z 128 128   "$ICON_PNG" --out "$ICONSET/icon_128x128.png"
    sips -z 256 256   "$ICON_PNG" --out "$ICONSET/icon_128x128@2x.png"
    sips -z 256 256   "$ICON_PNG" --out "$ICONSET/icon_256x256.png"
    sips -z 512 512   "$ICON_PNG" --out "$ICONSET/icon_256x256@2x.png"
    sips -z 512 512   "$ICON_PNG" --out "$ICONSET/icon_512x512.png"
    cp "$ICON_PNG" "$ICONSET/icon_512x512@2x.png"
    
    # 转换为 icns
    iconutil -c icns "$ICONSET" -o "$ICON_ICNS"
    
    # 清理
    rm -rf "$ICONSET"
    
    echo "成功! 已生成 $ICON_ICNS"
    echo "现在构建应用时，electron-builder 将自动使用该图标。"
else
    echo "提示: 一旦您准备好了 1024x1024 的 $ICON_PNG，请再次运行此脚本以生成 .icns 文件。"
fi
