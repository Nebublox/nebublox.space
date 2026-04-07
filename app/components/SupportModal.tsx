"use client";

import { useState, useEffect } from 'react';

export default function SupportModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Listen for the open event (e.g., from the footer "Support" button)
        const handleOpen = () => {
            setIsOpen(true);
            setIsSubmitted(false); // Reset on open
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('open-support-modal', handleOpen);
        }
        return () => {
            if (typeof window !== 'undefined') window.removeEventListener('open-support-modal', handleOpen);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSubmitted(true);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
            <div className="support-modal-content" style={{ maxWidth: "500px", margin: "60px auto", padding: "40px", background: "linear-gradient(145deg, #0a0a0a, #000)", border: "1px solid rgba(255, 85, 0, 0.3)", borderRadius: "16px", position: "relative" }}>

                <span
                    style={{ position: "absolute", top: "20px", right: "25px", fontSize: "2rem", color: "#666", cursor: "pointer" }}
                    onClick={() => setIsOpen(false)}
                >
                    ×
                </span>

                {!isSubmitted ? (
                    <>
                        <h1 style={{ color: "#ff5500", fontSize: "1.8rem", marginBottom: "10px", textAlign: "center" }}>
                            🔥 Need Help?
                        </h1>
                        <p style={{ color: "#888", textAlign: "center", marginBottom: "30px", fontSize: "0.9rem" }}>
                            Submit a support request and our team will get back to you.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Your Name *</label>
                                <input type="text" required placeholder="Enter your name" style={{ width: "100%", background: "#000", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "6px", fontFamily: "'Montserrat', sans-serif" }} />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Email (optional)</label>
                                <input type="email" placeholder="your@email.com" style={{ width: "100%", background: "#000", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "6px", fontFamily: "'Montserrat', sans-serif" }} />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Subject *</label>
                                <input type="text" required placeholder="What do you need help with?" style={{ width: "100%", background: "#000", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "6px", fontFamily: "'Montserrat', sans-serif" }} />
                            </div>

                            <div style={{ marginBottom: "25px" }}>
                                <label style={{ display: "block", color: "#666", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Message *</label>
                                <textarea required placeholder="Describe your issue in detail..." rows={4} style={{ width: "100%", background: "#000", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "6px", fontFamily: "'Montserrat', sans-serif", resize: "vertical" }}></textarea>
                            </div>

                            <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #ff5500, #d32f2f)", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px" }}>
                                <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Submit Request
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "30px" }}>
                        <i style={{ fontSize: "4rem", color: "#22c55e", marginBottom: "15px" }} className="fas fa-check-circle"></i>
                        <h2 style={{ color: "#fff", marginBottom: "10px" }}>Request Submitted!</h2>
                        <p style={{ color: "#888" }}>We&apos;ll get back to you as soon as possible.</p>
                        <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "15px" }}>
                            For faster support, join <a href="https://discord.gg/nebublox" target="_blank" rel="noopener noreferrer" style={{ color: "#5865F2" }}>Discord</a>
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ marginTop: '20px', background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}