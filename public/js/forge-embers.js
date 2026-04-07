// Enhanced Forge Embers/Sparks Particle System
// Provides the signature "heat" effect for BloxSmith AI

(function () {
    'use strict';

    // Create and setup canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'forge-embers';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let embers = [];
    let sparks = [];

    // Configuration
    const config = {
        emberCount: 120,        // Floating ember particles
        sparkCount: 40,         // Fast moving sparks
        heatWaveCount: 5,       // Heat distortion waves
        colors: {
            ember: ['#ff5500', '#ff8c00', '#ff3300', '#ff6600', '#ffaa00'],
            spark: ['#ffffff', '#ffffaa', '#ffff66', '#ff8800'],
            glow: 'rgba(255, 85, 0, 0.15)'
        }
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Ember {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
            this.color = config.colors.ember[Math.floor(Math.random() * config.colors.ember.length)];
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        }

        update() {
            this.life--;
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.y += this.speedY;
            this.opacity = (this.life / this.maxLife) * 0.7;

            if (this.life <= 0 || this.y < -50) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            // Glow effect
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.5, this.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    class Spark {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 20;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 4 + 2);
            this.speedX = (Math.random() - 0.5) * 3;
            this.life = Math.random() * 50 + 30;
            this.maxLife = this.life;
            this.color = config.colors.spark[Math.floor(Math.random() * config.colors.spark.length)];
            this.trail = [];
        }

        update() {
            this.trail.push({ x: this.x, y: this.y, opacity: 1 });
            if (this.trail.length > 8) this.trail.shift();

            this.trail.forEach((t, i) => {
                t.opacity = (i / this.trail.length) * 0.5;
            });

            this.life--;
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.05; // Gravity
            this.speedX *= 0.99; // Drag

            if (this.life <= 0 || this.y < -50 || this.y > height + 50) {
                this.reset();
            }
        }

        draw() {
            // Draw trail
            this.trail.forEach((t, i) => {
                ctx.save();
                ctx.globalAlpha = t.opacity * (this.life / this.maxLife);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Draw spark
            ctx.save();
            ctx.globalAlpha = this.life / this.maxLife;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        resize();

        // Create embers
        for (let i = 0; i < config.emberCount; i++) {
            const ember = new Ember();
            ember.y = Math.random() * height; // Distribute initially
            embers.push(ember);
        }

        // Create sparks
        for (let i = 0; i < config.sparkCount; i++) {
            const spark = new Spark();
            spark.y = Math.random() * height;
            sparks.push(spark);
        }
    }

    function drawHeatGlow() {
        // Bottom heat glow
        const gradient = ctx.createLinearGradient(0, height, 0, height - 300);
        gradient.addColorStop(0, 'rgba(255, 85, 0, 0.15)');
        gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.05)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - 300, width, 300);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw bottom heat glow
        drawHeatGlow();

        // Update and draw embers
        embers.forEach(ember => {
            ember.update();
            ember.draw();
        });

        // Update and draw sparks
        sparks.forEach(spark => {
            spark.update();
            spark.draw();
        });

        requestAnimationFrame(animate);
    }

    // Handle resize
    window.addEventListener('resize', resize);

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            animate();
        });
    } else {
        init();
        animate();
    }
})();
