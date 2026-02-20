/* ─── Visitor Analytics Collector ─── */
/* Silently collects comprehensive browser/device/network data and sends to Supabase */

(function () {
    "use strict";

    const SUPABASE_URL = "https://fsqmrtxeubguzviixniq.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcW1ydHhldWJndXp2aWl4bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzk1NTksImV4cCI6MjA4NDkxNTU1OX0.Lw3mH4Io_RWJaCSj_Cg27HaNFfEf53vJtHFf2XV1_pk";
    const ANALYTICS_SOURCE = window.__analyticsSource || "terminal";

    // Generate session ID
    const sessionId = crypto.randomUUID
        ? crypto.randomUUID()
        : "s_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Store geolocation globally for weather command
    window.__visitorGeo = null;

    /* ═══════════════════════════════════════════
       DEVICE INFO
       ═══════════════════════════════════════════ */
    function collectDeviceInfo() {
        const nav = navigator;
        return {
            userAgent: nav.userAgent || "",
            platform: nav.platform || "",
            vendor: nav.vendor || "",
            mobile: /Mobi|Android|iPhone|iPad/i.test(nav.userAgent),
            touchPoints: nav.maxTouchPoints || 0,
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenAvailWidth: screen.availWidth,
            screenAvailHeight: screen.availHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            deviceMemory: nav.deviceMemory || null,
            hardwareConcurrency: nav.hardwareConcurrency || null,
            maxTouchPoints: nav.maxTouchPoints || 0,
        };
    }

    /* ═══════════════════════════════════════════
       USER-AGENT CLIENT HINTS (device model, OS version, architecture)
       ═══════════════════════════════════════════ */
    async function collectClientHints() {
        try {
            const uaData = navigator.userAgentData;
            if (!uaData) return null;

            const hints = {
                brands: uaData.brands || [],
                mobile: uaData.mobile,
                platform: uaData.platform || null,
            };

            // Request high-entropy values (model, OS version, CPU arch)
            if (uaData.getHighEntropyValues) {
                try {
                    const he = await uaData.getHighEntropyValues([
                        "model",
                        "platformVersion",
                        "architecture",
                        "bitness",
                        "fullVersionList",
                        "wow64",
                        "formFactor",
                    ]);
                    hints.model = he.model || null;
                    hints.platformVersion = he.platformVersion || null;
                    hints.architecture = he.architecture || null;
                    hints.bitness = he.bitness || null;
                    hints.wow64 = he.wow64 || false;
                    hints.formFactor = he.formFactor || null;
                    hints.fullVersionList = he.fullVersionList || [];
                } catch (e) {
                    // Some values may be restricted
                }
            }
            return hints;
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       GPU INFO (WebGL renderer)
       ═══════════════════════════════════════════ */
    function collectGPUInfo() {
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) return null;

            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            const gpu = {
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
                version: gl.getParameter(gl.VERSION),
                shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                aliasedPointRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
                supportedExtensions: gl.getSupportedExtensions() ? gl.getSupportedExtensions().length : 0,
            };

            // Check WebGL2
            const gl2 = canvas.getContext("webgl2");
            gpu.webgl2 = !!gl2;

            return gpu;
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       BROWSER CAPABILITIES
       ═══════════════════════════════════════════ */
    function collectBrowserInfo() {
        const nav = navigator;
        return {
            language: nav.language || "",
            languages: nav.languages ? Array.from(nav.languages) : [],
            cookieEnabled: nav.cookieEnabled,
            doNotTrack: nav.doNotTrack || null,
            globalPrivacyControl: nav.globalPrivacyControl || null,
            pdfViewerEnabled: nav.pdfViewerEnabled || false,
            onLine: nav.onLine,
            webdriver: nav.webdriver || false,
            serviceWorker: !!nav.serviceWorker,
            bluetooth: !!nav.bluetooth,
            usb: !!nav.usb,
            mediaDevices: !!nav.mediaDevices,
            geolocation: !!nav.geolocation,
            clipboard: !!nav.clipboard,
            credentials: !!nav.credentials,
            wakeLock: !!nav.wakeLock,
            share: !!nav.share,
            vibrate: !!nav.vibrate,
            webkitTemporaryStorage: !!nav.webkitTemporaryStorage,
        };
    }

    /* ═══════════════════════════════════════════
       NETWORK / CONNECTION
       ═══════════════════════════════════════════ */
    function collectConnectionInfo() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!conn) return null;
        return {
            effectiveType: conn.effectiveType || null,
            downlink: conn.downlink || null,
            downlinkMax: conn.downlinkMax || null,
            rtt: conn.rtt || null,
            saveData: conn.saveData || false,
            type: conn.type || null,
        };
    }

    /* ═══════════════════════════════════════════
       BATTERY
       ═══════════════════════════════════════════ */
    async function collectBatteryInfo() {
        try {
            if (!navigator.getBattery) return null;
            const battery = await navigator.getBattery();
            return {
                charging: battery.charging,
                level: Math.round(battery.level * 100),
                chargingTime: battery.chargingTime === Infinity ? null : battery.chargingTime,
                dischargingTime: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
            };
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       PERFORMANCE TIMING
       ═══════════════════════════════════════════ */
    function collectPerformanceInfo() {
        try {
            const perf = {};

            // Navigation timing
            if (performance.getEntriesByType) {
                const navEntries = performance.getEntriesByType("navigation");
                if (navEntries.length > 0) {
                    const nav = navEntries[0];
                    perf.dnsLookup = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
                    perf.tcpConnect = Math.round(nav.connectEnd - nav.connectStart);
                    perf.ttfb = Math.round(nav.responseStart - nav.requestStart);
                    perf.responseTime = Math.round(nav.responseEnd - nav.responseStart);
                    perf.domInteractive = Math.round(nav.domInteractive - nav.startTime);
                    perf.domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
                    perf.pageLoad = Math.round(nav.loadEventEnd - nav.startTime);
                    perf.transferSize = nav.transferSize || null;
                    perf.encodedBodySize = nav.encodedBodySize || null;
                    perf.decodedBodySize = nav.decodedBodySize || null;
                    perf.protocol = nav.nextHopProtocol || null;
                    perf.redirectCount = nav.redirectCount || 0;
                }
            }

            // Paint timing
            if (performance.getEntriesByType) {
                const paintEntries = performance.getEntriesByType("paint");
                paintEntries.forEach(function (entry) {
                    if (entry.name === "first-paint") perf.firstPaint = Math.round(entry.startTime);
                    if (entry.name === "first-contentful-paint") perf.firstContentfulPaint = Math.round(entry.startTime);
                });
            }

            // Resource count
            if (performance.getEntriesByType) {
                const resources = performance.getEntriesByType("resource");
                perf.resourceCount = resources.length;
                perf.totalTransferSize = resources.reduce(function (sum, r) { return sum + (r.transferSize || 0); }, 0);
            }

            // Memory (Chrome)
            if (performance.memory) {
                perf.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
                perf.totalJSHeapSize = performance.memory.totalJSHeapSize;
                perf.usedJSHeapSize = performance.memory.usedJSHeapSize;
            }

            return perf;
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       STORAGE ESTIMATE
       ═══════════════════════════════════════════ */
    async function collectStorageInfo() {
        try {
            if (!navigator.storage || !navigator.storage.estimate) return null;
            const est = await navigator.storage.estimate();
            return {
                quota: est.quota || null,
                usage: est.usage || null,
                percentUsed: est.quota ? Math.round((est.usage / est.quota) * 10000) / 100 : null,
            };
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       PERMISSIONS STATE
       ═══════════════════════════════════════════ */
    async function collectPermissions() {
        try {
            if (!navigator.permissions) return null;
            const permNames = ["notifications", "camera", "microphone", "geolocation", "persistent-storage", "accelerometer", "gyroscope", "magnetometer", "clipboard-read", "clipboard-write"];
            const results = {};
            for (const name of permNames) {
                try {
                    const status = await navigator.permissions.query({ name: name });
                    results[name] = status.state;
                } catch (e) {
                    // Permission not supported — skip
                }
            }
            return Object.keys(results).length > 0 ? results : null;
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       CANVAS FINGERPRINT (hash-based, not tracking pixels)
       ═══════════════════════════════════════════ */
    function collectCanvasFingerprint() {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 50;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Draw a variety of shapes and text
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = "#069";
            ctx.fillText("Cwm fjordbank", 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText("glyphs vext quiz", 4, 30);

            // Convert to data URL and hash it
            const dataUrl = canvas.toDataURL();
            let hash = 0;
            for (let i = 0; i < dataUrl.length; i++) {
                const char = dataUrl.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 32-bit int
            }
            return hash.toString(16);
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       MEDIA CAPABILITIES
       ═══════════════════════════════════════════ */
    function collectMediaCapabilities() {
        try {
            const audio = document.createElement("audio");
            const video = document.createElement("video");
            const caps = {};

            // Audio codecs
            const audioCodecs = ["audio/mpeg", "audio/ogg; codecs=vorbis", "audio/ogg; codecs=opus", "audio/wav", "audio/webm; codecs=opus", "audio/aac", "audio/flac"];
            caps.audio = {};
            audioCodecs.forEach(function (codec) {
                const result = audio.canPlayType(codec);
                if (result) caps.audio[codec] = result;
            });

            // Video codecs
            const videoCodecs = ["video/mp4; codecs=avc1.42E01E", "video/mp4; codecs=hev1", "video/webm; codecs=vp8", "video/webm; codecs=vp9", "video/webm; codecs=av1", "video/ogg; codecs=theora"];
            caps.video = {};
            videoCodecs.forEach(function (codec) {
                const result = video.canPlayType(codec);
                if (result) caps.video[codec] = result;
            });

            return caps;
        } catch (e) {
            return null;
        }
    }

    /* ═══════════════════════════════════════════
       IP GEOLOCATION (ip-api.com)
       ═══════════════════════════════════════════ */
    async function fetchGeoLocation() {
        try {
            const response = await fetch(
                "http://ip-api.com/json/?fields=status,message,query,city,regionName,country,countryCode,lat,lon,timezone,isp,org,as,mobile,proxy,hosting"
            );
            const data = await response.json();
            if (data.status === "success") {
                window.__visitorGeo = {
                    city: data.city,
                    region: data.regionName,
                    country: data.country,
                    countryCode: data.countryCode,
                    lat: data.lat,
                    lon: data.lon,
                    timezone: data.timezone,
                };
                return {
                    ip: data.query,
                    location: {
                        city: data.city,
                        region: data.regionName,
                        country: data.country,
                        countryCode: data.countryCode,
                        lat: data.lat,
                        lon: data.lon,
                        timezone: data.timezone,
                        isp: data.isp,
                        org: data.org,
                        as: data.as,
                        mobile: data.mobile,
                        proxy: data.proxy,
                        hosting: data.hosting,
                    },
                };
            }
            return { ip: null, location: null };
        } catch (e) {
            return { ip: null, location: null };
        }
    }

    /* ═══════════════════════════════════════════
       SCREEN ORIENTATION
       ═══════════════════════════════════════════ */
    function getOrientation() {
        if (screen.orientation) return screen.orientation.type;
        if (window.innerWidth > window.innerHeight) return "landscape";
        return "portrait";
    }

    /* ═══════════════════════════════════════════
       PAGE VISIBILITY TRACKING
       ═══════════════════════════════════════════ */
    let visibleTime = 0;
    let hiddenTime = 0;
    let lastVisibilityChange = Date.now();
    let isVisible = !document.hidden;

    document.addEventListener("visibilitychange", function () {
        const now = Date.now();
        const elapsed = Math.round((now - lastVisibilityChange) / 1000);
        if (isVisible) {
            visibleTime += elapsed;
        } else {
            hiddenTime += elapsed;
        }
        isVisible = !document.hidden;
        lastVisibilityChange = now;
    });

    function getVisibilityStats() {
        // Flush current period
        const now = Date.now();
        const elapsed = Math.round((now - lastVisibilityChange) / 1000);
        const vt = visibleTime + (isVisible ? elapsed : 0);
        const ht = hiddenTime + (isVisible ? 0 : elapsed);
        return { visible: vt, hidden: ht };
    }

    /* ═══════════════════════════════════════════
       SCROLL DEPTH TRACKING
       ═══════════════════════════════════════════ */
    let maxScrollDepth = 0;

    function updateScrollDepth() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        ) - window.innerHeight;
        if (docHeight > 0) {
            const pct = Math.round((scrollTop / docHeight) * 100);
            if (pct > maxScrollDepth) maxScrollDepth = pct;
        }
    }

    window.addEventListener("scroll", updateScrollDepth, { passive: true });

    /* ═══════════════════════════════════════════
       RETURN VISITOR DETECTION
       ═══════════════════════════════════════════ */
    function getReturnVisitorInfo() {
        try {
            const KEY = "__terminal_visits";
            const stored = localStorage.getItem(KEY);
            let visits = stored ? JSON.parse(stored) : null;
            const now = new Date().toISOString();

            if (!visits) {
                visits = { count: 1, firstVisit: now, lastVisit: now };
            } else {
                visits.count += 1;
                visits.lastVisit = now;
            }

            localStorage.setItem(KEY, JSON.stringify(visits));

            return {
                visitNumber: visits.count,
                isReturn: visits.count > 1,
                firstVisitAt: visits.firstVisit,
            };
        } catch (e) {
            return { visitNumber: 1, isReturn: false, firstVisitAt: null };
        }
    }

    /* ═══════════════════════════════════════════
       SEND TO SUPABASE
       ═══════════════════════════════════════════ */
    async function sendToSupabase(payload) {
        try {
            await fetch(SUPABASE_URL + "/rest/v1/visitor_analytics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_KEY,
                    Authorization: "Bearer " + SUPABASE_KEY,
                    Prefer: "return=minimal",
                },
                body: JSON.stringify(payload),
            });
        } catch (e) {
            // Silent fail — analytics should never break the site
        }
    }

    /* ═══════════════════════════════════════════
       MAIN COLLECTOR — runs once on page load
       ═══════════════════════════════════════════ */
    async function collectAndSend() {
        // Wait for page to finish loading
        await new Promise(function (resolve) {
            if (document.readyState === "complete") {
                resolve();
            } else {
                window.addEventListener("load", resolve);
            }
        });

        // Small delay for paint metrics
        await new Promise(function (resolve) { setTimeout(resolve, 1500); });

        // Collect everything in parallel
        const [geo, battery, clientHints, storage, permissions] = await Promise.all([
            fetchGeoLocation(),
            collectBatteryInfo(),
            collectClientHints(),
            collectStorageInfo(),
            collectPermissions(),
        ]);

        // Return visitor info
        const returnInfo = getReturnVisitorInfo();

        const payload = {
            session_id: sessionId,
            ip_address: geo.ip,
            location: geo.location,
            device: collectDeviceInfo(),
            browser: collectBrowserInfo(),
            connection: collectConnectionInfo(),
            battery: battery,
            performance: collectPerformanceInfo(),
            gpu: collectGPUInfo(),
            client_hints: clientHints,
            storage: storage,
            permissions: permissions,
            canvas_fingerprint: collectCanvasFingerprint(),
            media_capabilities: collectMediaCapabilities(),
            referrer: document.referrer || null,
            page_url: window.location.href,
            source: ANALYTICS_SOURCE,
            uptime: 0,
            visible_time: 0,
            hidden_time: 0,
            scroll_depth: 0,
            visit_number: returnInfo.visitNumber,
            is_return_visitor: returnInfo.isReturn,
            first_visit_at: returnInfo.firstVisitAt,
            screen_orientation: getOrientation(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        };

        await sendToSupabase(payload);

        // ─── Heartbeat: update ALL dynamic metrics ───
        const startTime = Date.now();

        async function getHeartbeatPayload() {
            const uptimeSecs = Math.round((Date.now() - startTime) / 1000);
            const vis = getVisibilityStats();

            // Re-collect dynamic data
            const [battery, storage, permissions] = await Promise.all([
                collectBatteryInfo(),
                collectStorageInfo(),
                collectPermissions(),
            ]);

            return {
                p_session_id: sessionId,
                p_uptime: uptimeSecs,
                p_visible_time: vis.visible,
                p_hidden_time: vis.hidden,
                p_scroll_depth: maxScrollDepth,
                p_battery: battery,
                p_connection: collectConnectionInfo(),
                p_performance: collectPerformanceInfo(),
                p_storage: storage,
                p_permissions: permissions,
                p_screen_orientation: getOrientation(),
            };
        }

        async function sendHeartbeat() {
            try {
                const payload = await getHeartbeatPayload();
                fetch(SUPABASE_URL + "/rest/v1/rpc/update_visitor_heartbeat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: SUPABASE_KEY,
                        Authorization: "Bearer " + SUPABASE_KEY,
                    },
                    body: JSON.stringify(payload),
                });
            } catch (e) {
                // Silent fail
            }
        }

        // Flush stats on page close
        function flushOnExit() {
            try {
                const uptimeSecs = Math.round((Date.now() - startTime) / 1000);
                const vis = getVisibilityStats();
                // Synchronous-only data for unload (no await)
                const payload = {
                    p_session_id: sessionId,
                    p_uptime: uptimeSecs,
                    p_visible_time: vis.visible,
                    p_hidden_time: vis.hidden,
                    p_scroll_depth: maxScrollDepth,
                    p_connection: collectConnectionInfo(),
                    p_screen_orientation: getOrientation(),
                };
                fetch(SUPABASE_URL + "/rest/v1/rpc/update_visitor_heartbeat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: SUPABASE_KEY,
                        Authorization: "Bearer " + SUPABASE_KEY,
                    },
                    body: JSON.stringify(payload),
                    keepalive: true,
                });
            } catch (e) {
                // Silent fail
            }
        }

        // First heartbeat after 10 seconds, then every 45 seconds
        setTimeout(function () {
            sendHeartbeat();
            setInterval(sendHeartbeat, 45000);
        }, 10000);

        // Flush on page close
        window.addEventListener("beforeunload", flushOnExit);
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
                flushOnExit();
            }
        });
    }

    // Run the collector
    collectAndSend();
})();
