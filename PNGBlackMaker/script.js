// 主要應用程式類別
class SmartMaskGenerator {
    constructor() {
        // 狀態變數
        this.originalImage = null;
        this.imageData = null;
        this.canvas = document.getElementById('previewCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.zoomLevel = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.currentLanguage = 'zh_TW';
        this.antialiasing = true;
        this.bgColor = 'white';
        this.ratio = 'original';
        this.customWidth = 800;
        this.customHeight = 600;
        
        // 初始化
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.updateUI();
    }
    
    initializeElements() {
        // 獲取所有需要的元素
        this.elements = {
            imageInput: document.getElementById('imageInput'),
            imageInfo: document.getElementById('imageInfo'),
            imageResolution: document.getElementById('imageResolution'),
            imageSize: document.getElementById('imageSize'),
            ratioSelect: document.getElementById('ratioSelect'),
            customSizeInputs: document.getElementById('customSizeInputs'),
            customWidth: document.getElementById('customWidth'),
            customHeight: document.getElementById('customHeight'),
            bgColorRadios: document.querySelectorAll('input[name="bgColor"]'),
            antialiasing: document.getElementById('antialiasing'),
            coordinates: document.getElementById('coordinates'),
            zoomLevel: document.getElementById('zoomLevel'),
            exportMaskBtn: document.getElementById('exportMaskBtn'),
            exportCombinedBtn: document.getElementById('exportCombinedBtn'),
            themeToggle: document.getElementById('themeToggle'),
            langToggle: document.getElementById('langToggle'),
            langDropdown: document.getElementById('langDropdown'),
            helpBtn: document.getElementById('helpBtn'),
            helpModal: document.getElementById('helpModal'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            placeholder: document.getElementById('placeholder'),
            canvasWrapper: document.getElementById('canvasWrapper'),
            zoomInBtn: document.getElementById('zoomInBtn'),
            zoomOutBtn: document.getElementById('zoomOutBtn'),
            resetBtn: document.getElementById('resetBtn')
        };
    }
    
    bindEvents() {
        // 圖片載入
        this.elements.imageInput.addEventListener('change', (e) => this.handleImageLoad(e));
        
        // 拖放功能
        this.elements.canvasWrapper.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.canvasWrapper.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.elements.canvasWrapper.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Canvas 互動
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
        
        // 觸控支援
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleTouchEnd());
        
        // 控制項
        this.elements.ratioSelect.addEventListener('change', () => this.handleRatioChange());
        this.elements.customWidth.addEventListener('input', () => this.updateCustomSize());
        this.elements.customHeight.addEventListener('input', () => this.updateCustomSize());
        this.elements.bgColorRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateBackground());
        });
        this.elements.antialiasing.addEventListener('change', () => this.updateAntialiasing());
        
        // 匯出按鈕
        this.elements.exportMaskBtn.addEventListener('click', () => this.exportImage('mask'));
        this.elements.exportCombinedBtn.addEventListener('click', () => this.exportImage('combined'));
        
        // UI 控制
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.elements.langToggle.addEventListener('click', () => this.toggleLanguageDropdown());
        this.elements.langDropdown.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        this.elements.closeHelpBtn.addEventListener('click', () => this.hideHelp());
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) this.hideHelp();
        });
        
        // 縮放控制按鈕
        this.elements.zoomInBtn.addEventListener('click', () => this.zoom(1.2));
        this.elements.zoomOutBtn.addEventListener('click', () => this.zoom(0.8));
        this.elements.resetBtn.addEventListener('click', () => this.resetView());
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 視窗調整
        window.addEventListener('resize', () => this.handleResize());
    }
    
    loadSettings() {
        // 從 localStorage 載入設定
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'zh_TW';
        
        document.body.setAttribute('data-theme', savedTheme);
        this.currentLanguage = savedLanguage;
        
        // 更新主題圖標
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    updateUI() {
        // 更新語言
        i18n.setLanguage(this.currentLanguage);
        i18n.updateUI();
        
        // 更新語言按鈕文字
        const langText = this.elements.langToggle.querySelector('.lang-text');
        langText.textContent = this.currentLanguage === 'zh_TW' ? '繁體中文' : 'English';
        
        // 更新其他 UI 狀態
        this.updateCoordinates();
        this.updateZoomDisplay();
    }
    
    handleImageLoad(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadImageFile(file);
        }
    }
    
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.elements.canvasWrapper.classList.add('drag-over');
    }
    
    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.elements.canvasWrapper.classList.remove('drag-over');
    }
    
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.elements.canvasWrapper.classList.remove('drag-over');
        
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'image/png') {
            this.loadImageFile(files[0]);
        }
    }
    
    loadImageFile(file) {
        if (file.type !== 'image/png') {
            alert(i18n.t('not_a_png_error_message'));
            return;
        }
        
        this.showLoading();
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.displayImageInfo(file, img);
                this.resetView();
                this.render();
                this.hideLoading();
                this.elements.placeholder.style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    displayImageInfo(file, img) {
        this.elements.imageInfo.style.display = 'block';
        this.elements.imageResolution.textContent = `${img.width} × ${img.height}`;
        this.elements.imageSize.textContent = this.formatFileSize(file.size);
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    handleRatioChange() {
        this.ratio = this.elements.ratioSelect.value;
        const showCustom = this.ratio === 'custom';
        this.elements.customSizeInputs.style.display = showCustom ? 'block' : 'none';
        
        if (!showCustom && this.originalImage) {
            this.render();
        }
    }
    
    updateCustomSize() {
        this.customWidth = parseInt(this.elements.customWidth.value) || 800;
        this.customHeight = parseInt(this.elements.customHeight.value) || 600;
        if (this.originalImage) {
            this.render();
        }
    }
    
    updateBackground() {
        this.bgColor = document.querySelector('input[name="bgColor"]:checked').value;
        if (this.originalImage) {
            this.render();
        }
    }
    
    updateAntialiasing() {
        this.antialiasing = this.elements.antialiasing.checked;
        this.ctx.imageSmoothingEnabled = this.antialiasing;
        this.ctx.imageSmoothingQuality = 'high';
        if (this.originalImage) {
            this.render();
        }
    }
    
    getTargetDimensions() {
        if (!this.originalImage) return { width: 800, height: 600 };
        
        const imgWidth = this.originalImage.width;
        const imgHeight = this.originalImage.height;
        
        switch (this.ratio) {
            case 'original':
                return { width: imgWidth, height: imgHeight };
            case '16:9':
                return this.calculateRatioDimensions(16, 9, imgWidth, imgHeight);
            case '9:16':
                return this.calculateRatioDimensions(9, 16, imgWidth, imgHeight);
            case '4:3':
                return this.calculateRatioDimensions(4, 3, imgWidth, imgHeight);
            case '3:4':
                return this.calculateRatioDimensions(3, 4, imgWidth, imgHeight);
            case 'custom':
                return { width: this.customWidth, height: this.customHeight };
            default:
                return { width: imgWidth, height: imgHeight };
        }
    }
    
    calculateRatioDimensions(ratioW, ratioH, imgW, imgH) {
        const baseSize = Math.max(imgW, imgH);
        if (imgW > imgH) {
            return { width: baseSize, height: Math.round(baseSize * ratioH / ratioW) };
        } else {
            return { width: Math.round(baseSize * ratioW / ratioH), height: baseSize };
        }
    }
    
    render() {
        if (!this.originalImage) return;
        
        const target = this.getTargetDimensions();
        this.canvas.width = target.width;
        this.canvas.height = target.height;
        
        // 清除畫布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 設定背景
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 計算圖片位置和大小
        const imgWidth = this.originalImage.width * this.zoomLevel;
        const imgHeight = this.originalImage.height * this.zoomLevel;
        const x = (this.canvas.width - imgWidth) / 2 + this.panX;
        const y = (this.canvas.height - imgHeight) / 2 + this.panY;
        
        // 設定抗鋸齒
        this.ctx.imageSmoothingEnabled = this.antialiasing;
        this.ctx.imageSmoothingQuality = 'high';
        
        // 如果是黑色背景預覽，顯示蒙版效果
        if (this.bgColor === 'black') {
            // 創建臨時 canvas 來處理蒙版
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;
            
            // 填充白色背景
            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // 繪製黑色前景
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.fillStyle = 'black';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // 使用原圖的 alpha 通道作為遮罩
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(this.originalImage, x, y, imgWidth, imgHeight);
            
            // 將結果繪製到主 canvas
            this.ctx.drawImage(tempCanvas, 0, 0);
        } else {
            // 正常顯示原圖
            this.ctx.drawImage(this.originalImage, x, y, imgWidth, imgHeight);
        }
        
        // 繪製裁切框（如果不是原始尺寸）
        if (this.ratio !== 'original') {
            this.drawCropBorder();
        }
    }
    
    drawCropBorder() {
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.setLineDash([]);
    }
    
    handleMouseDown(event) {
        if (!this.originalImage) return;
        this.isDragging = true;
        this.dragStartX = event.clientX - this.panX;
        this.dragStartY = event.clientY - this.panY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.round(event.clientX - rect.left);
        const y = Math.round(event.clientY - rect.top);
        this.updateCoordinates(x, y);
        
        if (this.isDragging && this.originalImage) {
            this.panX = event.clientX - this.dragStartX;
            this.panY = event.clientY - this.dragStartY;
            this.render();
        }
    }
    
    handleMouseUp() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }
    
    handleWheel(event) {
        if (!this.originalImage) return;
        event.preventDefault();
        
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(delta);
    }
    
    handleTouchStart(event) {
        if (!this.originalImage) return;
        event.preventDefault();
        
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.isDragging = true;
            this.dragStartX = touch.clientX - this.panX;
            this.dragStartY = touch.clientY - this.panY;
        }
    }
    
    handleTouchMove(event) {
        if (!this.originalImage) return;
        event.preventDefault();
        
        if (event.touches.length === 1 && this.isDragging) {
            const touch = event.touches[0];
            this.panX = touch.clientX - this.dragStartX;
            this.panY = touch.clientY - this.dragStartY;
            this.render();
        }
    }
    
    handleTouchEnd() {
        this.isDragging = false;
    }
    
    zoom(factor) {
        if (!this.originalImage) return;
        
        const newZoom = this.zoomLevel * factor;
        if (newZoom >= 0.1 && newZoom <= 5) {
            this.zoomLevel = newZoom;
            this.updateZoomDisplay();
            this.render();
        }
    }
    
    resetView() {
        this.zoomLevel = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.updateZoomDisplay();
        this.updateCoordinates();
        if (this.originalImage) {
            this.render();
        }
    }
    
    updateCoordinates(x = 0, y = 0) {
        this.elements.coordinates.textContent = `(${x}, ${y})`;
    }
    
    updateZoomDisplay() {
        this.elements.zoomLevel.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    
    exportImage(mode) {
        if (!this.originalImage) {
            alert(i18n.t('no_image_loaded'));
            return;
        }
        
        this.showLoading();
        
        setTimeout(() => {
            try {
                const target = this.getTargetDimensions();
                const exportCanvas = document.createElement('canvas');
                const exportCtx = exportCanvas.getContext('2d');
                exportCanvas.width = target.width;
                exportCanvas.height = target.height;
                
                // 填充白色背景
                exportCtx.fillStyle = 'white';
                exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                
                // 計算圖片位置
                const imgWidth = this.originalImage.width * this.zoomLevel;
                const imgHeight = this.originalImage.height * this.zoomLevel;
                const x = (exportCanvas.width - imgWidth) / 2 + this.panX;
                const y = (exportCanvas.height - imgHeight) / 2 + this.panY;
                
                // 設定抗鋸齒
                exportCtx.imageSmoothingEnabled = this.antialiasing;
                exportCtx.imageSmoothingQuality = 'high';
                
                if (mode === 'mask') {
                    // 創建蒙版
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = exportCanvas.width;
                    tempCanvas.height = exportCanvas.height;
                    
                    // 填充白色背景
                    tempCtx.fillStyle = 'white';
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    
                    // 繪製黑色前景，使用原圖 alpha 作為遮罩
                    tempCtx.globalCompositeOperation = 'source-over';
                    tempCtx.fillStyle = 'black';
                    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                    
                    tempCtx.globalCompositeOperation = 'destination-in';
                    tempCtx.drawImage(this.originalImage, x, y, imgWidth, imgHeight);
                    
                    // 將蒙版繪製到匯出 canvas
                    exportCtx.drawImage(tempCanvas, 0, 0);
                } else {
                    // 繪製原圖
                    exportCtx.drawImage(this.originalImage, x, y, imgWidth, imgHeight);
                }
                
                // 轉換為 blob 並下載
                exportCanvas.toBlob((blob) => {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                    const filename = `mask_${mode}_${timestamp}.jpg`;
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                    URL.revokeObjectURL(link.href);
                    this.hideLoading();
                    
                    // 顯示成功訊息
                    this.showMessage(i18n.t('export_success_message').replace('{path}', filename));
                }, 'image/jpeg', 1.0);
            } catch (error) {
                console.error('Export error:', error);
                this.hideLoading();
                alert(i18n.t('export_error'));
            }
        }, 100);
    }
    
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 更新圖標
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    toggleLanguageDropdown() {
        this.elements.langDropdown.classList.toggle('show');
    }
    
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        this.elements.langDropdown.classList.remove('show');
        this.updateUI();
    }
    
    showHelp() {
        this.elements.helpModal.classList.add('show');
    }
    
    hideHelp() {
        this.elements.helpModal.classList.remove('show');
    }
    
    showLoading() {
        this.elements.loadingOverlay.classList.add('show');
    }
    
    hideLoading() {
        this.elements.loadingOverlay.classList.remove('show');
    }
    
    showMessage(message) {
        // 創建臨時訊息元素
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-color);
            color: white;
            padding: 12px 24px;
            border-radius: var(--border-radius-sm);
            box-shadow: 0 4px 12px var(--shadow-color);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
    
    handleKeyboard(event) {
        if (!this.originalImage) return;
        
        switch (event.key) {
            case '+':
            case '=':
                event.preventDefault();
                this.zoom(1.2);
                break;
            case '-':
            case '_':
                event.preventDefault();
                this.zoom(0.8);
                break;
            case ' ':
                event.preventDefault();
                this.resetView();
                break;
            case 's':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.exportImage('combined');
                }
                break;
        }
    }
    
    handleResize() {
        if (this.originalImage) {
            this.render();
        }
    }
}

// 初始化應用程式
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SmartMaskGenerator();
});

// 防止整個頁面的拖放行為
document.addEventListener('dragover', (e) => {
    if (e.target.id !== 'canvasWrapper' && !e.target.closest('#canvasWrapper')) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (e.target.id !== 'canvasWrapper' && !e.target.closest('#canvasWrapper')) {
        e.preventDefault();
    }
});