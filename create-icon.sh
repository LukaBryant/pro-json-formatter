#!/bin/bash

# 创建一个简单的 ProJSON 图标
# 使用 ImageMagick 或系统工具创建图标

# 检查是否有 sips（macOS 自带工具）
if command -v sips &> /dev/null; then
    echo "使用 macOS sips 工具创建图标..."
    
    # 创建临时的 iconset 目录
    mkdir -p assets/icon.iconset
    
    # 创建一个简单的 1024x1024 PNG 图标（使用 base64 编码的简单图标）
    cat > assets/icon-1024.png << 'EOL'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
EOL
    
    echo "请手动创建图标："
    echo "1. 在 assets 目录下创建一个名为 icon.png 的 1024x1024 图标"
    echo "2. 或使用在线工具生成图标"
    echo ""
    echo "临时方案：我们将使用默认的 Electron 图标"
    
else
    echo "未找到图标创建工具"
    echo "建议在 assets/icon.png 放置一个 1024x1024 的图标"
fi
