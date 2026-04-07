/**
 * THE BARD'S CORNER - Footer Music Player for BloxSmith AI
 * Dynamically injects a music player into the bottom right of the screen.
 * Handles playlist management, volume persistence, and "Forge" aesthetics.
 */

(function () {
    // === CONFIGURATION ===
    // EDIT HERE: Add your MP3 files to 'assets/music/' and update this list!
    const playlist = [
        { title: "Behind Bars, Not Me", file: "assets/music/behind-bars-not-me.mp3" },
        { title: "Bloxsmith Anthem", file: "assets/music/bloxsmith-anthem.mp3" },
        { title: "Forge It in Bloxsmith", file: "assets/music/forge-it-in-bloxsmith.mp3" },

        { title: "Bloxsmith Breakdown", file: "assets/music/bloxsmith-breakdown.mp3" },
        { title: "Who's Real", file: "assets/music/whos-real.mp3" },
        { title: "Backroad Bounce", file: "assets/music/backroad-bounce.mp3" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    audio.crossOrigin = "anonymous"; // Enable CORS for Web Audio API
    let audioCtx, analyser, dataArray, source;
    let visualizerInitialized = false;
    const storageKey = 'bloxsmith_bard_volume';
    const stateKey = 'bloxsmith_bard_state';

    // === INJECT HTML ===
    function injectPlayer() {
        // Create container
        const container = document.createElement('div');
        container.id = 'bard-player';
        container.className = 'bard-player collapsed'; // Start collapsed or expanded? Let's go collapsed for subtlety

        container.innerHTML = `
            <div class="bard-toggle" onclick="toggleBardPlayer()" title="Open Two Hammers, One Core">
                <img src="assets/images/logo.gif" alt="Hammers" style="width: 60%; height: 60%; object-fit: contain;">
                <div class="bard-eq-mini">
                    <span></span><span></span><span></span>
                </div>
            </div>
            
            <div class="bard-controls-panel">
                <div class="bard-header">
                    <span class="bard-title">Two Hammers, One Core</span>
                    <i class="fas fa-times bard-close" onclick="toggleBardPlayer()"></i>
                </div>
                
                <div class="bard-track-info">
                    <div class="bard-icon">
                        <img src="assets/images/logo.gif" alt="Spinning Hammer Logo">
                    </div>
                    <div class="bard-text">
                        <span id="bardTrackTitle">Select a track...</span>
                        <span id="bardTrackTime">0:00 / 0:00</span>
                    </div>
                </div>

                <div class="bard-action-row">
                    <div class="bard-buttons">
                        <button class="bard-btn" onclick="prevTrack()"><i class="fas fa-step-backward"></i></button>
                        <button class="bard-btn main-play" onclick="togglePlay()" id="bardPlayBtn"><i class="fas fa-play"></i></button>
                        <button class="bard-btn" onclick="nextTrack(true)"><i class="fas fa-step-forward"></i></button>
                    </div>

                    <div class="bard-extra-controls">
                        <div class="bard-vol-wrapper">
                            <button class="bard-btn" onclick="toggleMute()" id="bardMuteBtn" title="Mute"><i class="fas fa-volume-up" id="bardMuteIcon"></i></button>
                            <button class="bard-btn vol-toggle" onclick="toggleVolumePopup()" id="bardVolBtn"><i class="fas fa-sliders-h"></i></button>
                            <div class="bard-vol-popup" id="bardVolPopup">
                                <input type="range" orient="vertical" id="bardVolume" min="0" max="1" step="0.05" oninput="setVolume(this.value)">
                            </div>
                        </div>
                        <button class="bard-btn" onclick="toggleShuffle()" id="bardShuffleBtn" title="Shuffle"><i class="fas fa-random"></i></button>
                    </div>
                </div>

                <!-- Glowing Iron Progress Bar (Moved to Bottom) -->
                <div class="bard-progress-container" onclick="seekTrack(event)">
                    <div class="bard-progress-bar">
                        <div class="bard-progress-fill" id="bardProgressFill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
    }

    // === STYLES are in css/footer.css (we will add them there) ===

    // === LOGIC ===

    function init() {
        injectPlayer();

        // Load volume
        const savedVol = localStorage.getItem(storageKey);
        if (savedVol !== null) {
            audio.volume = parseFloat(savedVol);
            const slider = document.getElementById('bardVolume');
            if (slider) slider.value = savedVol;
        } else {
            audio.volume = 0.5;
        }

        // Audio events
        audio.addEventListener('ended', () => nextTrack(true));
        audio.addEventListener('timeupdate', () => {
            updateTime();
            saveState(); // Persist progress
        });
        audio.addEventListener('error', (e) => {
            console.error("Bard Player Error:", e);
            document.getElementById('bardTrackTitle').textContent = "End of Playlist / Missing File";
        });

        // Check if user has already entered the forge this session
        const hasEnteredForge = sessionStorage.getItem('bloxsmith_entered_forge');

        // Initialize player without showing entry screen (removed per user feedback)
        // Music will only play when user manually clicks the play button
        const savedState = JSON.parse(localStorage.getItem(stateKey));
        const now = Date.now();

        if (savedState && (now - savedState.timestamp < 3600000)) {
            currentTrackIndex = savedState.index || 0;
            loadTrack(currentTrackIndex, false);
            audio.currentTime = savedState.time || 0;
            isPlaying = false;
            updatePlayBtn();
        } else {
            currentTrackIndex = 0;
            loadTrack(currentTrackIndex, false);
        }

        // Mark as entered so we don't trigger overlay if old code paths exist
        sessionStorage.setItem('bloxsmith_entered_forge', 'true');

        // Globals
        window.toggleBardPlayer = toggleBardPlayer;
        window.togglePlay = togglePlay;
        window.nextTrack = nextTrack;
        window.prevTrack = prevTrack;
        window.setVolume = setVolume;
        window.toggleMute = toggleMute;
        window.toggleShuffle = toggleShuffle;
        window.seekTrack = seekTrack;
        window.toggleVolumePopup = toggleVolumePopup;
    }

    function toggleVolumePopup() {
        const popup = document.getElementById('bardVolPopup');
        popup.classList.toggle('show');
    }

    function showStartMusicOverlay() {
        // Create an immersive "ENTER THE FORGE" welcome gate
        const overlay = document.createElement('div');
        overlay.id = 'music-start-overlay';
        overlay.innerHTML = `
            <div class="forge-gate-backdrop"></div>
            <div class="forge-gate-content">
                <div class="forge-gate-flames"></div>
                <img src="assets/images/logo.gif" alt="BloxSmith" class="forge-gate-logo">
                <button class="forge-gate-enter">
                    <span class="forge-enter-icon">⚒️</span>
                    <span class="forge-enter-text">ENTER THE FORGE</span>
                </button>
                <p class="forge-gate-hint">🔊 Best experienced with sound</p>
            </div>
        `;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .forge-gate-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(ellipse at center bottom, rgba(255,69,0,0.3) 0%, transparent 60%),
                    linear-gradient(180deg, #000 0%, #0a0a0a 50%, #1a0a00 100%);
            }
            .forge-gate-content {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                padding: 50px 80px;
                text-align: center;
            }
            .forge-gate-flames {
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                width: 400px;
                height: 150px;
                background: radial-gradient(ellipse at center bottom, rgba(255,100,0,0.4) 0%, rgba(255,50,0,0.2) 40%, transparent 70%);
                filter: blur(20px);
                animation: flameFlicker 0.5s ease-in-out infinite alternate;
            }
            @keyframes flameFlicker {
                0% { opacity: 0.7; transform: translateX(-50%) scaleY(1); }
                100% { opacity: 1; transform: translateX(-50%) scaleY(1.1); }
            }
            .forge-gate-logo {
                width: 180px;
                height: 180px;
                filter: drop-shadow(0 0 30px rgba(255,107,0,0.8));
                animation: logoFloat 3s ease-in-out infinite;
            }
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .forge-gate-title {
                font-family: 'Orbitron', 'Montserrat', sans-serif;
                font-size: 48px;
                font-weight: 900;
                background: linear-gradient(135deg, #ff8c00 0%, #ff4500 50%, #ffaa00 100%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: none;
                filter: drop-shadow(0 0 20px rgba(255,69,0,0.5));
                margin: 0;
                letter-spacing: 4px;
            }
            .forge-gate-tagline {
                font-family: 'Orbitron', sans-serif;
                font-size: 16px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 3px;
                margin: 0 0 20px 0;
            }
            .forge-gate-enter {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px 50px;
                font-family: 'Orbitron', sans-serif;
                font-size: 20px;
                font-weight: bold;
                color: #fff;
                background: linear-gradient(135deg, #ff5500 0%, #ff8800 100%);
                border: 3px solid rgba(255,200,100,0.5);
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 30px rgba(255,85,0,0.5), 0 0 60px rgba(255,85,0,0.3);
                animation: enterPulse 2s ease-in-out infinite;
            }
            @keyframes enterPulse {
                0%, 100% { box-shadow: 0 0 30px rgba(255,85,0,0.5), 0 0 60px rgba(255,85,0,0.3); }
                50% { box-shadow: 0 0 50px rgba(255,85,0,0.7), 0 0 100px rgba(255,85,0,0.4); }
            }
            .forge-gate-enter:hover {
                transform: scale(1.05);
                box-shadow: 0 0 50px rgba(255,85,0,0.8), 0 0 100px rgba(255,85,0,0.5);
            }
            .forge-enter-icon {
                font-size: 28px;
            }
            .forge-gate-hint {
                font-family: 'Orbitron', sans-serif;
                font-size: 12px;
                color: #555;
                margin: 20px 0 0 0;
                letter-spacing: 1px;
            }
            @media (max-width: 600px) {
                .forge-gate-content { padding: 30px 20px; }
                .forge-gate-logo { width: 120px; height: 120px; }
                .forge-gate-title { font-size: 32px; letter-spacing: 2px; }
                .forge-gate-tagline { font-size: 12px; }
                .forge-gate-enter { padding: 15px 30px; font-size: 16px; }
                .forge-enter-icon { font-size: 22px; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Click the enter button to start music and dismiss
        const enterBtn = overlay.querySelector('.forge-gate-enter');
        const startMusic = () => {
            // Mark that user has entered the forge this session
            sessionStorage.setItem('bloxsmith_entered_forge', 'true');

            // DO NOT PLAY AUDIO AUTOMATICALLY
            // Just init the contexts if possible (browsers might block this without direct play, but we can try)
            if (!visualizerInitialized) {
                // We might need a user gesture to init context fully, but let's try or leave it for the play button
                // setupVisualizer(); 
            }

            // Ensure we are ready to play (load first track if needed)
            if (currentTrackIndex === -1) loadTrack(0, false);

            // Smooth fade out
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                style.remove();
            }, 500);
        };

        enterBtn.addEventListener('click', startMusic);
        // Also allow clicking anywhere on the overlay
        overlay.addEventListener('click', startMusic);
    }


    function saveState() {
        if (!audio) return;
        const state = {
            index: currentTrackIndex,
            time: audio.currentTime,
            timestamp: Date.now()
        };
        localStorage.setItem(stateKey, JSON.stringify(state));
    }

    function toggleBardPlayer() {
        const p = document.getElementById('bard-player');
        p.classList.toggle('collapsed');
        p.classList.toggle('expanded');
    }

    function loadTrack(index, autoPlay = true) {
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;

        currentTrackIndex = index;
        const track = playlist[index];

        // If we are already on this track (e.g. from restore), don't reload src if just seeking
        // But here we usually reload to be safe.
        if (audio.src !== track.file && !audio.src.endsWith(track.file)) {
            audio.src = track.file;
        }

        document.getElementById('bardTrackTitle').textContent = track.title;
        // Reset progress bar only if starting fresh
        if (audio.currentTime < 0.1) document.getElementById('bardProgressFill').style.width = '0%';

        if (autoPlay) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updatePlayBtn();
                }).catch(e => {
                    console.warn("Auto-play blocked", e);
                    isPlaying = false;
                    updatePlayBtn();
                    // Show an overlay prompting user to click to start music
                    showStartMusicOverlay();
                });
            }
        }
    }

    function togglePlay() {
        if (audio.paused) {
            if (!visualizerInitialized) setupVisualizer();
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

            audio.play().then(() => {
                isPlaying = true;
                updatePlayBtn();
            }).catch(e => {
                console.error("Play failed", e);
                alert(`Could not play '${playlist[currentTrackIndex].title}'. Check console for details.`);
            });
        } else {
            audio.pause();
            isPlaying = false;
            updatePlayBtn();
        }
    }

    function updatePlayBtn() {
        const btn = document.getElementById('bardPlayBtn');
        const icon = document.querySelector('.bard-icon img');
        if (isPlaying) {
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            if (icon) icon.style.opacity = '1';
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i>';
            if (icon) icon.style.opacity = '0.7';
        }
    }

    function nextTrack(isRandom = true) {
        // Simple random logic for "next"
        let nextIndex;
        if (isRandom) {
            // Pick a random index distinct from current
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (nextIndex === currentTrackIndex && playlist.length > 1);
        } else {
            nextIndex = currentTrackIndex + 1;
        }
        loadTrack(nextIndex, true);
    }

    function prevTrack() {
        loadTrack(currentTrackIndex - 1, true);
    }

    function setVolume(val) {
        audio.volume = val;
        localStorage.setItem(storageKey, val);
        updateVolumeIcon(val);
    }

    function toggleMute() {
        if (audio.muted) {
            audio.muted = false;
            setVolume(audio.volume || 0.5);
        } else {
            audio.muted = true;
            updateVolumeIcon(0);
        }
    }

    function updateVolumeIcon(val) {
        const icon = document.getElementById('bardMuteIcon');
        if (val == 0 || audio.muted) icon.className = 'fas fa-volume-mute';
        else if (val < 0.5) icon.className = 'fas fa-volume-down';
        else icon.className = 'fas fa-volume-up';
    }

    function updateTime() {
        if (!audio.duration) return;
        const cur = formatTime(audio.currentTime);
        const dur = formatTime(audio.duration);
        document.getElementById('bardTrackTime').textContent = `${cur} / ${dur}`;

        // Update Progress Bar
        const percent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('bardProgressFill').style.width = percent + '%';

        // Visualize eq
        if (isPlaying) {
            const bars = document.querySelectorAll('.bard-eq-mini span');
            bars.forEach(b => b.style.height = (Math.random() * 10 + 3) + 'px');
        }
    }

    function seekTrack(e) {
        if (!audio.duration) return;
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = Math.min(Math.max(0, x / width), 1);

        audio.currentTime = percent * audio.duration;
    }

    function formatTime(s) {
        const m = Math.floor(s / 60);
        const secs = Math.floor(s % 60);
        return `${m}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function toggleShuffle() {
        // Just visual feedback for now, as nextTrack is random by default in this implementation
        const btn = document.getElementById('bardShuffleBtn');
        btn.classList.toggle('active');
    }

    // === VISUALIZER ===
    function setupVisualizer() {
        if (visualizerInitialized) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256; // Smaller FFT size for faster reaction to beat

            source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            visualizerInitialized = true;
            renderVisualizer();
        } catch (e) {
            console.warn("Audio Visualizer failed to init (likely CORS or Interaction policy):", e);
        }
    }

    function renderVisualizer() {
        requestAnimationFrame(renderVisualizer);

        if (!isPlaying || !analyser) return;

        analyser.getByteFrequencyData(dataArray);

        // Calculate Bass (approx first 10 bins for 256 FFT size)
        let bassSum = 0;
        let bassCount = 10;
        for (let i = 0; i < bassCount; i++) {
            bassSum += dataArray[i];
        }
        const bassAvg = bassSum / bassCount;

        // Calculate Pulse Scale (1.0 to 1.3)
        // Normalize: bassAvg is 0-255. 
        // We want a subtle pulse normally, heavier on drops.
        const sensitivity = 0.0015; // Tuning factor
        const scale = 1 + (bassAvg * sensitivity);
        const limitedScale = Math.min(scale, 1.4); // Max bloom

        // Apply to Expanded Icon
        const iconImg = document.querySelector('.bard-icon img');
        if (iconImg) {
            iconImg.style.transform = `scale(${limitedScale})`;
            iconImg.style.transition = 'transform 0.05s ease-out'; // Fast response
        }

        // Apply to Collapsed Toggle
        const toggleImg = document.querySelector('.bard-toggle img');
        if (toggleImg) {
            toggleImg.style.transform = `scale(${limitedScale})`;
            toggleImg.style.transition = 'transform 0.05s ease-out';
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
