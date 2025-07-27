#!/bin/bash

echo "========================================"
echo "   智慧蒙版產生器 2.0 啟動程式"
echo "========================================"
echo ""

# 檢查 Python 是否安裝
if ! command -v python3 &> /dev/null; then
    echo "[錯誤] 未檢測到 Python 3！"
    echo "請先安裝 Python 3.7 或以上版本"
    echo ""
    echo "安裝方法："
    echo "- macOS: brew install python3"
    echo "- Ubuntu/Debian: sudo apt-get install python3"
    echo "- Fedora: sudo dnf install python3"
    echo ""
    exit 1
fi

echo "[檢查] Python 已安裝"
python3 --version

echo ""
echo "[啟動] 正在啟動本地伺服器..."
echo ""

# 啟動伺服器
python3 server.py

echo ""
echo "[結束] 伺服器已關閉"