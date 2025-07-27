// 多語言支持模組
const i18n = {
    currentLanguage: 'zh_TW',
    
    translations: {
        zh_TW: {
            app_title: "智慧蒙版產生器 2.0",
            image_control: "圖片控制",
            load_image_button: "載入圖片",
            resolution: "解析度",
            file_size: "檔案大小",
            canvas_ratio_label: "畫布比例",
            ratio_original: "原始尺寸",
            ratio_custom: "自訂",
            background_color_label: "背景預覽",
            bg_white: "白色",
            bg_black: "黑色",
            edit_options: "編輯選項",
            antialiasing_label: "邊緣抗鋸齒",
            canvas_info: "畫布資訊",
            coordinates_label: "座標",
            zoom_label: "縮放",
            output_label: "輸出管理",
            output_mask_button: "匯出純蒙版圖 (JPG)",
            output_combined_button: "匯出加白底原圖 (JPG)",
            drag_drop_hint: "拖曳 PNG 圖片到此處或點擊上方載入按鈕",
            help_instructions: "操作說明",
            processing: "處理中...",
            not_a_png_error_message: "請選擇 PNG 格式的圖片檔案。",
            no_image_loaded: "請先載入圖片。",
            export_success_message: "檔案已成功匯出：{path}",
            export_error: "匯出失敗，請重試。",
            help_content: `
                <h3>操作說明</h3>
                <ol>
                    <li><strong>載入圖片</strong>：點擊「載入圖片」按鈕或拖曳 PNG 檔案到預覽區。</li>
                    <li><strong>調整畫布</strong>：
                        <ul>
                            <li>使用滑鼠滾輪縮放圖片</li>
                            <li>按住左鍵拖曳移動圖片</li>
                            <li>使用右下角的控制按鈕快速操作</li>
                        </ul>
                    </li>
                    <li><strong>選擇比例</strong>：從下拉選單選擇預設比例或自訂尺寸。</li>
                    <li><strong>預覽效果</strong>：切換黑白背景查看不同效果。</li>
                    <li><strong>匯出圖片</strong>：
                        <ul>
                            <li>純蒙版圖：黑白剪影效果</li>
                            <li>加白底原圖：原圖加上白色背景</li>
                        </ul>
                    </li>
                </ol>
                <h3>快捷鍵</h3>
                <ul>
                    <li><kbd>+</kbd> / <kbd>-</kbd>：縮放圖片</li>
                    <li><kbd>Space</kbd>：重置視圖</li>
                    <li><kbd>Ctrl</kbd> + <kbd>S</kbd>：快速匯出</li>
                </ul>
            `
        },
        en_US: {
            app_title: "Smart Mask Generator 2.0",
            image_control: "Image Control",
            load_image_button: "Load Image",
            resolution: "Resolution",
            file_size: "File Size",
            canvas_ratio_label: "Canvas Ratio",
            ratio_original: "Original Size",
            ratio_custom: "Custom",
            background_color_label: "Background Preview",
            bg_white: "White",
            bg_black: "Black",
            edit_options: "Edit Options",
            antialiasing_label: "Anti-aliasing",
            canvas_info: "Canvas Info",
            coordinates_label: "Coordinates",
            zoom_label: "Zoom",
            output_label: "Output Management",
            output_mask_button: "Export Mask Only (JPG)",
            output_combined_button: "Export Original with White BG (JPG)",
            drag_drop_hint: "Drag & drop PNG image here or click load button above",
            help_instructions: "Instructions",
            processing: "Processing...",
            not_a_png_error_message: "Please select a PNG image file.",
            no_image_loaded: "Please load an image first.",
            export_success_message: "File exported successfully: {path}",
            export_error: "Export failed, please try again.",
            help_content: `
                <h3>Instructions</h3>
                <ol>
                    <li><strong>Load Image</strong>: Click "Load Image" button or drag & drop a PNG file to the preview area.</li>
                    <li><strong>Adjust Canvas</strong>:
                        <ul>
                            <li>Use mouse wheel to zoom</li>
                            <li>Hold left button to drag and move image</li>
                            <li>Use control buttons at bottom right for quick actions</li>
                        </ul>
                    </li>
                    <li><strong>Select Ratio</strong>: Choose a preset ratio from dropdown or set custom dimensions.</li>
                    <li><strong>Preview Effect</strong>: Toggle between black and white backgrounds to see different effects.</li>
                    <li><strong>Export Image</strong>:
                        <ul>
                            <li>Mask Only: Black and white silhouette effect</li>
                            <li>Original with White BG: Original image with white background</li>
                        </ul>
                    </li>
                </ol>
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li><kbd>+</kbd> / <kbd>-</kbd>: Zoom in/out</li>
                    <li><kbd>Space</kbd>: Reset view</li>
                    <li><kbd>Ctrl</kbd> + <kbd>S</kbd>: Quick export</li>
                </ul>
            `
        }
    },
    
    setLanguage(lang) {
        this.currentLanguage = lang;
    },
    
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en_US[key] || key;
    },
    
    updateUI() {
        // 更新所有具有 data-i18n 屬性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (key === 'help_content') {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // 更新文檔標題
        document.title = this.t('app_title');
    }
};