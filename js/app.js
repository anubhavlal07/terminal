/* ─── Terminal Engine ─── */
/* Depends on: commands.js, themes.js, utils.js (loaded before this) */

let before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const mobileHint = document.getElementById("mobileHint");

let git = 0;
let pw = false;
let pwd = false;
const commandHistory = [];
let ipAddress;
const pageLoadTime = Date.now();

// Tab-completion state
let tabIndex = -1;
let tabMatches = [];
let lastTabValue = "";

console.clear();

/* ─── Startup ─── */
setTimeout(function () {
    loopLines(banner, "margin", 40);
    setTimeout(function () {
        loopLines(intro, "", 80);
        textarea.focus();
    }, banner.length * 40 + 200);
}, 100);

window.addEventListener("keyup", enterKey);
window.addEventListener("keydown", handleKeyDown);

/* ─── Touch Support ─── */
document.body.addEventListener("click", function () {
    textarea.focus();
    hideMobileHint();
});

document.body.addEventListener("touchstart", function () {
    textarea.focus();
    hideMobileHint();
}, { passive: true });

function hideMobileHint() {
    if (mobileHint) {
        mobileHint.style.display = "none";
    }
}

/* ─── IP Address Display (uses geolocation from analytics.js) ─── */
function displayIPAddress() {
    let attempts = 0;
    const interval = setInterval(function () {
        attempts++;
        if (window.__visitorGeo) {
            clearInterval(interval);
            const geo = window.__visitorGeo;
            if (introEl) {
                introEl.innerHTML =
                    'Hello friend @ <span class="command">' + geo.city + ', ' + geo.country +
                    '</span>, <br> Welcome to my web terminal.';
            }
        } else if (attempts > 20) {
            clearInterval(interval);
            if (introEl) {
                introEl.innerHTML = "Hello friend <br> Welcome to my web terminal.";
            }
        }
    }, 500);
}
displayIPAddress();

/* ─── Console Easter Eggs ─── */
console.log(
    "%cYou found a secret! 😯",
    "color: #00ff88; font-weight: bold; font-size: 24px;"
);
console.log(
    "%cPassword: '" + password + "' — I wonder what it does? 🤨",
    "color: grey"
);

/* ─── Init ─── */
textarea.value = "";
command.innerHTML = textarea.value;

/* ─── Tab Completion ─── */
function handleKeyDown(e) {
    if (e.keyCode === 9) {
        // Tab key
        e.preventDefault();

        const currentValue = textarea.value.toLowerCase().trim();
        if (!currentValue) return;

        // If starting a new tab cycle
        if (currentValue !== lastTabValue || tabMatches.length === 0) {
            tabMatches = allCommands.filter(function (cmd) {
                return cmd.startsWith(currentValue) && cmd !== currentValue;
            });
            tabIndex = 0;
            lastTabValue = currentValue;
        }

        if (tabMatches.length === 0) return;

        if (tabMatches.length === 1) {
            // Single match
            textarea.value = tabMatches[0];
            command.innerHTML = tabMatches[0];
            tabMatches = [];
            tabIndex = -1;
            lastTabValue = "";
        } else {
            // Multiple matches — cycle
            const match = tabMatches[tabIndex % tabMatches.length];
            textarea.value = match;
            command.innerHTML = match;
            tabIndex++;
            lastTabValue = currentValue;
            showTabSuggestions(tabMatches, match);
        }
    } else if (e.keyCode !== 38 && e.keyCode !== 40) {
        // Reset tab state on any other key
        tabMatches = [];
        tabIndex = -1;
        lastTabValue = "";
    }
}

function showTabSuggestions(matches, active) {
    const existing = document.querySelector(".tab-suggestions");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.className = "tab-suggestions";

    matches.forEach(function (m) {
        const span = document.createElement("span");
        span.textContent = m;
        if (m === active) {
            span.style.borderColor = "var(--text-primary)";
            span.style.fontWeight = "600";
        }
        container.appendChild(span);
    });

    before.parentNode.insertBefore(container, before);
    scrollToBottom();
}

