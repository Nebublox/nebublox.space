/**
 * BloxSmith Translation Service with Supabase Cache
 * Uses Supabase for caching + MyMemory API for new translations
 * 
 * Benefits:
 * - Cached translations = instant loading
 * - Shared cache = translate once, works for all users
 * - Falls back to free API when not cached
 */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Supabase (same as your existing config)
        supabaseUrl: 'https://ejsxxoilsbyxchunoeml.supabase.co',
        supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqc3h4b2lsc2J5eGNodW5vZW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTI0MzAsImV4cCI6MjA1MDcyODQzMH0.4p7FylCwknYMpnsvMUVBDC0jLJpTQgRYgYfARcKJGJE',

        // Free translation API fallback
        translateApiUrl: 'https://api.mymemory.translated.net/get',

        defaultLanguage: 'en',
        storageKey: 'bloxsmith_language',
        tableName: 'translation_cache'
    };

    let supabase = null;
    const localCache = new Map();
    let currentLanguage = CONFIG.defaultLanguage;

    // ============================================
    // SUPABASE SETUP
    // ============================================
    async function initSupabase() {
        // Load Supabase client if not already loaded
        if (typeof window.supabase !== 'undefined') {
            return window.supabase;
        }

        try {
            // Dynamic import of Supabase
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
            console.log('[Translation] Supabase connected');
            return supabase;
        } catch (e) {
            console.warn('[Translation] Supabase not available, using local cache only');
            return null;
        }
    }

    // ============================================
    // CREATE UI ELEMENTS
    // ============================================
    function createLanguageSelector() {
        if (document.getElementById('bloxsmith-lang-selector')) return;

        const styles = document.createElement('style');
        styles.textContent = `
        .bloxsmith-lang-container {
            position: relative;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            margin-left: 10px; /* Spacing from Discord */
        }
        
        /* Mobile positioning - Keep it inline or adjust */
        @media (max-width: 1024px) {
            .bloxsmith-lang-container {
                width: 35px !important;
                height: 35px !important;
            }
        }

        /* Hover Effect: Scale & Magma Glow */
        .bloxsmith-lang-container:hover {
            transform: scale(1.15);
            filter: drop-shadow(0 0 8px rgba(255, 85, 0, 0.8));
        }

        .bloxsmith-lang-icon {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
            pointer-events: none; /* Let clicks pass to select */
        }

        /* Invisible Overlay Select */
        .bloxsmith-lang-select {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            z-index: 10;
        }

        .bloxsmith-translate-loading {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .bloxsmith-translate-loading.active {
            opacity: 1;
            pointer-events: all;
        }
        .bloxsmith-spinner {
            width: 50px; height: 50px;
            border: 3px solid rgba(255, 85, 0, 0.2);
            border-top-color: #ff5500;
            border-radius: 50%;
            animation: bloxsmith-spin 0.8s linear infinite;
        }
        .bloxsmith-translate-loading p {
            color: #fff;
            margin-top: 15px;
            font-size: 1rem;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        @keyframes bloxsmith-spin { to { transform: rotate(360deg); } }
    `;
        document.head.appendChild(styles);

        const container = document.createElement('div');
        container.className = 'bloxsmith-lang-container';
        container.id = 'bloxsmith-lang-selector';
        container.title = "Translate Page";

        container.innerHTML = `
        <img src="assets/images/translator-anvil.png" alt="Translate" class="bloxsmith-lang-icon">
        <select class="bloxsmith-lang-select" id="bloxsmith-lang-dropdown" aria-label="Select Language">
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="ja">日本語 (JA)</option>
            <option value="zh">中文 (ZH)</option>
            <option value="pt">Português (PT)</option>
            <option value="ar">العربية (AR)</option>
            <option value="ko">한국어 (KO)</option>
            <option value="it">Italiano (IT)</option>
            <option value="ru">Русский (RU)</option>
            <option value="hi">हिन्दी (HI)</option>
        </select>
    `;

        // Inject into Navbar (next to Discord)
        const navbarActions = document.querySelector('.nav-links > div:last-child');
        if (navbarActions) {
            navbarActions.appendChild(container);
        } else {
            // Fallback if navbar not found
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '70px';
            document.body.appendChild(container);
        }

        const loading = document.createElement('div');
        loading.className = 'bloxsmith-translate-loading';
        loading.id = 'bloxsmith-translate-loading';
        loading.innerHTML = '<div class="bloxsmith-spinner"></div><p>Forging Translation...</p>';
        document.body.appendChild(loading);

        const dropdown = document.getElementById('bloxsmith-lang-dropdown');

        const savedLang = localStorage.getItem(CONFIG.storageKey);
        if (savedLang && savedLang !== CONFIG.defaultLanguage) {
            dropdown.value = savedLang;
            setTimeout(() => translatePage(savedLang), 500);
        }

        dropdown.addEventListener('change', (e) => translatePage(e.target.value));
    }

    // ============================================
    // TRANSLATION WITH SUPABASE CACHE
    // ============================================

    // Check Supabase cache first
    async function getCachedTranslation(text, targetLang) {
        const cacheKey = `${text}-${targetLang}`;

        // Check local memory cache first (fastest)
        if (localCache.has(cacheKey)) {
            return localCache.get(cacheKey);
        }

        // Check Supabase cache
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from(CONFIG.tableName)
                    .select('translated_text')
                    .eq('source_text', text)
                    .eq('target_lang', targetLang)
                    .single();

                if (data && !error) {
                    localCache.set(cacheKey, data.translated_text);
                    return data.translated_text;
                }
            } catch (e) {
                // Cache miss, will translate
            }
        }

        return null;
    }

    // Save translation to Supabase cache
    async function cacheTranslation(text, targetLang, translatedText) {
        const cacheKey = `${text}-${targetLang}`;
        localCache.set(cacheKey, translatedText);

        if (supabase) {
            try {
                await supabase.from(CONFIG.tableName).upsert({
                    source_text: text,
                    target_lang: targetLang,
                    translated_text: translatedText,
                    source_lang: 'en',
                    created_at: new Date().toISOString()
                }, { onConflict: 'source_text,target_lang' });
            } catch (e) {
                // Cache save failed, not critical
            }
        }
    }

    // Translate using free API
    async function translateViaAPI(text, targetLang) {
        const url = `${CONFIG.translateApiUrl}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.responseStatus === 200) {
                return data.responseData.translatedText;
            }
        } catch (e) {
            console.warn('[Translation] API error:', e.message);
        }
        return text;
    }

    // Main translate function with cache
    async function translateText(text, targetLang) {
        // 1. Try cache first
        const cached = await getCachedTranslation(text, targetLang);
        if (cached) return cached;

        // 2. Translate via API
        const translated = await translateViaAPI(text, targetLang);

        // 3. Cache for next time
        if (translated !== text) {
            await cacheTranslation(text, targetLang, translated);
        }

        return translated;
    }

    function getTranslatableElements() {
        const elements = [];
        const selectors = 'h1, h2, h3, h4, h5, h6, p, a, button, label, span, li, td, th';

        document.querySelectorAll(selectors).forEach(el => {
            if (el.hasAttribute('data-original-text')) return;
            if (el.closest('script, style, noscript, .bloxsmith-lang-container')) return;

            const text = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
                ? el.textContent.trim()
                : null;

            if (text && text.length > 1 && text.length < 500) {
                el.setAttribute('data-original-text', text);
                elements.push({ el, text });
            }
        });

        return elements;
    }

    async function translatePage(targetLang) {
        if (targetLang === CONFIG.defaultLanguage) {
            restoreOriginalText();
            return;
        }

        const loading = document.getElementById('bloxsmith-translate-loading');
        loading?.classList.add('active');

        const elements = getTranslatableElements();

        for (let i = 0; i < elements.length; i++) {
            const { el, text } = elements[i];
            try {
                const translated = await translateText(text, targetLang);
                el.textContent = translated;
            } catch (e) { }

            if (i % 5 === 0 && i > 0) {
                await new Promise(r => setTimeout(r, 30));
            }
        }

        currentLanguage = targetLang;
        localStorage.setItem(CONFIG.storageKey, targetLang);
        loading?.classList.remove('active');
    }

    function restoreOriginalText() {
        document.querySelectorAll('[data-original-text]').forEach(el => {
            el.textContent = el.getAttribute('data-original-text');
        });
        currentLanguage = CONFIG.defaultLanguage;
        localStorage.setItem(CONFIG.storageKey, CONFIG.defaultLanguage);
    }

    // ============================================
    // INITIALIZE
    // ============================================
    async function init() {
        await initSupabase();
        createLanguageSelector();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.BloxSmithTranslate = {
        translatePage,
        restoreOriginalText,
        getCurrentLanguage: () => currentLanguage
    };
})();
