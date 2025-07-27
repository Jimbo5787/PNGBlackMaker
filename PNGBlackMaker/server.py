import http.server
import socketserver
import webbrowser
import os
import signal
import sys
from threading import Timer

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # 添加 CORS 和其他必要的標頭
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        # 自定義日誌格式
        print(f"[{self.log_date_time_string()}] {format%args}")

def signal_handler(sig, frame):
    print('\n正在關閉伺服器...')
    sys.exit(0)

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

def main():
    # 設定信號處理
    signal.signal(signal.SIGINT, signal_handler)
    
    # 切換到腳本目錄
    os.chdir(DIRECTORY)
    
    # 創建伺服器
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("智慧蒙版產生器 2.0 - 本地網頁伺服器")
        print("=" * 60)
        print(f"伺服器運行在: http://localhost:{PORT}")
        print("按 Ctrl+C 停止伺服器")
        print("=" * 60)
        
        # 1秒後自動開啟瀏覽器
        Timer(1.0, open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.shutdown()

if __name__ == "__main__":
    main()