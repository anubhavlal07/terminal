
# Terminal

Terminal Portfolio is a simple and elegant portfolio website interface, designed to be viewed and interacted with through a terminal interface. The portfolio is built using HTML, CSS, and JavaScript, and is displayed through a terminal window.

This repository contains the code for the Terminal Portfolio website. Users can navigate through the website using a set of commands, and view the content of each section of the website.

### Installation

To run the Terminal Portfolio on your local machine, follow these steps:

Clone the repository to your local machine using git clone https://github.com/anubhavlal07/terminal.git
Open the terminal and navigate to the project directory using cd terminal.

### Folder Structure

```
terminal/
├── assets/
│   └── images/
│       ├── favicon.png
│       └── terminal-interface.png
├── css/
│   ├── base.css              # Base styles and resets
│   ├── components.css         # UI component styles
│   ├── responsive.css         # Media queries for responsiveness
│   └── themes.css             # Light/dark/auto theme definitions
├── js/
│   ├── analytics.js           # Visitor analytics collector (Supabase)
│   ├── app.js                 # Main terminal application logic
│   ├── commands.js            # Terminal command definitions
│   ├── themes.js              # Theme toggling logic
│   └── utils.js               # Utility/helper functions
├── index.html                 # Entry point
└── README.md
```

### Usage

The Terminal Portfolio website can be navigated using a set of commands that are displayed on the screen. Users can use the arrow keys to select a command, and press enter to execute the command. The website includes the following commands:

whois: Who is Anubhav?
whoami: Who are you?
social: Display social networks
secret: God mode, requires password
projects: View coding projects
history: View command history
help: You obviously already know what this does
email: Do not spam me
clear: Clear terminal
intro: Display the help keyword
pwd: Display the current working directory

### Analytics

The site includes a silent visitor analytics collector (`js/analytics.js`) that gathers comprehensive browser, device, network, and performance data, and sends it to Supabase.

**Key features:**
- Device info, GPU details, client hints (model, OS, architecture)
- IPv4 and IPv6 address collection via [ipify.org](https://www.ipify.org/) (HTTPS)
- Geolocation via [ipapi.co](https://ipapi.co/) (HTTPS)
- Browser capabilities, permissions, battery, storage estimates
- Canvas fingerprinting, media codec support
- Performance timing (TTFB, FCP, page load, memory usage)
- Network connection info (effective type, downlink, RTT)
- Return visitor detection via localStorage
- Page visibility tracking (visible vs hidden time)
- Scroll depth tracking
- Heartbeat updates every 45 seconds with dynamic metrics
- Flush-on-exit using `keepalive` fetch for accurate session data

### Contributions
Contributions to this project are welcome. If you find a bug or would like to suggest a feature, please submit an issue on the GitHub repository. Pull requests are also welcome.

License
This project is licensed under the MIT license.

## Demo

https://anubhavlal07.github.io/terminal/

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/anubhavlal07/terminal.anubhavlal07.github.io/main/assets/terminal-interface.png)


## Inspiration and Credits

- [@ForrestKnight](https://github.com/forrestknight)
- [@m4tt72](https://github.com/m4tt72)