/* ─── Enter Key & Input Handling ─── */
function enterKey(e) {
    if (e.keyCode === 9) return;

    if (e.keyCode === 181) {
        document.location.reload(true);
    }

    if (pw) {
        const et = "•";
        const w = textarea.value.length;
        command.innerHTML = et.repeat(w);
        if (textarea.value === password) {
            pwd = true;
        }
        if (pwd && e.keyCode === 13) {
            loopLines(secret, "color2 margin", 120);
            command.innerHTML = "";
            textarea.value = "";
            pwd = false;
            pw = false;
            liner.classList.remove("password");
        } else if (e.keyCode === 13) {
            addLine("Wrong password", "error", 0);
            command.innerHTML = "";
            textarea.value = "";
            pw = false;
            liner.classList.remove("password");
        }
    } else {
        if (e.keyCode === 13) {
            const sug = document.querySelector(".tab-suggestions");
            if (sug) sug.remove();

            commandHistory.push(command.innerHTML);
            git = commandHistory.length;
            addLine("visitor@terminal:~$ " + command.innerHTML, "no-animation", 0);
            commander(command.innerHTML.toLowerCase().trim());
            command.innerHTML = "";
            textarea.value = "";
        }
        if (e.keyCode === 38 && git !== 0) {
            git -= 1;
            textarea.value = commandHistory[git];
            command.innerHTML = textarea.value;
        }
        if (e.keyCode === 40 && git !== commandHistory.length) {
            git += 1;
            if (commandHistory[git] === undefined) {
                textarea.value = "";
            } else {
                textarea.value = commandHistory[git];
            }
            command.innerHTML = textarea.value;
        }
    }
}

