"use client";

import { useState, useEffect } from 'react';

export default function LegalModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Listen for the open event from the footer
        const handleOpen = () => setIsOpen(true);
        if (typeof window !== 'undefined') {
            window.addEventListener('open-legal-modal', handleOpen);
        }
        return () => {
            if (typeof window !== 'undefined') window.removeEventListener('open-legal-modal', handleOpen);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
            <div className="legal-modal-content" style={{ maxWidth: "900px", margin: "40px auto", padding: "50px", background: "linear-gradient(145deg, #0a0a0a, #000)", border: "2px solid rgba(255, 85, 0, 0.4)", borderRadius: "20px", position: "relative", boxShadow: "0 0 60px rgba(255,85,0,0.15)", maxHeight: '90vh', overflowY: 'auto' }}>

                <span
                    style={{ position: "absolute", top: "20px", right: "25px", fontSize: "2.5rem", color: "#666", cursor: "pointer", transition: "color 0.3s" }}
                    onClick={() => setIsOpen(false)}
                >
                    ×
                </span>

                <h1 style={{ color: "#ff5500", fontSize: "2.2rem", marginBottom: "10px", textAlign: "center", textShadow: "0 0 20px rgba(255,85,0,0.4)" }}>
                    ⚒️ The Bla⚒smith&apos;s Code
                </h1>

                <div style={{ marginBottom: "20px", textAlign: "center", color: "#666" }}>
                    <p>Last Updated: January 2026</p>
                    <p>By supporting Nebublox AI (&quot;The Service&quot;), you agree to the following terms regarding memberships, cancellations, usage credits, and licensing.</p>
                </div>

                {/* 1. Nature of Support & Refunds */}
                <div style={{ marginBottom: "35px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>🔥</span> 1. Nature of Support & Refunds
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>Digital Membership:</strong> Payments made are for digital memberships that support the ongoing development of the Nebublox AI platform.</li>
                        <li><strong style={{ color: "#ff8c00" }}>No Refunds:</strong> Due to the immediate digital nature of our services (access to AI tools, server resources, and keys), all contributions are final and non-refundable. We do not offer refunds for &quot;change of mind,&quot; unused credits, or dissatisfaction with specific features.</li>
                    </ul>
                </div>

                {/* 2. Credit Reset Policy */}
                <div style={{ marginBottom: "35px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>⏳</span> 2. Credit Reset Policy (Use It or Lose It)
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>Monthly Reset:</strong> All monthly usage quotas (including but not limited to ForgeMind prompts, 3D Model generations, and API calls) are valid only for the current billing cycle.</li>
                        <li><strong style={{ color: "#ff8c00" }}>No Rollovers:</strong> Unused credits or generations do not roll over to the next month. If you do not use your allowance before your billing cycle renews, the remaining balance is forfeited and reset to the standard cap for your tier.</li>
                    </ul>
                </div>

                {/* 3. Cancellation Policy */}
                <div style={{ marginBottom: "35px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>🚫</span> 3. Cancellation Policy
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>Cycle Completion:</strong> If you cancel, your benefits (including &quot;Pro&quot; status and Discord roles) will remain active until the end of the current billing period you have already paid for.</li>
                    </ul>
                </div>

                {/* 4. License & Usage Rights */}
                <div style={{ marginBottom: "35px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>📜</span> 4. License & Usage Rights
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>The Tool (Software):</strong> You are granted a limited, non-transferable, personal license to use the Nebublox AI plugin and website. You may not resell, redistribute, reverse-engineer, or share the plugin files or access keys.</li>
                        <li><strong style={{ color: "#ff8c00" }}>The Output (Generations):</strong> You retain full ownership of the assets (scripts, models, worlds) you generate using Nebublox AI. You are free to use these generated assets in your personal or commercial Roblox projects (e.g., your games).</li>
                        <li><strong style={{ color: "#ff8c00" }}>Merchant License (Master Smith Only):</strong> Specific commercial rights regarding the resale of generated assets as standalone packs are reserved for Master Smith tier holders, subject to the specific terms of that tier.</li>
                    </ul>
                </div>

                {/* 5. Account Security */}
                <div style={{ marginBottom: "35px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>🛡️</span> 5. Account Security & Third-Party Sync
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>Discord Linking:</strong> You are responsible for correctly linking your Discord and Roblox accounts to receive your roles and perks.</li>
                        <li><strong style={{ color: "#ff8c00" }}>Account Sharing:</strong> Sharing your API key or Pro account credentials with others is strictly prohibited and may result in the termination of your license without refund.</li>
                    </ul>
                </div>

                {/* 6. Chargeback Policy */}
                <div style={{ marginBottom: "35px" }}>
                    <h2 style={{ color: "#ff5500", fontSize: "1.4rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>⚖️</span> 6. Chargeback Policy
                    </h2>
                    <ul style={{ color: "#aaa", margin: "0 0 0 20px", lineHeight: "1.8", listStyle: "disc" }}>
                        <li><strong style={{ color: "#ff8c00" }}>Zero Tolerance:</strong> To protect our community and infrastructure, any unauthorized chargebacks or payment disputes initiated without first contacting support will result in an immediate and permanent ban from the Nebublox service, revocation of all API keys, and a ban from our Discord community.</li>
                    </ul>
                </div>

                <button
                    className="btn"
                    style={{ margin: "40px auto 0", display: "block", maxWidth: "200px" }}
                    onClick={() => setIsOpen(false)}
                >
                    ⚒️ I Understand
                </button>
            </div>
        </div>
    );
}