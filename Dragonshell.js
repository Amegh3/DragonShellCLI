document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('output');
    const terminalInput = document.getElementById('input');
    const hostname = document.getElementById('hostname');
    const shortcuts = document.querySelectorAll('.shortcut');
    let commandHistory = [];
    let historyIndex = -1;
    let authenticated = false;
    let passwordInput = false;

    // Password and valid commands for superusers
    const sudoPassword = 'amegh';
    const sections = ['about', 'experience', 'projects', 'skills', 'certifications', 'contact','education'];
    const superuserCommands = ['ls', 'cd', 'pwd', 'clear', 'projects', 'skills', 'education', 'ping', 'ifconfig', 'top', 'df', 'du', 'mkdir', 'rmdir', 'cp', 'mv', 'rm', 'touch', 'cat', 'echo', 'chmod', 'chown', 'grep', 'tail', 'head', 'wget', 'curl', 'ssh', 'ftp', 'scp', 'update', 'exit'];

    const commands = {
        'help': showHelp,
        'ls': listSections,
        'cd': changeDirectory,
        'pwd': printWorkingDirectory,
        'sudo': authenticate,
        'clear': clearTerminal,
        'show_password': showPassword,
        'update': updateSystem,
        'projects': showProjects,
        'skills': showSkills,
        'education': showEducation,
        'about_terminal': showAboutTerminal,  // Added About Terminal command
        'back_to_gui': backToGUI,
        // Additional commands for simulation
        'ping': pingHost,
        'ifconfig': ifconfigCommand,
        'top': topCommand,
        'df': dfCommand,
        'du': duCommand,
        'mkdir': mkdirCommand,
        'rmdir': rmdirCommand,
        'cp': cpCommand,
        'mv': mvCommand,
        'rm': rmCommand,
        'touch': touchCommand,
        'cat': catCommand,
        'echo': echoCommand,
        'chmod': chmodCommand,
        'chown': chownCommand,
        'grep': grepCommand,
        'tail': tailCommand,
        'head': headCommand,
        'wget': wgetCommand,
        'curl': curlCommand,
        'ssh': sshConnect,
        'ftp': ftpConnect,
        'scp': scpCommand,
        'exit': exitSuperuser,
    };

    // Event listener for terminal input commands
    terminalInput.addEventListener('keydown', (event) => {
        if (passwordInput) {
            handlePasswordInput(event);
            return;
        }

        if (event.key === 'Enter') {
            handleCommand(terminalInput.value.trim());
            terminalInput.value = '';  // Clear input after the command
        } else if (event.key === 'ArrowUp') {
            navigateHistory('up');
        } else if (event.key === 'ArrowDown') {
            navigateHistory('down');
        }
    });

    // Add event listeners for shortcut buttons
    shortcuts.forEach(shortcut => {
        shortcut.addEventListener('click', () => {
            const command = shortcut.getAttribute('data-command');
            handleCommand(command);
        });
    });

    function handleCommand(input) {
        if (input === '') return;

        commandHistory.push(input);
        historyIndex = commandHistory.length;

        const args = input.split(' ');
        const cmd = args[0].toLowerCase();  // Normalize command to lowercase

        if (commands[cmd]) {
            // Restrict access to superuser-only commands
            if (!authenticated && superuserCommands.includes(cmd)) {
                displayOutput(`Permission denied. Use 'sudo su' to run superuser commands.`);
            } else {
                displayOutput(`Running command: ${input}`);
                commands[cmd](args.slice(1));
            }
        } else if (sections.includes(cmd)) {
            displayOutput(`Opening section: ${cmd}`);
            navigateToSection(cmd);
        } else {
            displayOutput(`Command not found: ${cmd}. Type 'help' for a list of commands.`);
        }
    }

    function handlePasswordInput(event) {
        if (event.key === 'Enter') {
            if (terminalInput.value === sudoPassword) {
                authenticated = true;
                hostname.style.color = 'red'; // Change hostname color to red
                hostname.innerHTML = `amegh@cybersec:~$`; // Change the hostname to include ghost icon
                displayOutput('Authentication successful. You are now a superuser.');
            } else {
                displayOutput('Authentication failed. Incorrect password.');
            }
            passwordInput = false;
            terminalInput.value = '';
        }
    }

    function authenticate() {
        if (authenticated) {
            displayOutput('Already authenticated as a superuser.');
        } else {
            displayOutput('Enter [sudo] password for Dragon Shell superuser access: ');
            passwordInput = true;
        }
    }

    function showPassword() {
        displayOutput('Sudo password: amegh');
    }

    function displayOutput(text) {
        terminalOutput.innerHTML += `<div class="command">${text}</div>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function showHelp() {
        const helpText = `
Important Commands:
     Manual: type [sudo su] and enter the password to get root acess , then enter "ls" command to list the contents
    'pwd': printWorkingDirectory,
    'sudo': authenticate, go get root acess
    'clear': clearTerminal,
    'show_password': showPassword,
    'update': updateSystem,
    'back_to_gui': backToHome,
    'projects': showProjects,
    'skills': showSkills,
    'education': showEducation,
    'about_terminal': showAboutTerminal,
    'ls': listSections,
    'cd': changeDirectory,
    'exit': exitSuperuser,
    'ping': pingHost,
    'ifconfig': ifconfigCommand,
    'top': topCommand,
    'df': dfCommand,
    'du': duCommand,
    'mkdir': mkdirCommand,
    'rmdir': rmdirCommand,
    'cp': cpCommand,
    'mv': mvCommand,
    'rm': rmCommand,
    'touch': touchCommand,
    'cat': catCommand,
    'echo': echoCommand,
    'chmod': chmodCommand,
    'chown': chownCommand,
    'grep': grepCommand,
    'tail': tailCommand,
    'head': headCommand,
    'wget': wgetCommand,
    'curl': curlCommand,
    'ssh': sshConnect,
    'ftp': ftpConnect,
    'scp': scpCommand,
        `;
        displayOutput(helpText);
    }

    function listSections() {
        displayOutput(`
  About education experience projects  skills  certifications contact
        `);
    }

    function changeDirectory(args) {
        const section = (args[0] || '').toLowerCase(); // Normalize section name
        if (sections.includes(section)) {
            navigateToSection(section);
        } else {
            displayOutput(`No such section: ${section}. Use 'ls' to see available sections.`);
        }
    }

    function navigateToSection(section) {
        switch (section) {
            case 'about':
                showAbout();
                break;
          case 'education':
                showEducation();
                break;
            case 'experience':
                showExperience();
                break;
            case 'projects':
                showProjects();
                break;
            case 'skills':
                showSkills();
                break;
            case 'certifications':
                showCertifications();
                break;
            case 'contact':
                showContact();
                break;
            default:
                displayOutput(`Section not found: ${section}`);
                break;
        }
    }

    function printWorkingDirectory() {
        displayOutput('/home/guest/portfolio');
    }

    function clearTerminal() {
        terminalOutput.innerHTML = '';
    }

    function showProjects() {
        displayOutput(`
### 1. Hashed Password Cracker
Associated with: IBM  
A Python tool with a Tkinter-based GUI designed to reverse hashed values into plain text using dictionary attacks.

Features:
- Built using Python and Tkinter for GUI
- Implements dictionary attacks with 14.1 million passwords
- Supports multiple hash algorithms: MD5, SHA-1, SHA-224, SHA-512, and SHA-384
- Available in both GUI and CLI modes

---

### 2. DDoS Simulation
Self-Initiated  
Scripts to simulate volumetric, protocol, and application layer DDoS attacks. Analyzed network traffic using Wireshark to detect DDoS patterns.

Features:
- Comprehensive Attack Simulation
- Real-time Traffic Analysis
- Detailed Report Generation

---

### 3. Password Encryption Tool
Self-Initiated  
A tool for encrypting passwords using various algorithms to enhance security.

Features:
- Supports Multiple Algorithms
- Customizable Encryption Settings
- Easy Integration

---

### 4. Cybersecurity Project
Self-Initiated  
An interactive portfolio project for exploring cybersecurity concepts with real-time updates and practical tools.

Features:
- Dark-themed terminal-green design
- Dual modes: GUI and CLI
- "Security 101" section: Cybercrime Reporting, Security Hygiene, Phishing Awareness, etc.
- Detailed demo report for cybercrime reporting
- Integrated cybersecurity blogs

---

### 5. Forensic Analysis Tool
Self-Initiated  
A digital forensic analysis tool for data recovery and evidence collection.

Features:
- Data Recovery
- Evidence Gathering
- Comprehensive Analysis

---

### 6. Network Monitor
Self-Initiated  
A network monitoring tool offering real-time analytics and alerting for network activities.

Features:
- Real-time Analytics
- Alerting System
- Customizable Dashboards

---

### 7. Vulnerability Scanner
Self-Initiated  
An automated tool designed to identify security flaws in web applications and network services.

Features:
- Automated Scanning
- Detailed Reports
- Real-time Alerts

---

### 8. Phishing Simulation Tool
Self-Initiated  
A tool to simulate phishing attacks for testing organizational resilience and educating users.

Features:
- Simulated Phishing Attacks
- User Training
- Analytics Dashboard

---

### 9. Cyber Defense Simulation
Self-Initiated  
A comprehensive simulation tool for training in cyber defense strategies and responding to cyber threats.

---

        `);
    }

    function showSkills() {
        displayOutput(`
Listing Skills:
|--------------------------|----------------------------------------------------------------------------|
| Category                 | Skills                                                                     |
|--------------------------|----------------------------------------------------------------------------|
| Programming Languages    | Python, Bash, PowerShell                                                   |
|--------------------------|----------------------------------------------------------------------------|
| Cybersecurity Tools      | Wireshark, Metasploit, Burp Suite, Nmap, Nessus                            |
|--------------------------|----------------------------------------------------------------------------|
| Encryption               | MD5, SHA-1, SHA-224, SHA-512, SHA-384, AES                                 |
|--------------------------|----------------------------------------------------------------------------|
| Password Cracking        | Hashcat, John the Ripper                                                   |
|--------------------------|----------------------------------------------------------------------------|
| Forensics                | Data Recovery, Evidence Collection, Forensic Analysis Tools                |
|--------------------------|----------------------------------------------------------------------------|
| Networking               | TCP/IP, DNS, DHCP, VPN, Firewall Configurations, Network Monitoring        |
|--------------------------|----------------------------------------------------------------------------|
| Attack Simulation        | DDoS Simulation, Phishing Simulation, Penetration Testing                  |
|--------------------------|----------------------------------------------------------------------------|
| Security Protocols       | SSL/TLS, IPSec, HTTPS, VPN Configurations                                  |
|--------------------------|----------------------------------------------------------------------------|
| Automation & Scripting   | Python scripting, Bash automation                                          |
|--------------------------|----------------------------------------------------------------------------|
| Incident Response        | Threat Detection, Log Analysis, Incident Management, Intrusion Detection   |
|--------------------------|----------------------------------------------------------------------------|
| Compliance & Standards   | ISO 27001, GDPR, NIST, OWASP                                               |
|--------------------------|----------------------------------------------------------------------------|
| Version Control          | Git, GitHub                                                                |
|--------------------------|----------------------------------------------------------------------------|
| Operating Systems        | Linux, Windows, macOS                                                      |
|--------------------------|----------------------------------------------------------------------------|
| Soft Skills              | Problem Solving, Analytical Thinking, Communication, Attention to Detail   |
|--------------------------|----------------------------------------------------------------------------|

        `);
    }

    function showEducation() {
        displayOutput(`
Listing Education:
Bsc (Forensic science,Data Analytics and Cyber Security) with IBM
Ethical Hacker Associate - RED TEAM HACKERS ACADEMY
Essential of ethical hacking - RED TEAM HACKERS ACADEMY
Intro to cybersecurity - OFFENSO HACKERS ACADEMY
        `);
    }

    function showAbout() {
        displayOutput(`
About Me:
- I’m Amegh, and I work in cybersecurity, focusing on protecting systems and data. My experience includes finding vulnerabilities, responding to security incidents, and keeping networks safe. I aim to ensure systems are secure and meet industry standards.


        `);
    }

    function showExperience() {
        displayOutput(`
+---------------------------------------+---------------------------------------+
|          Experience                   |          Experience                   |
+---------------------------------------+---------------------------------------+
| 1. Security Engineer (VAPT) -         | 2. Cybersecurity Trainee - IBM        |
|    Freelancer                         |    December 2021 - April 2024         |
|    October 2023 - Present             |    Mangalore, Karnataka, India        |
|    Remote                             | - Gained hands-on experience in       |
| - Identified and exploited            |   security protocols, penetration     |
|   vulnerabilities in web              |   testing, and vulnerability          |
|   applications, enhancing security    |   assessments.                        |
|   measures for clients.               | - Collaborated with experts to        |
| - Developed and executed VAPT         |   implement advanced security         |
|   reports, providing actionable       |   measures for clients.               |
|   insights and remediation            | - Conducted cybersecurity research    |
|   strategies.                         |   to stay updated on emerging threats |
| - Applied advanced penetration        |   and mitigation techniques.          |
|   testing techniques, improving       | - Successfully completed IBM's        |
|   clients' defense mechanisms.        |   Cybersecurity Training, acquiring   |
| - Coordinated with development        |   certifications and skills.          |
|   teams to patch vulnerabilities,     |                                       |
|   increasing application security     |                                       |
|   and client trust.                   |                                       |
+---------------------------------------+---------------------------------------+
| 3. Intern - Cyber Cell, Kerala        | 4. Forensic Science Intern -          |
|    Police Department                  |    Kerala Police                      |
|    June 2024                          |    June 2022                          | 
|    Eranakulam, Kerala, India          |    Kannur City, Kerala, India         |
| - Assisted in real-time               | - Participated in forensic            |
|   cybercrime investigations,          |   investigations, gathering digital   |
|   analyzing digital evidence.         |   evidence for legal proceedings.     |
| - Observed forensic analysis          | - Gained proficiency in using         |
|   procedures, gaining exposure to     |   forensic tools to analyze digital   |
|   digital forensic tools and          |   data, supporting case               |
|   techniques.                         |   investigations.                     |
| - Developed reports summarizing       | - Prepared forensic reports detailing |
|   evidence collection and threat      |   findings from digital evidence      |
|   analysis.                           |   analysis.                           |
+---------------------------------------+---------------------------------------+
| 5. Cybersecurity Intern - Shadow      | 6. Technical Team Lead &              |
|    Force                              |    Server-Side Developer - IBM        |
|    September 2024                     |    Project                            |
|    Remote                             |    January 2024 - May 2024            |
| - Completed various cybersecurity     |    Mangalore, India                   |
|   tasks and challenges designed to    | - Led a technical team in             |
|   enhance threat detection and        |   developing and implementing         |
|   analysis skills.                    |   server-side solutions for a         |
| - Developed and implemented security  |   major project.                      |
|   measures to address vulnerabilities | - Managed project timelines and       |
|   in online environments.             |   coordinated with cross-functional   |
| - Collaborated with a global cohort   |   teams to meet deadlines.            |
|   to analyze security incidents and   | - Developed and optimized             |
|   propose effective remediation       |   server-side code, improving         |
|   strategies.                         |   system performance and security.    |
+---------------------------------------+---------------------------------------+
| 7. Bugcrowd Researcher                | 8. CTF Player                         |
|    January 2023 - Present             |    March 2022 - Present               |
|    Remote                             |    Remote                             |
| - Conducted vulnerability             | - Engaged in Capture The Flag (CTF)   |
|   assessments and reported security   |   challenges to enhance penetration   |
|   flaws for various clients.          |   testing skills.                     |
| - Collaborated with other security    | - Explored various security           |
|   researchers to improve bug reports  |   vulnerabilities and developed       |
|   and identify new vulnerabilities.   |   exploit techniques in a controlled  |
| - Received recognition and rewards    |   environment.                        |
|   for discovering high-impact         | - Contributed to the community by     |
|   security issues.                    |   sharing insights and solutions for  |
|                                       |   challenging scenarios.              |
+---------------------------------------+---------------------------------------+

        `);
    }

    function showCertifications() {
        displayOutput(`
Certifications:
- Offensoacademy
- Red Team EEH
- OWASP TOP 10
- RED Team
- IBM Advance Cybersecurity
- IBM ICE
- Red Team EHE
- Intern Cybercell
- Code Samaaj
- Cybersecurity Essentials
- Security Analyst Pro
- Ethical Hacking Mastery
- Forensic Science Bootcamp
- Webinar: Cyber Law
- Advanced Penetration Testing

        `);
    }

    function showContact() {
        displayOutput(`
Contact:
- Email: hgemattariya@gmail.com

        `);
    }

    // New "About Terminal" Command
    function showAboutTerminal() {
        const aboutText = `
 CLI Portfolio of Amegh A
===========================
This cybersecurity portfolio showcases certifications and projects and more

Terminal Details:
- Dragon Shell Cli
- Version: 1.0.0
- Design & Developed by: Amegh A
- Powered by: JavaScript & HTML

Copyright © 2024 Amegh. All rights reserved.
Support Email: hgemattariya@gmail.com
For more information, connect with me on LinkedIn: https://www.linkedin.com/in/amegh-a-9a958b2a9

Dragon Shell CLI - Version 1.0.0
---------------------------------
- Simulating a Linux-like terminal environment.
- Supports basic terminal commands and shortcuts for portfolio navigation.
- Developed using JavaScript, HTML, and CSS.
- You can execute various commands, explore sections, and interact with the portfolio dynamically.

Features:
----------------------------------
- Interactive Navigation: Seamlessly explore different sections of the portfolio.
- Command Support: Basic commands include about,projects,skills, and contact.
- User-Friendly Interface: Designed to mimic a real terminal for an authentic experience.
- Real-Time Feedback: Get instant responses as you interact with the portfolio.

  ⠀⠀⠀⠀⠀⠀⠀⠀
For more information, type [help] to see the list of available commands.

  ⠀       ⠀⢀⣤⠆⠀⠀⢠⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⡇⠀⠀⠀⡿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠹⣆⠀⢠⠃⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⡏⠀⠘⡼⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣦⡈⠓⢾⠀⣧⡀⠀⠀⠀⠀⠀⣤⣤⣴⣶⣦⢤⣄⡀⠀⠀⢸⠀⣧⠀⠀⢧⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣦⣼⠀⡿⡏⠙⠲⠤⣀⡀⠀⠈⠙⣆⠈⠓⣄⠙⢢⡀⠈⣆⠘⢇⠀⠸⡇⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢻⠀⢸⣹⡀⠠⣀⠀⠉⠙⠲⢄⡈⣆⠀⠈⢣⡀⢱⣄⣸⢦⣤⣑⢄⡇⠀⠸⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡀⠘⣇⢻⣶⣌⠙⢦⡀⠀⠀⠉⠺⢦⠀⠨⡇⠀⠙⣶⣉⣴⠛⠻⠱⣄⠀⢱⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣖⣉⣇⠀⠸⡄⠹⣌⠳⣦⡙⢶⣄⠀⠀⠀⠙⢆⣟⠀⡸⠫⢿⡜⣆⠀⠀⠘⢆⠈⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⠽⣿⠀⠀⠹⡄⠈⢧⡈⠻⣆⠙⣧⣀⠀⠀⠀⠹⣄⡀⠀⡜⠳⣘⡄⠀⠀⠘⣇⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣛⠛⠛⠿⣦⡀⠀⠙⢤⠀⠱⣦⢽⣧⡈⢻⡇⠀⠀⢀⣹⣏⣼⡁⠀⢙⣧⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⡇⠀⠀⢳⡳⣀⠀⠀⢳⡄⠈⢷⣌⣷⣠⡿⣿⣫⣿⣾⣿⣄⠀⡴⠋⠙⠳⣶⣶⢬⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣴⣯⣤⣤⣤⣤⣷⡈⢷⣦⡀⠙⢦⠀⣈⠛⢿⣾⣿⠋⢁⠔⠚⠻⢟⠣⠀⠔⠉⠙⢮⣙⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣾⠿⢭⡉⠀⠀⠀⠈⠉⠙⠛⣿⣦⡉⢿⣦⣌⢣⡈⢷⡀⡼⢿⡄⠈⠀⡠⠒⠚⠳⢄⠀⢀⠖⠙⢿⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⠁⠀⠀⣠⣇⣠⣤⣤⣤⣤⡴⠚⢉⣿⣿⣦⡈⠙⣷⣽⣄⣿⠃⠀⠙⢷⣼⡁⠀⡀⠐⠒⠯⣉⠀⢠⠴⣿⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣴⡿⠛⠋⠉⠁⠉⢹⠟⠀⠀⠀⣠⣽⣿⣷⡀⠸⠿⢿⡇⠀⠀⠀⠀⢹⣷⣦⣇⠀⢀⠘⠙⠛⡇⠀⠸⣿⣿⡀⠀⠀⠀
⠀⠀⠀⠀⢀⣼⣯⣅⠀⠀⠀⠀⣀⡴⠋⠀⠐⠒⠉⠉⠉⠛⣿⣷⣄⡀⢸⣧⠀⠀⠀⠀⠀⢻⣿⣿⣿⣾⠀⠀⠀⠀⡄⠀⡇⠈⣧⠀⠀⠀
⠀⠀⠀⢀⠟⠁⠀⣸⣠⡴⠾⢿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠨⢟⣛⣿⡟⠉⢳⣄⠀⠀⠀⠀⢻⡈⠉⠻⣷⣀⠀⠀⢸⣼⣇⣧⡿⠀⠀⠀
⠀⠀⠀⠀⢀⡴⠞⠋⠀⠀⢠⠞⠀⠀⠀⠀⢀⣠⠤⢔⣾⣿⠿⠛⢿⢹⠁⠀⠀⠙⢷⡄⠀⠀⠀⠙⠻⣿⣿⡟⣟⠛⠁⣿⠀⣿⠁⠀⠀⠀
⠀⠀⠀⣰⠟⠁⠀⠀⢀⣠⠏⠀⠀⠀⣠⠖⠋⣠⣾⡟⠛⣧⠀⠀⠘⢿⡄⠀⠀⠀⠀⠳⠀⠀⠀⠀⠀⠈⢿⣇⠹⠀⠀⢸⡀⣿⠀⠀⠀⠀
⠀⠀⢰⣏⣄⠀⣠⣶⢿⠏⠀⠀⠀⠞⠁⣠⣾⡿⡏⠀⠀⠈⠳⣄⣀⣀⣻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⢦⠀⠀⠘⢇⢹⠀⠀⠀⠀
⠀⠀⡿⠁⣰⡾⠛⠀⡜⠀⠀⠀⠀⢀⣼⡿⠃⠘⢳⡀⠀⠀⢠⠋⠳⢄⡀⠙⢦⣀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠙⠾⠀⠀⠀⠈⠋⣇⠀⠀⠀
⠀⠀⠁⣼⠛⠀⠀⣸⠃⠀⠀⠀⢀⣾⡟⣷⠀⠀⠀⠙⠒⠒⠚⢷⠖⠋⢉⡿⠋⠉⠓⢦⣄⠸⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆⠀⠀
⠀⠀⣸⠃⠀⢀⣴⡇⠀⠀⠀⢀⣾⡟⠉⠉⢧⡀⠀⠀⠘⣆⣀⠤⢷⣶⠟⠀⠀⠀⠀⠀⠈⠱⣄⠉⠳⢤⡀⠀⠀⠀⢰⡎⠉⠲⠄⢹⠲⡄
⠀⠀⣧⠞⣧⣾⢿⠁⠀⠀⠀⣼⡿⡁⠀⠀⠀⠈⠹⡟⠛⠙⣆⡤⣾⡟⠀⠀⠀⠀⠀⠀⠀⠀⠈⢳⡀⠀⠙⢦⡀⠀⢀⣿⣄⠀⠀⠀⠀⢸
⠀⢸⠃⣰⡟⠁⣾⠀⠀⠀⢸⣿⣤⠧⣄⠀⠀⠀⢀⣱⠤⠒⠁⢠⡿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⣵⡄⢻⠀⠸⡻⣿⣄⣤⠀⠀⡼
⠀⠉⢸⡟⠀⠀⡿⠀⠀⠀⣿⡇⠀⠀⠀⠉⢹⡏⠉⠈⣷⠤⠴⣿⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⠀⢧⡀⠀⠾⠀⠀⢸⢠⠇
⠀⠀⡿⠁⠀⠀⡇⠀⠀⢰⡟⢱⣄⠀⠀⠀⠀⢣⠤⠚⠁⠀⢰⣿⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠷⣄⡉⠳⢦⣀⡤⣾⡟⠀
⠀⢸⣇⡤⠤⣄⡇⠀⠀⣿⡏⠉⠈⠙⠒⡖⠒⠉⢷⡀⠀⣠⢾⡟⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠉⢻⠖⠋⠀⠀
⠀⣼⠏⠀⢀⣿⡇⠀⢀⣿⡀⠀⠀⠀⠀⠙⣆⣀⠴⠋⠉⠑⢾⡇⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢹⠀⢀⣿⠏⣇⠀⢸⣿⢑⡤⣀⣀⣀⡴⠛⣇⠀⠀⠀⢀⣼⡇⠀⠸⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣼⡏⠀⣧⠀⣼⡿⠉⠀⠈⠉⢧⡀⠀⢈⡷⠒⠒⠫⣼⡇⠀⠀⢿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀DRAGON SHELL CLI 
⠀⠀⢠⣿⣠⢦⣿⠀⣿⣧⠀⠀⠀⠀⠀⢉⣞⠉⠀⠀⠀⠀⢸⣧⠀⠀⠈⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   VERSION 1.0.0
⠀⠀⠀⣿⠁⢸⣿⢰⣿⣏⡳⠤⣤⡤⠖⠉⠘⢦⡀⠀⠀⣠⡾⣿⠀⠀⠀⠸⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⠀By Amegh A
⠀⠀⠀⠋⠀⡞⣿⢸⣿⠀⠀⠀⠈⠣⡀⠀⢀⣠⠛⠉⠉⠉⠓⣿⡄⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⠇⡿⢸⣿⡄⠀⠀⠀⠀⢈⣽⡋⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠈⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢿⣠⡇⢸⣿⠿⠓⠦⢶⡛⠉⠀⠙⠢⣤⣀⣀⣀⡤⣿⣿⡄⠀⠀⠀⠀⠀⠻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⢻⡇⣸⡇⠀⠀⠀⠀⠳⡀⠀⢀⡴⠛⠀⠀⠀⠀⠀⢸⣷⡀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣾⠃⣿⡇⠀⠀⠀⠀⠀⢈⣿⣏⠀⠀⠀⠀⠀⠀⠀⢸⠿⣷⡀⠀⠀⠀⠀⠀⠈⠛⢶⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡇⠀⣿⣿⣦⣤⣤⣶⠟⠁⠈⠈⠳⢤⣀⣀⣀⡤⠴⠚⠚⠛⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠳⢤⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⠁⢸⣿⢟⠩⠃⠈⢧⠀⠀⠀⠀⢀⡼⠋⠀⠀⠀⠀⠀⠀⠀⠘⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢶⡀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⡿⠀⣾⡇⠀⠀⠀⠀⠈⢧⡀⠀⡰⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠟⢿⣷⣄⠀⠀⠀⠀⠀⠀⣀⣀⣀⡠⠤⠤⣹⡄⠀⠀⠀⠀
⠀⣠⣴⡏⠀⢰⣿⣧⡀⠀⠀⠀⠀⠀⣹⠿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡰⠯⠤⠤⠜⠛⠙⠓⠒⠛⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⠁⠸⢤⠴⠟⠛⠙⠛⠶⣶⡴⠖⠊⠁⠀⠙⠲⢤⣄⣀⣀⣀⣤⠴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⡄⠀⠀⠀⠀⠀⣠⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⣴⡤⠴⠚⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

       
       
       
       
      
           `;
        displayOutput(aboutText);
    }

    // Updated System Update Simulation
    function updateSystem() {
        const commandsToRun = [
            'Checking for updates...',
            'Connecting to repository...',
            'Downloading update package 1/3...',
            'Installing update package 1/3...',
            'Downloading update package 2/3...',
            'Installing update package 2/3...',
            'Downloading update package 3/3...',
            'Installing update package 3/3...',
            'package not installed',
            'The terminal is currently running the latest version..'

        ];

        // Show update process step by step
        let step = 0;

        function runNextCommand() {
            if (step < commandsToRun.length) {
                displayOutput(commandsToRun[step]);
                step++;
                setTimeout(runNextCommand, 1000); // Simulate a delay of 1 second between steps
            } else {
                displayOutput('The terminal is up to date with the latest version');
            }
        }

        runNextCommand();
    }

    function backToGUI() {
        window.location.href = 'index.html';  // Redirect to GUI page
    }

    function pingHost(args) {
        displayOutput(`Pinging ${args[0] || '127.0.0.1'}...`);
    }

    function ifconfigCommand() {
        displayOutput(`Showing network configuration...`);
    }

    function topCommand() {
        displayOutput(`Showing top active processes...`);
    }

    function dfCommand() {
        displayOutput(`Displaying disk space usage...`);
    }

    function duCommand() {
        displayOutput(`Displaying directory space usage...`);
    }

    function mkdirCommand(args) {
        displayOutput(`Creating directory: ${args[0] || 'new_folder'}`);
    }

    function rmdirCommand(args) {
        displayOutput(`Removing directory: ${args[0] || 'new_folder'}`);
    }

    function cpCommand(args) {
        displayOutput(`Copying from ${args[0] || 'source'} to ${args[1] || 'destination'}`);
    }

    function mvCommand(args) {
        displayOutput(`Moving from ${args[0] || 'source'} to ${args[1] || 'destination'}`);
    }

    function rmCommand(args) {
        displayOutput(`Removing file: ${args[0] || 'file'}`);
    }

    function touchCommand(args) {
        displayOutput(`Creating file: ${args[0] || 'new_file'}`);
    }

    function catCommand(args) {
        displayOutput(`Displaying contents of file: ${args[0] || 'file'}`);
    }

    function echoCommand(args) {
        displayOutput(args.join(' '));
    }

    function chmodCommand(args) {
        displayOutput(`Changing permissions of ${args[1] || 'file'} to ${args[0] || 'permissions'}`);
    }

    function chownCommand(args) {
        displayOutput(`Changing ownership of ${args[1] || 'file'} to ${args[0] || 'user:group'}`);
    }

    function grepCommand(args) {
        displayOutput(`Searching for pattern: ${args[0]} in file: ${args[1]}`);
    }

    function tailCommand(args) {
        displayOutput(`Displaying last lines of file: ${args[0]}`);
    }

    function headCommand(args) {
        displayOutput(`Displaying first lines of file: ${args[0]}`);
    }

    function wgetCommand(args) {
        displayOutput(`Downloading from URL: ${args[0]}`);
    }

    function curlCommand(args) {
        displayOutput(`Fetching data from URL: ${args[0]}`);
    }

    function sshConnect(args) {
        displayOutput(`Connecting to SSH server at ${args[0]}`);
    }

    function ftpConnect(args) {
        displayOutput(`Connecting to FTP server at ${args[0]}`);
    }

    function scpCommand(args) {
        displayOutput(`Securely copying files from ${args[0]} to ${args[1]}`);
    }

    function exitSuperuser() {
        authenticated = false;
        hostname.style.color = 'green';
        hostname.innerHTML = `amegh@cybersec:~$`; // Change back to default
        displayOutput('Exiting superuser mode.');
    }

    function navigateHistory(direction) {
        if (direction === 'up') {
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (direction === 'down') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                terminalInput.value = '';
                historyIndex = commandHistory.length;
            }
        }
    }
});
