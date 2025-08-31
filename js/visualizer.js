// BroVerse Music Visualizer - CBO Edition
// Web Audio API Implementation with BDS Design

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
        this.circularVisualizer = document.getElementById('circular-visualizer');
        this.cboAvatar = document.getElementById('cbo-avatar');
        this.moodText = document.getElementById('mood-text');
        this.particles = document.getElementById('particles');
        this.trackName = document.getElementById('track-name');
        this.currentTime = document.getElementById('current-time');
        this.totalTime = document.getElementById('total-time');
        this.progressFill = document.getElementById('progress-fill');
        
        // CBO Avatar Expressions (different images based on intensity)
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
        this.bars = 120; // Number of visualizer bars
        this.currentExpression = 'chill';
        this.expressionIndex = 0;
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.createVisualizerBars();
        this.setupEventListeners();
        this.setCBOAvatar('chill', 0);
        this.startVisualization();
    }
    
    setupAudioContext() {
        // Create audio context on user interaction
        const initAudio = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 512;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
            }
        };
        
        // Initialize on first user interaction
        document.addEventListener('click', initAudio, { once: true });
    }
    
    createVisualizerBars() {
        for (let i = 0; i < this.bars; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            const angle = (i * 360) / this.bars;
            bar.style.transform = `rotate(${angle}deg) translateY(-250px)`;
            this.circularVisualizer.appendChild(bar);
        }
    }
    
    setupEventListeners() {
        // File input
        this.audioFile.addEventListener('change', (e) => this.loadAudioFile(e));
        
        // Audio player events
        this.audioPlayer.addEventListener('play', () => this.connectAudioSource());
        this.audioPlayer.addEventListener('pause', () => this.pauseVisualization());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        
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
    
    loadAudioFile(event) {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            this.audioPlayer.src = url;
            this.trackName.textContent = file.name.replace(/\.[^/.]+$/, '');
            
            // Auto play
            this.audioPlayer.play();
        }
    }
    
    connectAudioSource() {
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        // Disconnect previous source if exists
        if (this.source) {
            this.source.disconnect();
        }
        
        // Create new source
        this.source = this.audioContext.createMediaElementSource(this.audioPlayer);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }
    
    startVisualization() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (!this.analyser || this.audioPlayer.paused) return;
            
            // Get frequency data
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Update visualizer bars
            this.updateBars();
            
            // Update avatar expression based on intensity
            this.updateAvatarExpression();
            
            // Create particles on beats
            this.detectBeats();
        };
        
        animate();
    }
    
    updateBars() {
        const bars = this.circularVisualizer.querySelectorAll('.visualizer-bar');
        const step = Math.floor(this.bufferLength / this.bars);
        
        bars.forEach((bar, index) => {
            const dataIndex = index * step;
            const value = this.dataArray[dataIndex];
            const percent = value / 255;
            const height = 50 + (percent * 200 * (this.sensitivity / 5));
            
            bar.style.height = `${height}px`;
            
            // Update bar color based on mode
            if (this.colorMode === 'bds') {
                const colors = this.getBDSColor(percent);
                bar.style.background = `linear-gradient(to top, ${colors.bottom}, ${colors.top})`;
            } else if (this.colorMode === 'cbo') {
                const intensity = Math.floor(percent * 100);
                bar.style.background = `linear-gradient(to top, 
                    hsl(140, 60%, ${30 + intensity / 2}%), 
                    hsl(140, 70%, ${50 + intensity / 2}%))`;
            } else if (this.colorMode === 'rainbow') {
                const hue = (index / this.bars) * 360;
                bar.style.background = `linear-gradient(to top, 
                    hsl(${hue}, 70%, 50%), 
                    hsl(${hue + 30}, 80%, 60%))`;
            } else {
                bar.style.background = `linear-gradient(to top, 
                    rgba(255, 255, 255, ${0.3 + percent * 0.5}), 
                    rgba(255, 255, 255, ${0.5 + percent * 0.5}))`;
            }
            
            // Add glow effect for high values
            if (percent > 0.7) {
                bar.style.boxShadow = `0 0 ${20 * percent}px currentColor`;
            }
        });
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
    
    updateAvatarExpression() {
        // Calculate average intensity
        let sum = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.bufferLength;
        const intensity = average / 255;
        
        // Determine expression based on intensity
        let newExpression;
        let newMood;
        
        if (intensity < 0.2) {
            newExpression = 'chill';
            newMood = 'CHILL';
        } else if (intensity < 0.4) {
            newExpression = 'vibing';
            newMood = 'VIBING';
        } else if (intensity < 0.7) {
            newExpression = 'hyped';
            newMood = 'HYPED';
        } else {
            newExpression = 'peak';
            newMood = 'PEAK VIBE';
        }
        
        // Update avatar if expression changed
        if (newExpression !== this.currentExpression) {
            this.currentExpression = newExpression;
            this.expressionIndex = Math.floor(Math.random() * 3);
            this.setCBOAvatar(newExpression, this.expressionIndex);
            this.moodText.textContent = newMood;
            
            // Add animation class
            this.cboAvatar.classList.add('vibing');
            setTimeout(() => this.cboAvatar.classList.remove('vibing'), 500);
        }
        
        // Scale avatar based on intensity
        const scale = 1 + (intensity * 0.1);
        this.cboAvatar.style.transform = `scale(${scale})`;
        
        // Update glow color
        const glowColor = this.getGlowColor(intensity);
        this.cboAvatar.style.borderColor = glowColor;
        this.cboAvatar.style.boxShadow = `0 0 ${30 + intensity * 20}px ${glowColor}`;
    }
    
    getGlowColor(intensity) {
        if (intensity < 0.25) return '#3EB85F'; // CBO Green
        if (intensity < 0.5) return '#00A1F1';  // BigSis Blue
        if (intensity < 0.75) return '#FE5F00'; // Bro Orange
        return '#7E3AF2'; // LilSis Purple
    }
    
    setCBOAvatar(expression, index) {
        const imagePath = this.cboExpressions[expression][index];
        const imageUrl = `https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/${imagePath}`;
        this.cboAvatar.style.backgroundImage = `url('${imageUrl}')`;
    }
    
    detectBeats() {
        // Simple beat detection
        let sum = 0;
        for (let i = 0; i < 20; i++) { // Focus on bass frequencies
            sum += this.dataArray[i];
        }
        const bassAverage = sum / 20;
        
        // Create particles on strong beats
        if (bassAverage > 200) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position around avatar
        const angle = Math.random() * Math.PI * 2;
        const distance = 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.setProperty('--x', `${x * 3}px`);
        particle.style.setProperty('--y', `${y * 3}px`);
        
        // Random color from BDS palette
        const colors = ['#3EB85F', '#00A1F1', '#FE5F00', '#7E3AF2'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        this.particles.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), 3000);
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Adjust sensitivity based on mode
        const sensitivities = { chill: 3, party: 7, focus: 5, hype: 9 };
        this.sensitivity = sensitivities[mode];
        document.getElementById('sensitivity').value = this.sensitivity;
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
        // Reset avatar to default
        this.setCBOAvatar('chill', 0);
        this.cboAvatar.style.transform = 'scale(1)';
        this.moodText.textContent = 'PAUSED';
    }
}

// Initialize visualizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BroVerseVisualizer();
});