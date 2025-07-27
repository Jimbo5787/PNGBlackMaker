# Smart Mask Generator 2.0

> A professional web-based image mask generation tool for creating high-quality silhouettes from PNG images.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

## Overview

Smart Mask Generator 2.0 is a modern web application designed to convert PNG images with transparent backgrounds into professional mask silhouettes. Built with vanilla JavaScript and HTML5 Canvas API, it provides a fast, secure, and user-friendly experience for mask generation.

## Features

### Core Functionality
- **PNG to Mask Conversion**: Convert transparent PNG images to black/white mask silhouettes
- **Dual Export Modes**: Export as pure mask or original image with white background
- **Real-time Preview**: Instant preview with black/white background switching
- **Canvas Manipulation**: Zoom, pan, and reset view controls

### User Experience
- **Drag & Drop Support**: Simply drag PNG files to the canvas area
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Theme Support**: Light and dark theme with automatic preference saving
- **Multilingual**: English and Traditional Chinese interface
- **Keyboard Shortcuts**: Professional hotkeys for efficient workflow

### Technical Features
- **Client-side Processing**: All image processing happens locally for privacy
- **High Performance**: Canvas API optimization for smooth real-time rendering
- **Multiple Aspect Ratios**: 16:9, 9:16, 4:3, 3:4, and custom dimensions
- **Anti-aliasing**: Optional edge smoothing for professional results

## Quick Start

### Prerequisites
- **Python 3.7+** (for local server)
- **Modern Browser** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Installation & Launch

#### Windows
1. Double-click `start.bat`
2. Browser will automatically open to `http://localhost:8080`

#### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

#### Manual Start
```bash
python3 server.py
# Open http://localhost:8080 in your browser
```

## Usage Guide

### Basic Workflow
1. **Load Image**: Click "Load Image" or drag a PNG file to the canvas
2. **Adjust View**: Use mouse wheel to zoom, drag to pan
3. **Set Dimensions**: Choose aspect ratio or set custom dimensions
4. **Preview**: Toggle background color to preview effects
5. **Export**: Choose between mask-only or original+background export

### Keyboard Shortcuts
| Key | Action |
|-----|---------|
| `+` / `-` | Zoom in/out |
| `Space` | Reset view |
| `Ctrl+S` | Quick export |
| `Esc` | Close dialogs |

### Export Options
- **Pure Mask**: Black silhouette on white background (JPG)
- **Original + White BG**: Original image with white background (JPG)

## Technical Architecture

### Frontend Stack
- **HTML5**: Semantic markup with Canvas API
- **CSS3**: Modern styling with CSS variables and animations
- **JavaScript ES6+**: Modular class-based architecture
- **Web APIs**: File API, Canvas 2D Context, localStorage

### File Structure
```
2.0-BlackMaker/
├── index.html          # Main application interface
├── script.js           # Core application logic
├── styles.css          # Styling and themes
├── localization.js     # Internationalization
├── server.py           # Local development server
├── start.bat           # Windows launcher
├── start.sh            # Unix/Linux launcher
├── manifest.json       # PWA configuration
├── favicon.svg         # Application icon
└── README.md           # Project documentation
```

### Key Components
- **SmartMaskGenerator**: Main application class handling image processing
- **i18n Module**: Internationalization system for UI translation
- **Canvas Engine**: High-performance image rendering and manipulation
- **Theme System**: CSS variable-based light/dark theme switching

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 80+ | Recommended |
| Firefox | 75+ | Full support |
| Safari | 13+ | Full support |
| Edge | 80+ | Recommended |

## Development

### Local Development
1. Clone or download the project
2. Run `python3 server.py`
3. Open `http://localhost:8080`

### Adding Languages
Edit `localization.js` and add new language objects to the `translations` object:

```javascript
translations: {
    zh_TW: { ... },
    en_US: { ... },
    your_lang: {
        app_title: "Your Translation",
        // ... other keys
    }
}
```

## Performance

- **Image Processing**: Client-side Canvas API for real-time performance
- **Memory Management**: Automatic cleanup of temporary objects
- **Rendering Optimization**: Debounced redraw for smooth interactions
- **File Size**: Lightweight application (~100KB total)

## Privacy & Security

- **No Data Upload**: All processing happens locally in your browser
- **No Tracking**: No analytics or user tracking
- **Local Storage**: Only saves theme and language preferences
- **Secure Processing**: Images never leave your device

## Troubleshooting

### Common Issues

**Application won't start**
- Ensure Python 3.7+ is installed
- Check if port 8080 is available
- Try running `python3 --version` to verify Python installation

**Images not loading**
- Only PNG format is supported
- Ensure image has transparent background
- Try refreshing the browser

**Performance issues**
- Use Chrome or Edge for best performance
- Close other browser tabs to free memory
- Reduce image size if very large (>10MB)

### Browser Console
Press `F12` to open developer tools and check the Console tab for error messages.


## License

This project is licensed under the MIT License - see the source code for details.

## System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.15, or Linux
- **Python**: 3.7+
- **RAM**: 2GB
- **Browser**: Modern browser with Canvas support

### Recommended
- **OS**: Latest Windows 11, macOS, or Linux
- **Python**: 3.9+
- **RAM**: 4GB+
- **Browser**: Latest Chrome or Edge
- **Display**: 1920×1080 or higher

---

**Version**: 2.0.0  
**Last Updated**: 2025/07/17  
**Maintained by**: Jimbo
