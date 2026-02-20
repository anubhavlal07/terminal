/* ─── Data & Configuration ─── */

const linkedin = "https://www.linkedin.com/in/anubhavl/";
const website = "https://anubhavlal07.github.io/";
const instagram = "https://www.instagram.com/_anu_bhav/";
const github = "https://github.com/anubhavlal07/";
const spotify = "https://open.spotify.com/user/31te6546l5jifevdxndhszz4eyxi";
const email = "mailto:anubhavlal.15@gmail.com";
const introEl = document.getElementById("intro");

/* ─── ASCII Art Banner ─── */
const banner = [
    '<span class="ascii-art">',
    "    _                _     _                 ",
    "   / \\   _ __  _   _| |__ | |__   __ ___   __",
    "  / _ \\ | '_ \\| | | | '_ \\| '_ \\ / _` \\ \\ / /",
    " / ___ \\| | | | |_| | |_) | | | | (_| |\\ V / ",
    "/_/   \\_\\_| |_|\\__,_|_.__/|_| |_|\\__,_| \\_/  ",
    "</span>",
    "<br>",
];

/* ─── Command Data ─── */
const whois = [
    "<br>",
    "I am a recent computer science graduate from Bangalore Central University,",
    "with a strong foundation in software development, web development, and data analytics.",
    "I have a Bachelor in Computer Application and have completed relevant coursework in",
    "Object-Oriented Programming, Data Structures and Algorithms, Database Systems, and Software Engineering.",
    "I have experience in programming languages such as Java, C++, and Python, and have a good understanding of",
    "web development technologies such as HTML, CSS, JavaScript, and jQuery.",
    "<br>",
];

const whoami = [
    "<br>",
    'The paradox of "Who am I?" is we never know, but, we constantly find out.',
    "<br>",
];

const social = [
    "<br>",
    'website        <a href="' + website + '" target="_blank" rel="noopener">anubhavlal07.github.io</a>',
    'linkedin       <a href="' + linkedin + '" target="_blank" rel="noopener">linkedin/anubhavlal</a>',
    'instagram      <a href="' + instagram + '" target="_blank" rel="noopener">instagram/_anu_bhav</a>',
    'github         <a href="' + github + '" target="_blank" rel="noopener">github/anubhavlal07</a>',
    'spotify        <a href="' + spotify + '" target="_blank" rel="noopener">spotify/ANUBHAV</a>',
    "<br>",
];

const secret = [
    "<br>",
    '<span class="command">sudo</span>           Use only if you\'re admin',
    "<br>",
];

const projects = [
    "<br>",
    '<span class="command">Terminal Portfolio</span>     This very site — interactive terminal UI',
    '                         <a href="' + github + 'terminal" target="_blank" rel="noopener">View on GitHub →</a>',
    "<br>",
    "More projects coming soon... most are offline, on GitHub, or confidential.",
    "<br>",
];

const ls = [
    "<br>",
    "<b>Command          Description</b>",
    "<br>",
    '<span class="command">whois</span>            Who is Anubhav?',
    '<span class="command">whoami</span>           Who are you?',
    '<span class="command">skills</span>           View my technical skills',
    '<span class="command">projects</span>         View coding projects',
    '<span class="command">social</span>           Display social networks',
    '<span class="command">website</span>          Open my portfolio website',
    '<span class="command">email</span>            Send me an email',
    '<span class="command">banner</span>           Display ASCII art banner',
    '<span class="command">theme</span>            Toggle theme (dark/light/retro/matrix)',
    '<span class="command">date</span>             Show current date & time',
    '<span class="command">uptime</span>           Time since page loaded',
    '<span class="command">weather</span>          Show local weather info',
    '<span class="command">secret</span>           God mode — requires password',
    '<span class="command">history</span>          View command history',
    '<span class="command">pwd</span>              Print working directory',
    '<span class="command">clear</span>            Clear terminal',
    '<span class="command">intro</span>            Show welcome message',
    "<br>",
    '<span class="color2">Tip: Press <span class="command">Tab</span> to auto-complete commands</span>',
    "<br>",
];

const presentWorkingDirectory = ["<br>", "/home/anubhavlal", "<br>"];

const intro = [
    '<span class="color2">Welcome to my interactive terminal portfolio.</span>',
    '<span class="color2">Type <span class="command">\'ls\'</span> or <span class="command">\'help\'</span> for available commands.</span>',
];

/* ─── Skills Data ─── */
const skillsData = [
    { name: "Java", level: 85 },
    { name: "C++", level: 75 },
    { name: "Python", level: 80 },
    { name: "HTML/CSS", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "SQL", level: 70 },
    { name: "Git", level: 80 },
    { name: "React", level: 65 },
];

/* ─── Available Commands (for tab-completion) ─── */
const allCommands = [
    "ls", "help", "whois", "whoami", "pwd", "sudo",
    "social", "secret", "projects", "password", "history",
    "email", "clear", "intro", "linkedin", "spotify",
    "instagram", "github", "website", "banner", "theme",
    "date", "uptime", "skills", "weather", "about",
];
