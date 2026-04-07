"use client";

import { useEffect, useRef } from 'react';

// Configuration
const config = {
    emberCount: 120,
    sparkCount: 40,
    colors: {
        ember: ['#ff5500', '#ff8c00', '#ff3300', '#ff6600', '#ffaa00'],
        spark: ['#ffffff', '#ffffaa', '#ffff66', '#ff8800'],
    }
};

class Ember {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    speedY: number = 0;
    speedX: number = 0;
    opacity: number = 0;
    life: number = 0;
    maxLife: number = 0;
    color: string = '';
    wobble: number = 0;
    wobbleSpeed: number = 0;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = this.height + Math.random() * 100;
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

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Spark {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    speedY: number = 0;
    speedX: number = 0;
    life: number = 0;
    maxLife: number = 0;
    color: string = '';
    trail: { x: number, y: number, opacity: number }[] = [];
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = this.height + 20;
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
        this.trail.forEach((t, i) => { t.opacity = (i / this.trail.length) * 0.5; });
        this.life--;
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05;
        this.speedX *= 0.99;
        if (this.life <= 0 || this.y < -50 || this.y > this.height + 50) {
            this.reset();
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.trail.forEach((t) => {
            ctx.save();
            ctx.globalAlpha = t.opacity * (this.life / this.maxLife);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
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

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const embers: Ember[] = [];
        const sparks: Spark[] = [];
        for (let i = 0; i < config.emberCount; i++) {
            const ember = new Ember(width, height);
            ember.y = Math.random() * height;
            embers.push(ember);
        }
        for (let i = 0; i < config.sparkCount; i++) {
            const spark = new Spark(width, height);
            spark.y = Math.random() * height;
            sparks.push(spark);
        }
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const gradient = ctx.createLinearGradient(0, height, 0, height - 300);
            gradient.addColorStop(0, 'rgba(255, 85, 0, 0.15)');
            gradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.05)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, height - 300, width, 300);
            embers.forEach(e => { e.update(); e.draw(ctx); });
            sparks.forEach(s => { s.update(); s.draw(ctx); });
            animationRef.current = requestAnimationFrame(animate);
        };
        const handleResize = () => {
            if (canvas) {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
        };
        window.addEventListener('resize', handleResize);
        animate();
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <canvas id="forge-embers" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }} />
    );
}