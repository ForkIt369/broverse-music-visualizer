# 🎵 BroVibes - Advanced Music Visualizer

![Version](https://img.shields.io/badge/version-3.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![BDS](https://img.shields.io/badge/design-BDS%20v3.1-purple)
![Performance](https://img.shields.io/badge/performance-60%20FPS-orange)

> **Ultra-refined audio visualization system with GPU acceleration and advanced frequency analysis**

BroVibes is a cutting-edge music visualizer featuring dynamic CBO avatar expressions, 7-band frequency analysis, and six distinct visualization modes. Built with performance in mind, every animation runs on the GPU for silky-smooth 60 FPS rendering.

## ✨ Features

### 🎯 Core Capabilities
- **Real-time Audio Analysis** - 7-band frequency spectrum analysis with adaptive smoothing
- **Dynamic Avatar System** - CBO expressions that react to music intensity
- **Multiple Visualizations** - 6 unique modes: Circular, Wave, Particles, DNA, Radial, Grid
- **Beat Detection** - Advanced BPM calculation with confidence scoring
- **GPU Acceleration** - All animations hardware-accelerated for maximum performance

### 🎨 Visual Modes

| Mode | Description | Best For |
|------|-------------|----------|
| **Circular** | 144 frequency bars in radial arrangement | Electronic, EDM |
| **Wave** | Circular waveform with gradient mapping | Ambient, Classical |
| **Particles** | Physics-based particle system | Hip-Hop, Trap |
| **DNA** | 3D double helix with depth perception | Progressive, Trance |
| **Radial** | Pulsing rings responding to frequency bands | Dubstep, Bass |
| **Grid** | 16x16 matrix with wave propagation | Techno, House |

### 🎮 Preset Modes

- **Chill** 🌊 - Low sensitivity, smooth transitions
- **Party** 🎉 - High sensitivity, vibrant response
- **Focus** 🎯 - Balanced settings for work
- **Hype** 🚀 - Maximum intensity, fast reactions

## 🚀 Quick Start

### Online Demo
Visit: [https://brovibes.vercel.app](https://brovibes.vercel.app)

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/brovibes.git
cd brovibes

# Install dependencies (optional, for development)
npm install

# Start local server
npm start

# Or open directly in browser
open index.html
```

## 📊 Technical Specifications

### Audio Processing
- **Sample Rate**: 48kHz
- **FFT Size**: 2048 samples
- **Frequency Bands**: 7 (20Hz - 20kHz)
- **Smoothing**: Adaptive (0.7 - 0.95)

### Performance
- **Target FPS**: 60
- **Bar Count**: 144
- **Particle Count**: 100
- **Grid Size**: 16x16 (256 cells)

### Frequency Bands
| Band | Range | Purpose |
|------|-------|---------|
| Sub-Bass | 20-60 Hz | Deep bass, kick drums |
| Bass | 60-250 Hz | Bass lines, low instruments |
| Low-Mid | 250-500 Hz | Lower vocals, guitars |
| Mid | 500-2000 Hz | Vocals, lead instruments |
| High-Mid | 2000-4000 Hz | Presence, clarity |
| Presence | 4000-6000 Hz | Brilliance, air |
| Brilliance | 6000-20000 Hz | Sparkle, cymbals |

## 🎨 Design System

BroVibes follows the BroVerse Design System (BDS) v3.1:

### Color Palette
```css
--cbo-color: #3EB85F;    /* Growth Green */
--bigsis-color: #00A1F1; /* Trust Blue */
--bro-color: #FE5F00;    /* Action Orange */
--lilsis-color: #7E3AF2; /* Creative Purple */
```

### Typography
- **Display**: DM Sans
- **Body**: Inter
- **Scale**: 48px → 32px → 24px → 16px → 14px

### Spacing
8px grid system with multipliers:
- Space-1: 8px
- Space-2: 16px
- Space-3: 24px
- Space-4: 32px

## 🛠️ Configuration

### Performance Settings
```javascript
{
  "targetFPS": 60,
  "quality": "high",
  "barCount": 144,
  "particleCount": 100,
  "smoothing": 0.85
}
```

### Customization
Edit `config/performance.json` to adjust:
- Visualization quality levels
- Frequency band ranges
- Beat detection sensitivity
- Avatar expression thresholds
- Color schemes

## 📁 Project Structure

```
brovibes/
├── index.html           # Main application
├── css/
│   └── styles.css      # GPU-accelerated styles
├── js/
│   └── visualizer.js   # Core visualization engine
├── config/
│   └── performance.json # Performance settings
├── docs/
│   ├── ULTRA-IMPROVEMENTS.md
│   ├── API.md
│   └── CUSTOMIZATION.md
├── assets/
│   └── avatars/        # CBO expression images
└── tests/
    └── performance.html # Performance testing
```

## 🔧 API Reference

### Core Class
```javascript
const visualizer = new BroVerseVisualizer();
```

### Methods
- `loadAudioFile(file)` - Load audio file
- `switchVisualization(mode)` - Change visualization
- `applyPreset(preset)` - Apply preset settings
- `updateFrequencyBands()` - Process frequency data
- `updateBeatDetection()` - Detect beats and BPM

### Events
- `play` - Audio playback started
- `pause` - Audio playback paused
- `beat` - Beat detected
- `expressionChange` - Avatar expression changed

## 🎯 Use Cases

### Live Performance
- DJ sets with real-time visualization
- Concert backdrops and stage displays
- Live streaming overlays

### Content Creation
- Music videos and visualizers
- Social media content
- Podcast video backgrounds

### Personal Entertainment
- Home audio setup enhancement
- Party atmosphere creation
- Meditation and focus sessions

## 🚀 Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### GitHub Pages
```bash
# Push to gh-pages branch
git subtree push --prefix=dist origin gh-pages
```

### Self-Hosting
Serve the files with any static web server:
- nginx
- Apache
- Python SimpleHTTPServer
- Node.js http-server

## 📈 Performance Optimization

### GPU Acceleration
All visual elements use:
- `transform: translateZ(0)`
- `will-change` properties
- Hardware-accelerated transforms
- Optimized `backface-visibility`

### Rendering Pipeline
- Frame rate limiting (60 FPS)
- Delta time calculations
- Efficient requestAnimationFrame
- Canvas optimization

### Memory Management
- Typed arrays for audio data
- Buffer reuse patterns
- Efficient particle pooling
- URL cleanup for audio files

## 🧪 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | Full |
| Edge | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Mobile Chrome | Latest | Full |
| Mobile Safari | Latest | Full |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Install dev dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Start development server
npm run dev
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

### Development
- **Architecture**: Ultra-refined modular design
- **Audio Processing**: Web Audio API mastery
- **Performance**: GPU acceleration throughout
- **Design System**: BDS v3.1 implementation

### Assets
- CBO avatar expressions from BroVerse collection
- BDS color palette and design principles
- Custom animation curves and transitions

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/brovibes/issues)
- **Discord**: [BroVerse Community](https://discord.gg/broverse)

---

<div align="center">

**Built with 💚 by the BroVerse Team**

*Turning sound into visual excellence*

[![BDS](https://img.shields.io/badge/BDS-v3.1-purple)](https://broverse.com/design)
[![Performance](https://img.shields.io/badge/Performance-Optimized-green)](docs/ULTRA-IMPROVEMENTS.md)
[![GPU](https://img.shields.io/badge/GPU-Accelerated-blue)](docs/API.md)

</div>