/* ─── Command Router ─── */
function commander(cmd) {
    switch (cmd) {
        case "ls":
        case "help":
            loopLines(ls, "color2 margin", 50);
            break;
        case "whois":
        case "about":
            loopLines(whois, "color2 margin", 60);
            break;
        case "whoami":
            loopLines(whoami, "color2 margin", 60);
            break;
        case "pwd":
            loopLines(presentWorkingDirectory, "color2 margin", 60);
            break;
        case "sudo":
            addLine("Oh no, you're not admin...", "color2", 80);
            setTimeout(function () {
                window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }, 1000);
            break;
        case "social":
            loopLines(social, "color2 margin", 60);
            break;
        case "secret":
            liner.classList.add("password");
            pw = true;
            break;
        case "projects":
            loopLines(projects, "color2 margin", 60);
            break;
        case "password":
            addLine(
                '<span class="inherit"> Lol! Nice try! You\'re gonna have to try harder than that! 😂</span>',
                "error",
                100
            );
            break;
        case "history":
            addLine("<br>", "", 0);
            loopLines(commandHistory, "color2", 50);
            addLine("<br>", "command", 50 * commandHistory.length + 50);
            break;
        case "email":
            addLine(
                'Opening mailto: <a href="mailto:anubhavlal.15@gmail.com">anubhavlal.15@gmail.com</a>...',
                "color2",
                80
            );
            newTab(email);
            break;
        case "clear":
            setTimeout(function () {
                terminal.innerHTML = '<a id="before"></a>';
                before = document.getElementById("before");
            }, 1);
            break;
        case "intro":
            loopLines(intro, "", 80);
            break;
        case "banner":
            loopLines(banner, "margin", 40);
            break;

        // ─── Extended Commands ───
        case "theme":
            const theme = cycleTheme();
            addLine(
                'Theme set to <span class="command">' + theme.label + "</span> " + theme.icon,
                "color2",
                0
            );
            break;
        case "date":
            const now = new Date();
            addLine(
                '<span class="color2">' + now.toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZoneName: "short",
                }) + "</span>",
                "margin",
                0
            );
            break;
        case "uptime":
            const elapsed = Date.now() - pageLoadTime;
            const secs = Math.floor(elapsed / 1000);
            const mins = Math.floor(secs / 60);
            const hrs = Math.floor(mins / 60);
            let uptimeStr = "";
            if (hrs > 0) uptimeStr += hrs + "h ";
            if (mins % 60 > 0 || hrs > 0) uptimeStr += (mins % 60) + "m ";
            uptimeStr += (secs % 60) + "s";
            addLine(
                '<span class="color2">Session uptime: <span class="command">' + uptimeStr + "</span></span>",
                "margin",
                0
            );
            break;
        case "skills":
            addLine("<br>", "", 0);
            addLine("<b>Technical Skills</b>", "color2 margin", 50);
            addLine("<br>", "", 60);
            skillsData.forEach(function (skill, i) {
                const delay = 100 + i * 80;
                setTimeout(function () {
                    const el = document.createElement("div");
                    el.className = "skill-bar-container margin";
                    el.innerHTML =
                        '<span class="skill-name">' + skill.name + '</span>' +
                        '<div class="skill-bar"><div class="skill-bar-fill" data-level="' + skill.level + '"></div></div>' +
                        '<span class="skill-percent">' + skill.level + '%</span>';
                    before.parentNode.insertBefore(el, before);
                    setTimeout(function () {
                        const fill = el.querySelector(".skill-bar-fill");
                        if (fill) fill.style.width = skill.level + "%";
                    }, 50);
                    scrollToBottom();
                }, delay);
            });
            setTimeout(function () {
                addLine("<br>", "", 0);
            }, 100 + skillsData.length * 80 + 100);
            break;
        case "weather":
            const wGeo = window.__visitorGeo;
            const weatherCity = wGeo && wGeo.city ? wGeo.city : "";
            const weatherLabel = weatherCity ? weatherCity + ", " + (wGeo.country || "") : "your location";
            addLine('<span class="color2">Fetching weather for <span class="command">' + weatherLabel + '</span>...</span>', "margin", 0);
            const weatherUrl = weatherCity
                ? "https://wttr.in/" + encodeURIComponent(weatherCity) + "?format=%c+%C+%t+%w+%h&m"
                : "https://wttr.in/?format=%c+%C+%t+%w+%h&m";
            fetch(weatherUrl)
                .then(function (r) { return r.text(); })
                .then(function (data) {
                    addLine('<span class="color2">' + data.trim() + '</span>', "margin", 0);
                })
                .catch(function () {
                    addLine('<span class="error">Could not fetch weather data. Try again later.</span>', "margin", 0);
                });
            break;

        // ─── Social Shortcuts ───
        case "linkedin":
            addLine("Opening LinkedIn...", "color2", 0);
            newTab(linkedin);
            break;
        case "spotify":
            addLine("Opening Spotify...", "color2", 0);
            newTab(spotify);
            break;
        case "instagram":
            addLine("Opening Instagram...", "color2", 0);
            newTab(instagram);
            break;
        case "github":
            addLine("Opening GitHub...", "color2", 0);
            newTab(github);
            break;
        case "website":
            addLine("Opening website...", "color2", 0);
            newTab(website);
            break;

        default:
            addLine(
                '<span class="inherit"><span class="command">\'' +
                cmd +
                '\'</span> command not found. Type <span class="command">\'ls\'</span> or <span class="command">\'help\'</span> for available commands.</span>',
                "error",
                100
            );
            break;
    }
}

/* ─── Helpers ─── */
function newTab(link) {
    setTimeout(function () {
        window.open(link, "_blank", "noopener,noreferrer");
    }, 500);
}

function addLine(text, style, time) {
    let t = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === " " && text.charAt(i + 1) === " ") {
            t += "&nbsp;&nbsp;";
            i++;
        } else {
            t += text.charAt(i);
        }
    }
    setTimeout(function () {
        const next = document.createElement("p");
        next.innerHTML = t;
        next.className = style;
        before.parentNode.insertBefore(next, before);
        scrollToBottom();
    }, time);
}

function loopLines(name, style, time) {
    name.forEach(function (item, index) {
        addLine(item, style, index * time);
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
}
