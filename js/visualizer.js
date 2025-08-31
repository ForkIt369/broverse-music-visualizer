// BroVerse Music Visualizer v2.0 - Refined Edition
// Enhanced with smooth transitions and multiple visualization modes

class BroVerseVisualizer {
    constructor() {
        // Audio Context
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.bufferLength = null;
        
        // Elements
        this.audioPlayer = document.getElementById('audio-player');
        this.audioFile = document.getElementById('audio-file');
        this.vizContainer = document.getElementById('viz-container');
        this.cboAvatar = document.getElementById('cbo-avatar');
        this.moodText = document.getElementById('mood-text');
        this.bpmDisplay = document.getElementById('bpm-display');
        this.particles = document.getElementById('particles');
        this.trackName = document.getElementById('track-name');
        this.currentTime = document.getElementById('current-time');
        this.totalTime = document.getElementById('total-time');
        this.progressFill = document.getElementById('progress-fill');
        
        // Visualization elements
        this.circularVisualizer = document.getElementById('circular-visualizer');
        this.waveCanvas = document.getElementById('wave-visualizer');
        this.particleCanvas = document.getElementById('particle-field');
        this.dnaHelix = document.getElementById('dna-helix');
        this.radialPulse = document.getElementById('radial-pulse');
        this.gridMatrix = document.getElementById('grid-matrix');
        
        // Canvas contexts
        this.waveCtx = this.waveCanvas.getContext('2d');
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        // CBO Avatar Expressions
        this.cboExpressions = {
            chill: [
                'cbo/cbo_business_confident.jpg',
                'cbo/cbo_suit_sharp.jpg',
                'cbo/cbo_gold_standard.jpg'
            ],
            vibing: [
                'cbo/cbo_money_success.jpg',
                'cbo/cbo_profit_happy.jpg',
                'cbo/cbo_deal_maker.jpg'
            ],
            hyped: [
                'cbo/cbo_yacht_luxury.jpg',
                'cbo/cbo_helicopter_boss.jpg',
                'cbo/cbo_sports_car_success.jpg'
            ],
            peak: [
                'cbo/cbo_market_winner.jpg',
                'cbo/cbo_crypto_rich.jpg',
                'cbo/cbo_stocks_up.jpg'
            ]
        };
        
        // Settings
        this.sensitivity = 5;
        this.colorMode = 'bds';
        this.currentMode = 'chill';
        this.currentVizMode = 'circular';
        this.bars = 120;
        this.currentExpression = 'chill';
        this.expressionIndex = 0;
        
        // Smooth transition variables
        this.smoothedData = [];
        this.previousData = [];
        this.intensityHistory = [];
        this.beatHistory = [];
        this.bpm = 0;
        this.lastBeatTime = 0;
        this.beatIntervals = [];
        this.expressionCooldown = 0;
        this.transitionSpeed = 0.15; // Smoothing factor
        
        // Particle system
        this.particleArray = [];
        this.dnaStrands = [];
        this.radialRings = [];
        this.gridCells = [];
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupCanvases();
        this.createVisualizationElements();
        this.setupEventListeners();
        this.setCBOAvatar('chill', 0);
        this.startVisualization();
    }
    
    setupAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048; // Higher resolution for better analysis
            this.analyser.smoothingTimeConstant = 0.8; // Built-in smoothing
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.smoothedData = new Float32Array(this.bufferLength);
            this.previousData = new Float32Array(this.bufferLength);
        }
    }
    
    setupCanvases() {
        // Set canvas sizes
        const size = 500;
        this.waveCanvas.width = size;
        this.waveCanvas.height = size;
        this.particleCanvas.width = size;
        this.particleCanvas.height = size;
    }
    
    createVisualizationElements() {
        // Create circular bars
        for (let i = 0; i < this.bars; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            const angle = (i * 360) / this.bars;
            bar.style.transform = `rotate(${angle}deg) translateY(-250px)`;
            this.circularVisualizer.appendChild(bar);
        }
        
        // Create DNA strands
        for (let i = 0; i < 40; i++) {
            const strand = document.createElement('div');
            strand.className = 'dna-strand';
            this.dnaHelix.appendChild(strand);
            this.dnaStrands.push(strand);
        }
        
        // Create radial rings
        for (let i = 0; i < 8; i++) {
            const ring = document.createElement('div');
            ring.className = 'pulse-ring';
            ring.style.width = ring.style.height = `${(i + 1) * 60}px`;
            this.radialPulse.appendChild(ring);
            this.radialRings.push(ring);
        }
        
        // Create grid cells
        for (let i = 0; i < 256; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.gridMatrix.appendChild(cell);
            this.gridCells.push(cell);
        }
        
        // Initialize particle array
        for (let i = 0; i < 100; i++) {
            this.particleArray.push({
                x: Math.random() * 500,
                y: Math.random() * 500,
                vx: 0,
                vy: 0,
                size: Math.random() * 3 + 1,
                color: this.getRandomBDSColor()
            });
        }
    }
    
    setupEventListeners() {
        // File input
        this.audioFile.addEventListener('change', (e) => this.loadAudioFile(e));
        
        // Audio player events
        this.audioPlayer.addEventListener('play', () => this.connectAudioSource());
        this.audioPlayer.addEventListener('pause', () => this.pauseVisualization());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        
        // Visualization mode buttons
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.viz;
                this.switchVisualizationMode(mode);
            });
        });
        
        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setMode(e.target.dataset.mode));
        });
        
        // Settings
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            this.sensitivity = parseInt(e.target.value);
        });
        
        document.getElementById('color-mode').addEventListener('change', (e) => {
            this.colorMode = e.target.value;
        });
    }
    
    switchVisualizationMode(mode) {
        // Update active states
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.viz === mode);
        });
        
        document.querySelectorAll('.viz-mode').forEach(viz => {
            viz.classList.toggle('active', viz.dataset.mode === mode);
        });
        
        this.currentVizMode = mode;
    }
    
    loadAudioFile(event) {
        const file = event.target.files[0];
        if (file) {
            if (this.source) {
                this.source.disconnect();
                this.source = null;
            }
            
            const url = URL.createObjectURL(file);
            this.audioPlayer.src = url;
            this.trackName.textContent = file.name.replace(/\.[^/.]+$/, '');
            
            if (!this.audioContext) {
                this.setupAudioContext();
            }
            
            this.audioPlayer.addEventListener('canplay', () => {
                this.audioPlayer.play().catch(e => {
                    console.log('Autoplay prevented, please click play button');
                });
            }, { once: true });
        }
    }
    
    connectAudioSource() {
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (!this.source) {
            try {
                this.source = this.audioContext.createMediaElementSource(this.audioPlayer);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            } catch (e) {
                console.log('Audio source already connected');
            }
        }
    }
    
    startVisualization() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (!this.analyser || this.audioPlayer.paused) return;
            
            // Get frequency data
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Smooth the data
            this.smoothFrequencyData();
            
            // Update visualization based on current mode
            switch(this.currentVizMode) {
                case 'circular':
                    this.updateCircularBars();
                    break;
                case 'wave':
                    this.updateWaveform();
                    break;
                case 'particles':
                    this.updateParticleField();
                    break;
                case 'dna':
                    this.updateDNAHelix();
                    break;
                case 'radial':
                    this.updateRadialPulse();
                    break;
                case 'grid':
                    this.updateGridMatrix();
                    break;
            }
            
            // Update avatar with smooth transitions
            this.updateAvatarSmooth();
            
            // Detect beats and BPM
            this.detectBeatsAndBPM();
        };
        
        animate();
    }
    
    smoothFrequencyData() {
        for (let i = 0; i < this.bufferLength; i++) {
            // Smooth transition between frames
            this.smoothedData[i] = this.previousData[i] + 
                (this.dataArray[i] - this.previousData[i]) * this.transitionSpeed;
            this.previousData[i] = this.smoothedData[i];
        }
    }
    
    updateCircularBars() {
        const bars = this.circularVisualizer.querySelectorAll('.visualizer-bar');
        const step = Math.floor(this.bufferLength / this.bars);
        
        bars.forEach((bar, index) => {
            const dataIndex = index * step;
            const value = this.smoothedData[dataIndex];
            const percent = value / 255;
            const height = 50 + (percent * 200 * (this.sensitivity / 5));
            
            bar.style.height = `${height}px`;
            
            if (this.colorMode === 'bds') {
                const colors = this.getBDSColor(percent);
                bar.style.background = `linear-gradient(to top, ${colors.bottom}, ${colors.top})`;
            }
            
            if (percent > 0.7) {
                bar.style.boxShadow = `0 0 ${20 * percent}px currentColor`;
            }
        });
    }
    
    updateWaveform() {
        const width = this.waveCanvas.width;
        const height = this.waveCanvas.height;
        
        // Clear canvas with fade effect
        this.waveCtx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.waveCtx.fillRect(0, 0, width, height);
        
        // Draw circular waveform
        this.waveCtx.beginPath();
        this.waveCtx.strokeStyle = this.getColorForIntensity(this.getAverageIntensity());
        this.waveCtx.lineWidth = 2;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = 100;
        
        for (let i = 0; i < this.bars; i++) {
            const angle = (i / this.bars) * Math.PI * 2;
            const dataIndex = Math.floor((i / this.bars) * this.bufferLength);
            const amplitude = (this.smoothedData[dataIndex] / 255) * 100 * (this.sensitivity / 5);
            const radius = baseRadius + amplitude;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.waveCtx.moveTo(x, y);
            } else {
                this.waveCtx.lineTo(x, y);
            }
        }
        
        this.waveCtx.closePath();
        this.waveCtx.stroke();
    }
    
    updateParticleField() {
        const width = this.particleCanvas.width;
        const height = this.particleCanvas.height;
        
        // Clear canvas
        this.particleCtx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.particleCtx.fillRect(0, 0, width, height);
        
        const intensity = this.getAverageIntensity();
        
        this.particleArray.forEach((particle, index) => {
            // Update particle velocity based on frequency
            const dataIndex = Math.floor((index / this.particleArray.length) * this.bufferLength);
            const force = (this.smoothedData[dataIndex] / 255) * 2;
            
            particle.vx += (Math.random() - 0.5) * force;
            particle.vy += (Math.random() - 0.5) * force;
            
            // Apply damping
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Draw particle
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size * (1 + intensity), 0, Math.PI * 2);
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.fill();
        });
    }
    
    updateDNAHelix() {
        const intensity = this.getAverageIntensity();
        const time = Date.now() / 1000;
        
        this.dnaStrands.forEach((strand, index) => {
            const angle = (index / this.dnaStrands.length) * Math.PI * 4;
            const dataIndex = Math.floor((index / this.dnaStrands.length) * this.bufferLength);
            const amplitude = (this.smoothedData[dataIndex] / 255) * 50;
            
            const x = Math.sin(angle + time) * (100 + amplitude);
            const y = (index - 20) * 10;
            const z = Math.cos(angle + time) * (100 + amplitude);
            
            strand.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
            strand.style.background = this.getColorForIntensity(this.smoothedData[dataIndex] / 255);
            strand.style.width = strand.style.height = `${6 + amplitude / 10}px`;
        });
    }
    
    updateRadialPulse() {
        const intensity = this.getAverageIntensity();
        
        this.radialRings.forEach((ring, index) => {
            const dataIndex = Math.floor((index / this.radialRings.length) * this.bufferLength / 4);
            const scale = 1 + (this.smoothedData[dataIndex] / 255) * 0.5 * (this.sensitivity / 5);
            
            ring.style.transform = `scale(${scale})`;
            ring.style.borderColor = this.getColorForIntensity(this.smoothedData[dataIndex] / 255);
            ring.style.opacity = 0.3 + (this.smoothedData[dataIndex] / 255) * 0.7;
        });
    }
    
    updateGridMatrix() {
        const gridSize = 16;
        
        this.gridCells.forEach((cell, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const dataIndex = Math.floor((index / this.gridCells.length) * this.bufferLength);
            const intensity = this.smoothedData[dataIndex] / 255;
            
            cell.style.background = this.getColorForIntensity(intensity);
            cell.style.opacity = 0.2 + intensity * 0.8;
            cell.style.transform = `scale(${0.8 + intensity * 0.4})`;
        });
    }
    
    updateAvatarSmooth() {
        // Calculate smooth intensity
        const currentIntensity = this.getAverageIntensity();
        this.intensityHistory.push(currentIntensity);
        if (this.intensityHistory.length > 10) {
            this.intensityHistory.shift();
        }
        
        const smoothIntensity = this.intensityHistory.reduce((a, b) => a + b, 0) / this.intensityHistory.length;
        
        // Determine expression with cooldown
        if (this.expressionCooldown > 0) {
            this.expressionCooldown--;
        } else {
            let newExpression;
            let newMood;
            
            if (smoothIntensity < 0.2) {
                newExpression = 'chill';
                newMood = 'CHILL';
            } else if (smoothIntensity < 0.4) {
                newExpression = 'vibing';
                newMood = 'VIBING';
            } else if (smoothIntensity < 0.65) {
                newExpression = 'hyped';
                newMood = 'HYPED';
            } else {
                newExpression = 'peak';
                newMood = 'PEAK VIBE';
            }
            
            // Only change if significantly different
            if (newExpression !== this.currentExpression) {
                this.currentExpression = newExpression;
                this.expressionIndex = Math.floor(Math.random() * 3);
                this.setCBOAvatar(newExpression, this.expressionIndex);
                this.moodText.textContent = newMood;
                this.expressionCooldown = 30; // Prevent rapid changes
                
                // Smooth animation
                this.cboAvatar.style.transition = 'all 0.5s ease';
                this.cboAvatar.classList.add('vibing');
                setTimeout(() => this.cboAvatar.classList.remove('vibing'), 500);
            }
        }
        
        // Smooth scale based on intensity
        const scale = 1 + (smoothIntensity * 0.15);
        this.cboAvatar.style.transform = `scale(${scale})`;
        
        // Update glow with smooth color
        const glowColor = this.getColorForIntensity(smoothIntensity);
        this.cboAvatar.style.borderColor = glowColor;
        this.cboAvatar.style.boxShadow = `0 0 ${30 + smoothIntensity * 30}px ${glowColor}`;
    }
    
    detectBeatsAndBPM() {
        // Simple beat detection on bass frequencies
        let bassSum = 0;
        for (let i = 0; i < 10; i++) {
            bassSum += this.smoothedData[i];
        }
        const bassAverage = bassSum / 10;
        
        // Track beat history
        this.beatHistory.push(bassAverage);
        if (this.beatHistory.length > 5) {
            this.beatHistory.shift();
        }
        
        const beatThreshold = Math.max(...this.beatHistory) * 0.85;
        
        // Detect beat
        if (bassAverage > beatThreshold && bassAverage > 200) {
            const currentTime = Date.now();
            if (currentTime - this.lastBeatTime > 200) { // Minimum 200ms between beats
                // Record beat interval
                if (this.lastBeatTime > 0) {
                    const interval = currentTime - this.lastBeatTime;
                    this.beatIntervals.push(interval);
                    if (this.beatIntervals.length > 10) {
                        this.beatIntervals.shift();
                    }
                    
                    // Calculate BPM
                    if (this.beatIntervals.length > 3) {
                        const avgInterval = this.beatIntervals.reduce((a, b) => a + b, 0) / this.beatIntervals.length;
                        this.bpm = Math.round(60000 / avgInterval);
                        this.bpmDisplay.textContent = `${this.bpm} BPM`;
                    }
                }
                
                this.lastBeatTime = currentTime;
                
                // Create particle on beat
                if (bassAverage > 230) {
                    this.createBeatParticle();
                }
            }
        }
    }
    
    createBeatParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.setProperty('--x', `${x * 3}px`);
        particle.style.setProperty('--y', `${y * 3}px`);
        particle.style.background = this.getRandomBDSColor();
        
        this.particles.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
    
    getAverageIntensity() {
        let sum = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            sum += this.smoothedData[i];
        }
        return sum / this.bufferLength / 255;
    }
    
    getBDSColor(intensity) {
        const colors = {
            low: { bottom: '#3EB85F', top: '#00A1F1' },
            medium: { bottom: '#FE5F00', top: '#7E3AF2' },
            high: { bottom: '#7E3AF2', top: '#FE5F00' },
            peak: { bottom: '#00A1F1', top: '#3EB85F' }
        };
        
        if (intensity < 0.25) return colors.low;
        if (intensity < 0.5) return colors.medium;
        if (intensity < 0.75) return colors.high;
        return colors.peak;
    }
    
    getColorForIntensity(intensity) {
        const colors = ['#3EB85F', '#00A1F1', '#FE5F00', '#7E3AF2'];
        const index = Math.floor(intensity * (colors.length - 1));
        return colors[index];
    }
    
    getRandomBDSColor() {
        const colors = ['#3EB85F', '#00A1F1', '#FE5F00', '#7E3AF2'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setCBOAvatar(expression, index) {
        const imagePath = this.cboExpressions[expression][index];
        const imageUrl = `https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/${imagePath}`;
        this.cboAvatar.style.backgroundImage = `url('${imageUrl}')`;
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        const sensitivities = { chill: 3, party: 7, focus: 5, hype: 9 };
        this.sensitivity = sensitivities[mode];
        document.getElementById('sensitivity').value = this.sensitivity;
        
        // Adjust transition speed based on mode
        const speeds = { chill: 0.1, party: 0.2, focus: 0.15, hype: 0.25 };
        this.transitionSpeed = speeds[mode];
    }
    
    updateProgress() {
        const current = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            const percent = (current / duration) * 100;
            this.progressFill.style.width = `${percent}%`;
            
            this.currentTime.textContent = this.formatTime(current);
            this.totalTime.textContent = this.formatTime(duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    pauseVisualization() {
        this.setCBOAvatar('chill', 0);
        this.cboAvatar.style.transform = 'scale(1)';
        this.moodText.textContent = 'PAUSED';
        this.bpmDisplay.textContent = '';
        
        // Reset histories
        this.intensityHistory = [];
        this.beatHistory = [];
        this.beatIntervals = [];
    }
}

// Initialize visualizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BroVerseVisualizer();
});