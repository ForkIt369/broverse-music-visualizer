/**
 * BroVerse Music Visualizer - Ultra Edition v3.0
 * Advanced audio visualization with mathematical precision and GPU optimization
 * Featuring frequency band analysis, smooth morphing, and reactive animations
 */

class BroVerseVisualizer {
    constructor() {
        // Audio Analysis Engine
        this.audio = {
            context: null,
            analyser: null,
            source: null,
            sampleRate: 48000,
            fftSize: 2048,
            smoothingConstant: 0.85
        };
        
        // Data Buffers
        this.buffers = {
            frequency: null,
            time: null,
            smoothed: null,
            previous: null,
            normalized: null
        };
        
        // Frequency Band Analysis
        this.bands = {
            subBass:    { range: [20, 60],     level: 0, peak: 0, smooth: 0 },
            bass:       { range: [60, 250],    level: 0, peak: 0, smooth: 0 },
            lowMid:     { range: [250, 500],   level: 0, peak: 0, smooth: 0 },
            mid:        { range: [500, 2000],  level: 0, peak: 0, smooth: 0 },
            highMid:    { range: [2000, 4000], level: 0, peak: 0, smooth: 0 },
            presence:   { range: [4000, 6000], level: 0, peak: 0, smooth: 0 },
            brilliance: { range: [6000, 20000],level: 0, peak: 0, smooth: 0 }
        };
        
        // Beat Detection System
        this.beat = {
            detector: new BeatDetector(),
            current: false,
            history: new Float32Array(43),
            bpm: 0,
            confidence: 0,
            lastBeat: 0,
            phase: 0
        };
        
        // Avatar Expression Engine
        this.avatar = {
            element: null,
            expression: 'chill',
            intensity: 0,
            targetIntensity: 0,
            morphSpeed: 0.08,
            cooldown: 0,
            maxCooldown: 60,
            scale: 1,
            rotation: 0,
            glow: 0
        };
        
        // Visualization System
        this.viz = {
            current: 'circular',
            modes: new Map(),
            elements: {},
            canvas: {},
            contexts: {},
            particles: [],
            animationId: null
        };
        
        // Performance Optimization
        this.performance = {
            fps: 60,
            targetFrameTime: 16.67,
            lastFrameTime: 0,
            deltaTime: 0,
            frameCount: 0,
            skipFrames: false
        };
        
        // Settings
        this.settings = {
            sensitivity: 1.0,
            smoothing: 0.9,
            colorMode: 'bds',
            particleCount: 100,
            barCount: 144,
            quality: 'high'
        };
        
        // Expression Library
        this.expressions = {
            chill: {
                urls: [
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_confident_business.jpg',
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_success_suit.jpg'
                ],
                threshold: 0.2,
                color: '#3EB85F',
                scale: 1.0
            },
            vibing: {
                urls: [
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_money_success.jpg',
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_profit_celebration.jpg'
                ],
                threshold: 0.4,
                color: '#FE5F00',
                scale: 1.05
            },
            hyped: {
                urls: [
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_yacht_luxury.jpg',
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_helicopter_arrival.jpg'
                ],
                threshold: 0.6,
                color: '#7E3AF2',
                scale: 1.1
            },
            peak: {
                urls: [
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_market_winner.jpg',
                    'https://imqpmvkloxoxibbrwwef.supabase.co/storage/v1/object/public/avatars/cbo/cbo_crypto_rich.jpg'
                ],
                threshold: 0.8,
                color: '#00A1F1',
                scale: 1.15
            }
        };
        
        this.init();
    }
    
    async init() {
        await this.preloadAssets();
        this.setupDOM();
        this.setupAudio();
        this.setupVisualizations();
        this.setupEventListeners();
        this.startRenderLoop();
    }
    
    async preloadAssets() {
        const imagePromises = [];
        
        for (const [mood, data] of Object.entries(this.expressions)) {
            for (const url of data.urls) {
                imagePromises.push(
                    new Promise((resolve) => {
                        const img = new Image();
                        img.onload = resolve;
                        img.onerror = resolve;
                        img.src = url;
                    })
                );
            }
        }
        
        await Promise.all(imagePromises);
    }
    
