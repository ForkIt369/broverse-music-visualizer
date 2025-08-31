# 🎵 BroVerse Music Visualizer - CBO Edition

## Dynamic Music Visualization with Expression-Changing Avatars

An interactive music visualizer featuring CBO (Chief Bro Officer) with dynamic expressions that react to music intensity, surrounded by circular frequency bars in BDS colors.

## ✨ Features

### 🎭 Dynamic CBO Expressions
- **Chill Mode**: Confident business poses
- **Vibing Mode**: Money success & profit expressions
- **Hyped Mode**: Luxury lifestyle (yacht, helicopter, sports car)
- **Peak Vibe**: Market winner & crypto rich expressions

### 🌈 Visualization Effects
- **Circular Frequency Bars**: 120 bars arranged in a circle
- **BDS Color Spectrum**: Transitions through all BroVerse colors
- **Particle System**: Beat-reactive particle emissions
- **Avatar Scaling**: Grows with music intensity
- **Dynamic Glow**: Color-changing aura based on frequencies

### 🎛️ Controls
- **Audio File Upload**: Support for all audio formats
- **Mode Presets**: Chill, Party, Focus, Hype
- **Sensitivity Control**: Adjust visualization responsiveness
- **Color Modes**: 
  - BDS Spectrum (all agent colors)
  - CBO Green (monochrome green)
  - Rainbow (full spectrum)
  - Monochrome (white)

## 🛠️ Technology

- **Web Audio API**: Real-time frequency analysis
- **Canvas-free**: Pure CSS animations for performance
- **BDS Design System**: Following 4-3-2-1 framework
- **Responsive**: Adapts to different screen sizes

## 🎨 Color Palette

```css
--bigsis-color: #00A1F1;  /* Trust Blue */
--lilsis-color: #7E3AF2;  /* Creative Purple */
--bro-color: #FE5F00;     /* Action Orange */
--cbo-color: #3EB85F;     /* Growth Green */
```

## 🚀 Quick Start

1. Open `index.html` in a modern browser
2. Click "Choose Track" to load your music
3. Watch CBO vibe with dynamic expressions!

Or run locally:
```bash
npm install
npm start
```

## 📁 Project Structure

```
music-visualizer/
├── index.html          # Main HTML with audio controls
├── css/
│   └── styles.css      # BDS-compliant animations
├── js/
│   └── visualizer.js   # Web Audio API & visualization logic
└── assets/            # (Optional) Local audio files
```

## 🎮 How It Works

1. **Audio Processing**: Web Audio API analyzes frequency data
2. **Visual Mapping**: Frequencies mapped to bar heights & colors
3. **Expression Logic**: 
   - Low intensity (< 20%): Chill expression
   - Medium (20-40%): Vibing
   - High (40-70%): Hyped
   - Peak (> 70%): Peak Vibe mode
4. **Beat Detection**: Bass frequencies trigger particle effects
5. **Color Transitions**: Smooth gradients based on intensity

## 💡 Usage Tips

- **Best Experience**: Use tracks with clear bass lines
- **Sensitivity**: Adjust for different music genres
- **Fullscreen**: Press F11 for immersive experience
- **File Types**: Supports MP3, WAV, OGG, M4A

## 🎯 Perfect For

- Music video concepts
- Live streaming overlays
- Party visualization
- Creative content backgrounds
- Brand activations

## 📝 Customization

### Add New Expressions
Edit the `cboExpressions` object in `visualizer.js`:
```javascript
cboExpressions: {
    yourMode: [
        'path/to/image1.jpg',
        'path/to/image2.jpg'
    ]
}
```

### Adjust Visualization
- `bars`: Number of frequency bars (default: 120)
- `fftSize`: Frequency resolution (default: 512)
- `sensitivity`: Response multiplier (1-10)

## 🤝 Contributing

Part of the BroVerse ecosystem. Follow BDS and HAIKU design principles.

---

**Built with 💚 by the BroVerse Team**

*Turning Vibes into Visual Value*