    setupDOM() {
        // Cache DOM elements
        this.dom = {
            audioPlayer: document.getElementById('audio-player'),
            audioFile: document.getElementById('audio-file'),
            avatar: document.getElementById('cbo-avatar'),
            moodText: document.getElementById('mood-text'),
            bpmDisplay: document.getElementById('bpm-display'),
            trackName: document.getElementById('track-name'),
            progressFill: document.getElementById('progress-fill'),
            currentTime: document.getElementById('current-time'),
            totalTime: document.getElementById('total-time'),
            vizContainer: document.getElementById('viz-container'),
            particles: document.getElementById('particles')
        };
        
        this.avatar.element = this.dom.avatar;
        
        // Setup canvases
        this.viz.canvas.wave = document.getElementById('wave-visualizer');
        this.viz.canvas.particles = document.getElementById('particle-field');
        
        this.viz.contexts.wave = this.viz.canvas.wave.getContext('2d', { alpha: false });
        this.viz.contexts.particles = this.viz.canvas.particles.getContext('2d', { alpha: false });
        
        // Set canvas resolution
        const dpr = window.devicePixelRatio || 1;
        const size = 500;
        
        Object.values(this.viz.canvas).forEach(canvas => {
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;
        });
        
        Object.values(this.viz.contexts).forEach(ctx => {
            ctx.scale(dpr, dpr);
        });
    }
    
    setupAudio() {
        this.audio.context = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: this.audio.sampleRate
        });
        
        this.audio.analyser = this.audio.context.createAnalyser();
        this.audio.analyser.fftSize = this.audio.fftSize;
        this.audio.analyser.smoothingTimeConstant = this.audio.smoothingConstant;
        
        const bufferLength = this.audio.analyser.frequencyBinCount;
        
        this.buffers.frequency = new Uint8Array(bufferLength);
        this.buffers.time = new Uint8Array(bufferLength);
        this.buffers.smoothed = new Float32Array(bufferLength);
        this.buffers.previous = new Float32Array(bufferLength);
        this.buffers.normalized = new Float32Array(bufferLength);
    }
    
    setupVisualizations() {
        // Initialize circular bars
        this.initCircularBars();
        
        // Initialize DNA helix
        this.initDNAHelix();
        
        // Initialize radial pulse
        this.initRadialPulse();
        
        // Initialize grid matrix
        this.initGridMatrix();
        
        // Initialize particle system
        this.initParticleSystem();
    }
    
    initCircularBars() {
        const container = document.getElementById('circular-visualizer');
        container.innerHTML = '';
        
        this.viz.elements.bars = [];
        
        for (let i = 0; i < this.settings.barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            
            const angle = (i * 360) / this.settings.barCount;
            bar.style.transform = `rotate(${angle}deg) translateY(-250px)`;
            bar.style.transformOrigin = 'center bottom';
            
            container.appendChild(bar);
            this.viz.elements.bars.push(bar);
        }
    }
    
    initDNAHelix() {
        const container = document.getElementById('dna-helix');
        container.innerHTML = '';
        
        this.viz.elements.dna = [];
        
        for (let i = 0; i < 40; i++) {
            const strand = document.createElement('div');
            strand.className = 'dna-strand';
            container.appendChild(strand);
            this.viz.elements.dna.push(strand);
        }
    }
    
    initRadialPulse() {
        const container = document.getElementById('radial-pulse');
        container.innerHTML = '';
        
        this.viz.elements.rings = [];
        
        for (let i = 0; i < 10; i++) {
            const ring = document.createElement('div');
            ring.className = 'pulse-ring';
            ring.style.width = ring.style.height = `${(i + 1) * 50}px`;
            container.appendChild(ring);
            this.viz.elements.rings.push(ring);
        }
    }
    
    initGridMatrix() {
        const container = document.getElementById('grid-matrix');
        container.innerHTML = '';
        
        this.viz.elements.grid = [];
        const gridSize = 16;
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            container.appendChild(cell);
            this.viz.elements.grid.push(cell);
        }
    }
    
    initParticleSystem() {
        this.viz.particles = [];
        
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.viz.particles.push({
                x: Math.random() * 500,
                y: Math.random() * 500,
                vx: 0,
                vy: 0,
                size: Math.random() * 3 + 1,
                life: 1,
                color: this.getColorFromPalette(Math.random())
            });
        }
    }
    
    setupEventListeners() {
        // File input
        this.dom.audioFile.addEventListener('change', (e) => this.loadAudioFile(e));
        
        // Audio player events
        this.dom.audioPlayer.addEventListener('play', () => this.handlePlay());
        this.dom.audioPlayer.addEventListener('pause', () => this.handlePause());
        this.dom.audioPlayer.addEventListener('ended', () => this.handleEnded());
        this.dom.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        
        // Visualization switcher
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchVisualization(e.currentTarget.dataset.viz));
        });
        
        // Mode presets
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.currentTarget.dataset.mode));
        });
        
        // Settings
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            this.settings.sensitivity = parseInt(e.target.value) / 5;
        });
        
        document.getElementById('color-mode').addEventListener('change', (e) => {
            this.settings.colorMode = e.target.value;
        });
    }
    
    loadAudioFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Clean up previous source
        if (this.audio.source) {
            this.audio.source.disconnect();
            this.audio.source = null;
        }
        
        const url = URL.createObjectURL(file);
        this.dom.audioPlayer.src = url;
        
        // Update UI
        const name = file.name.replace(/\.[^/.]+$/, '');
        this.dom.trackName.textContent = name.substring(0, 40);
        
        // Auto-play
        this.dom.audioPlayer.play().catch(() => {
            console.log('Click play to start');
        });
    }
    
    handlePlay() {
        if (this.audio.context.state === 'suspended') {
            this.audio.context.resume();
        }
        
        if (!this.audio.source) {
            try {
                this.audio.source = this.audio.context.createMediaElementSource(this.dom.audioPlayer);
                this.audio.source.connect(this.audio.analyser);
                this.audio.analyser.connect(this.audio.context.destination);
            } catch (e) {
                console.log('Audio already connected');
            }
        }
    }
    
    handlePause() {
        this.resetAvatar();
    }
    
    handleEnded() {
        this.resetAvatar();
        this.resetVisualization();
    }
    
    switchVisualization(mode) {
        // Update UI
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.viz === mode);
        });
        
        document.querySelectorAll('.viz-mode').forEach(viz => {
            viz.classList.toggle('active', viz.dataset.mode === mode);
        });
        
        this.viz.current = mode;
    }
    
    applyPreset(mode) {
        const presets = {
            chill: { sensitivity: 0.6, smoothing: 0.95, quality: 'high' },
            party: { sensitivity: 1.4, smoothing: 0.8, quality: 'high' },
            focus: { sensitivity: 1.0, smoothing: 0.9, quality: 'medium' },
            hype: { sensitivity: 1.8, smoothing: 0.7, quality: 'high' }
        };
        
        const preset = presets[mode];
        if (preset) {
            this.settings.sensitivity = preset.sensitivity;
            this.settings.smoothing = preset.smoothing;
            this.settings.quality = preset.quality;
            
            document.getElementById('sensitivity').value = preset.sensitivity * 5;
        }
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }
    
    startRenderLoop() {
        const render = (timestamp) => {
            // Calculate delta time
            this.performance.deltaTime = timestamp - this.performance.lastFrameTime;
            
            // Frame limiting for consistent performance
            if (this.performance.deltaTime >= this.performance.targetFrameTime) {
                this.performance.lastFrameTime = timestamp;
                this.performance.frameCount++;
                
                if (this.dom.audioPlayer && !this.dom.audioPlayer.paused && this.audio.analyser) {
                    this.updateAudioData();
                    this.updateVisualization();
                    this.updateAvatar();
                    this.updateBeatDetection();
                }
            }
            
            this.viz.animationId = requestAnimationFrame(render);
        };
        
        this.viz.animationId = requestAnimationFrame(render);
    }
    
    updateAudioData() {
        // Get frequency and time domain data
        this.audio.analyser.getByteFrequencyData(this.buffers.frequency);
        this.audio.analyser.getByteTimeDomainData(this.buffers.time);
        
        // Smooth the frequency data
        for (let i = 0; i < this.buffers.frequency.length; i++) {
            const target = this.buffers.frequency[i];
            const current = this.buffers.smoothed[i];
            const diff = target - current;
            
            // Adaptive smoothing based on direction
            const smoothing = diff > 0 ? 
                (1 - this.settings.smoothing * 0.5) : // Faster attack
                (1 - this.settings.smoothing);         // Slower release
            
            this.buffers.smoothed[i] += diff * smoothing;
            this.buffers.normalized[i] = this.buffers.smoothed[i] / 255;
            this.buffers.previous[i] = this.buffers.smoothed[i];
        }
        
        // Update frequency bands
        this.updateFrequencyBands();
    }
    
    updateFrequencyBands() {
        const nyquist = this.audio.sampleRate / 2;
        const binHz = nyquist / this.buffers.frequency.length;
        
        for (const [name, band] of Object.entries(this.bands)) {
            const startBin = Math.floor(band.range[0] / binHz);
            const endBin = Math.floor(band.range[1] / binHz);
            
            let sum = 0;
            let count = 0;
            
            for (let i = startBin; i <= endBin && i < this.buffers.frequency.length; i++) {
                sum += this.buffers.normalized[i];
                count++;
            }
            
            const level = count > 0 ? sum / count : 0;
            
            // Smooth band levels
            band.smooth += (level - band.smooth) * 0.1;
            band.level = band.smooth * this.settings.sensitivity;
            
            // Track peaks
            if (band.level > band.peak) {
                band.peak = band.level;
            } else {
                band.peak *= 0.995; // Slow decay
            }
        }
    }
    
    updateVisualization() {
        switch (this.viz.current) {
            case 'circular':
                this.renderCircularBars();
                break;
            case 'wave':
                this.renderWaveform();
                break;
            case 'particles':
                this.renderParticles();
                break;
            case 'dna':
                this.renderDNAHelix();
                break;
            case 'radial':
                this.renderRadialPulse();
                break;
            case 'grid':
                this.renderGridMatrix();
                break;
        }
    }
    
    renderCircularBars() {
        const bars = this.viz.elements.bars;
        const step = Math.floor(this.buffers.frequency.length / bars.length);
        
        bars.forEach((bar, i) => {
            const dataIndex = i * step;
            const value = this.buffers.normalized[dataIndex];
            
            // Calculate height with easing
            const targetHeight = 50 + value * 250 * this.settings.sensitivity;
            const currentHeight = parseFloat(bar.style.height) || 50;
            const height = currentHeight + (targetHeight - currentHeight) * 0.3;
            
            bar.style.height = `${height}px`;
            
            // Color based on frequency range
            const hue = (i / bars.length) * 60 + 120; // Green to cyan range
            const saturation = 50 + value * 50;
            const lightness = 30 + value * 40;
            
            if (this.settings.colorMode === 'bds') {
                bar.style.background = this.getBDSGradient(value);
            } else {
                bar.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            }
            
            // Add glow on high intensity
            if (value > 0.7) {
                bar.style.boxShadow = `0 0 ${20 * value}px ${bar.style.background}`;
            } else {
                bar.style.boxShadow = 'none';
            }
        });
    }
    
    renderWaveform() {
        const ctx = this.viz.contexts.wave;
        const width = 500;
        const height = 500;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw circular waveform
        ctx.beginPath();
        ctx.lineWidth = 2;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = 100;
        
        // Create gradient based on intensity
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
        gradient.addColorStop(0, this.getColorFromIntensity(this.bands.bass.level));
        gradient.addColorStop(0.5, this.getColorFromIntensity(this.bands.mid.level));
        gradient.addColorStop(1, this.getColorFromIntensity(this.bands.highMid.level));
        
        ctx.strokeStyle = gradient;
        
        for (let i = 0; i < 360; i++) {
            const angle = (i / 360) * Math.PI * 2;
            const dataIndex = Math.floor((i / 360) * this.buffers.frequency.length);
            const amplitude = this.buffers.normalized[dataIndex] * 150 * this.settings.sensitivity;
            const radius = baseRadius + amplitude;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
        
        // Add center pulse
        const pulseRadius = 30 + this.bands.bass.level * 50;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62, 184, 95, ${0.3 * this.bands.bass.level})`;
        ctx.fill();
    }
    
    renderParticles() {
        const ctx = this.viz.contexts.particles;
        const width = 500;
        const height = 500;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw particles
        this.viz.particles.forEach((particle, i) => {
            // Apply forces based on frequency bands
            const bandIndex = i % 7;
            const band = Object.values(this.bands)[bandIndex];
            const force = band.level * 2;
            
            // Physics update
            particle.vx += (Math.random() - 0.5) * force;
            particle.vy += (Math.random() - 0.5) * force;
            
            // Damping
            particle.vx *= 0.96;
            particle.vy *= 0.96;
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Draw particle
            const size = particle.size * (1 + band.level);
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = this.getColorFromIntensity(band.level);
            ctx.globalAlpha = 0.5 + band.level * 0.5;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }
    
    renderDNAHelix() {
        const time = this.performance.frameCount * 0.02;
        
        this.viz.elements.dna.forEach((strand, i) => {
            const t = i / this.viz.elements.dna.length;
            const angle = t * Math.PI * 4 + time;
            
            // Use frequency data to modulate the helix
            const dataIndex = Math.floor(t * this.buffers.frequency.length);
            const amplitude = 80 + this.buffers.normalized[dataIndex] * 60 * this.settings.sensitivity;
            
            const x = Math.sin(angle) * amplitude;
            const y = (i - 20) * 10;
            const z = Math.cos(angle) * amplitude;
            
            // Apply 3D transform
            strand.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
            
            // Color based on position and intensity
            strand.style.background = this.getColorFromIntensity(this.buffers.normalized[dataIndex]);
            
            // Size based on intensity
            const size = 4 + this.buffers.normalized[dataIndex] * 8;
            strand.style.width = strand.style.height = `${size}px`;
            
            // Opacity for depth
            strand.style.opacity = 0.5 + Math.cos(angle) * 0.5;
        });
    }
    
    renderRadialPulse() {
        this.viz.elements.rings.forEach((ring, i) => {
            const t = i / this.viz.elements.rings.length;
            
            // Use different frequency bands for each ring
            const bandIndex = i % Object.keys(this.bands).length;
            const band = Object.values(this.bands)[bandIndex];
            
            // Animate scale
            const scale = 1 + band.level * 0.5;
            ring.style.transform = `scale(${scale})`;
            
            // Color based on band
            ring.style.borderColor = this.getColorFromIntensity(band.level);
            
            // Opacity based on intensity
            ring.style.opacity = 0.2 + band.level * 0.6;
            
            // Border width based on peak
            ring.style.borderWidth = `${2 + band.peak * 3}px`;
        });
    }
    
    renderGridMatrix() {
        const gridSize = 16;
        
        this.viz.elements.grid.forEach((cell, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            
            // Map position to frequency data
            const dataIndex = Math.floor((i / this.viz.elements.grid.length) * this.buffers.frequency.length);
            const intensity = this.buffers.normalized[dataIndex];
            
            // Create wave effect
            const distance = Math.sqrt(Math.pow(row - 8, 2) + Math.pow(col - 8, 2));
            const wave = Math.sin(distance * 0.3 - this.performance.frameCount * 0.05) * 0.5 + 0.5;
            
            // Combine with frequency data
            const finalIntensity = intensity * wave;
            
            // Update cell
            cell.style.background = this.getColorFromIntensity(finalIntensity);
            cell.style.opacity = 0.1 + finalIntensity * 0.9;
            cell.style.transform = `scale(${0.8 + finalIntensity * 0.4})`;
        });
    }
    
    updateAvatar() {
        // Calculate overall intensity
        const bassWeight = this.bands.bass.level * 0.4;
        const midWeight = this.bands.mid.level * 0.3;
        const highWeight = this.bands.highMid.level * 0.3;
        const currentIntensity = bassWeight + midWeight + highWeight;
        
        // Smooth intensity changes
        this.avatar.targetIntensity = currentIntensity;
        this.avatar.intensity += (this.avatar.targetIntensity - this.avatar.intensity) * this.avatar.morphSpeed;
        
        // Update cooldown
        if (this.avatar.cooldown > 0) {
            this.avatar.cooldown--;
        }
        
        // Determine expression
        let targetExpression = 'chill';
        if (this.avatar.intensity > 0.7) {
            targetExpression = 'peak';
        } else if (this.avatar.intensity > 0.5) {
            targetExpression = 'hyped';
        } else if (this.avatar.intensity > 0.3) {
            targetExpression = 'vibing';
        }
        
        // Change expression if needed
        if (targetExpression !== this.avatar.expression && this.avatar.cooldown === 0) {
            this.avatar.expression = targetExpression;
            this.avatar.cooldown = this.avatar.maxCooldown;
            
            const expr = this.expressions[targetExpression];
            const imageUrl = expr.urls[Math.floor(Math.random() * expr.urls.length)];
            
            this.avatar.element.style.backgroundImage = `url('${imageUrl}')`;
            this.dom.moodText.textContent = targetExpression.toUpperCase();
            
            // Smooth transition
            this.avatar.element.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        // Update avatar transform
        const scale = 1 + this.avatar.intensity * 0.15;
        const rotation = Math.sin(this.performance.frameCount * 0.01) * 2 * this.avatar.intensity;
        
        this.avatar.element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        
        // Update glow
        const glowColor = this.expressions[this.avatar.expression].color;
        const glowIntensity = 20 + this.avatar.intensity * 40;
        this.avatar.element.style.boxShadow = `0 0 ${glowIntensity}px ${glowColor}`;
        this.avatar.element.style.borderColor = glowColor;
        
        // Add vibing class on beats
        if (this.beat.current) {
            this.avatar.element.classList.add('vibing');
            setTimeout(() => this.avatar.element.classList.remove('vibing'), 200);
        }
    }
    
    updateBeatDetection() {
        // Energy calculation for beat detection
        const energy = this.bands.bass.level + this.bands.subBass.level;
        
        // Update energy history
        this.beat.history[this.performance.frameCount % 43] = energy;
        
        // Calculate average energy
        let avgEnergy = 0;
        for (let i = 0; i < 43; i++) {
            avgEnergy += this.beat.history[i];
        }
        avgEnergy /= 43;
        
        // Beat detection threshold
        const threshold = avgEnergy * 1.3;
        
        // Detect beat
        this.beat.current = false;
        if (energy > threshold && energy > 0.3) {
            const now = Date.now();
            if (now - this.beat.lastBeat > 150) { // Min 150ms between beats
                this.beat.current = true;
                this.beat.lastBeat = now;
                
                // Update BPM
                if (this.beat.detector.intervals) {
                    this.beat.detector.addBeat(now);
                    this.beat.bpm = this.beat.detector.getBPM();
                    this.dom.bpmDisplay.textContent = `${Math.round(this.beat.bpm)} BPM`;
                }
                
                // Create particle effect on beat
                this.createBeatParticle();
            }
        }
    }
    
    createBeatParticle() {
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
        particle.style.background = this.getColorFromIntensity(Math.random());
        
        this.dom.particles.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => particle.remove(), 3000);
    }
    
    updateProgress() {
        const current = this.dom.audioPlayer.currentTime;
        const duration = this.dom.audioPlayer.duration;
        
        if (duration) {
            const percent = (current / duration) * 100;
            this.dom.progressFill.style.width = `${percent}%`;
            
            this.dom.currentTime.textContent = this.formatTime(current);
            this.dom.totalTime.textContent = this.formatTime(duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    resetAvatar() {
        this.avatar.expression = 'chill';
        this.avatar.intensity = 0;
        this.avatar.element.style.transform = 'scale(1)';
        this.avatar.element.style.boxShadow = 'none';
        this.dom.moodText.textContent = 'PAUSED';
        this.dom.bpmDisplay.textContent = '';
    }
    
    resetVisualization() {
        // Clear canvases
        Object.values(this.viz.contexts).forEach(ctx => {
            ctx.clearRect(0, 0, 500, 500);
        });
        
        // Reset elements
        this.viz.elements.bars?.forEach(bar => {
            bar.style.height = '50px';
            bar.style.boxShadow = 'none';
        });
        
        // Clear particles
        this.dom.particles.innerHTML = '';
    }
    
    getBDSGradient(intensity) {
        const colors = {
            low: 'linear-gradient(to top, #3EB85F, #00A1F1)',
            medium: 'linear-gradient(to top, #FE5F00, #7E3AF2)',
            high: 'linear-gradient(to top, #7E3AF2, #00A1F1)',
            peak: 'linear-gradient(to top, #00A1F1, #3EB85F)'
        };
        
        if (intensity < 0.25) return colors.low;
        if (intensity < 0.5) return colors.medium;
        if (intensity < 0.75) return colors.high;
        return colors.peak;
    }
    
    getColorFromIntensity(intensity) {
        const colors = ['#3EB85F', '#00A1F1', '#FE5F00', '#7E3AF2'];
        const index = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
        return colors[index];
    }
    
    getColorFromPalette(value) {
        const colors = ['#3EB85F', '#00A1F1', '#FE5F00', '#7E3AF2'];
        const index = Math.floor(value * colors.length);
        return colors[Math.min(index, colors.length - 1)];
    }
}

// Beat Detection Helper Class
class BeatDetector {
    constructor() {
        this.intervals = [];
        this.maxIntervals = 10;
    }
    
    addBeat(timestamp) {
        if (this.lastBeat) {
            const interval = timestamp - this.lastBeat;
            this.intervals.push(interval);
            
            if (this.intervals.length > this.maxIntervals) {
                this.intervals.shift();
            }
        }
        this.lastBeat = timestamp;
    }
    
    getBPM() {
        if (this.intervals.length < 3) return 0;
        
        const avgInterval = this.intervals.reduce((a, b) => a + b, 0) / this.intervals.length;
        return Math.round(60000 / avgInterval);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BroVerseVisualizer();
});