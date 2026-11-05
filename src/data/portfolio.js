/**
 * All portfolio content lives in this file.
 * To update the site, edit the values below — do not hard-code facts in components.
 * See README.md for images, the resume PDF, and the contact-form key.
 */

export const site = {
  title: "Balaji Vijayan — Software Developer",
  description:
    "Portfolio of Balaji Vijayan, an Electronics and Communication Engineering student at Sri Krishna College of Engineering and Technology, Coimbatore, graduating in 2027. Software, embedded systems, and electronics projects.",
  /** Public origin, no trailing slash. Sitemap, robots, canonical, and Open Graph use this. */
  url: "https://balaji-vijayan.onrender.com",
  author: "Balaji Vijayan",
  themeColor: "#071018",
  /** Google Search Console token. VITE_GOOGLE_SITE_VERIFICATION overrides this when set. */
  googleSiteVerification: "",
};

export const profile = {
  name: "Balaji Vijayan",
  title: "Software Developer",
  kicker: "Electronics and Communication Engineering · Graduating 2027",
  objective: "Seeking entry-level Software Developer roles, and open to Embedded and Hardware roles. Graduating 2027.",
  openToWork: true,
  openToWorkText: "Open to opportunities · 2027 graduate",
  photo: {
    // Set src to a public path, such as "/images/profile.jpg", only after that file exists.
    // null shows the initials and does not request a missing image.
    src: null,
    alt: "Balaji Vijayan",
    initials: "BV",
  },
  resume: {
    href: "/resume.pdf",
    download: "Balaji_Vijayan_Resume.pdf",
    label: "Download Resume",
  },
};

export const leetcode = {
  username: "BalajiVijayan161",
  href: "https://leetcode.com/u/BalajiVijayan161/",
};

export const socials = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/balajivijayan161-hub",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/balaji-vijayan-643081290",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/BalajiVijayan161/",
  },
];

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "activities", label: "Activities" },
  { id: "contact", label: "Contact" },
];

export const about = {
  id: "about",
  index: "01",
  eyebrow: "About",
  title: "About",
  /** Verbatim. Do not edit the wording except to correct a typo Balaji asks for. */
  text: "I'm an Electronics and Communication Engineering student at Sri Krishna College of Engineering and Technology, Coimbatore, graduating in 2027. I build software with C++, Python, Java and SQL, and I like working where code meets hardware, from full-stack web apps to ESP32-based IoT systems. I enjoy solving real problems, collaborating in teams, and turning ideas into working products.",
  /** Spoken and programming languages. The About section hides this block while the array is empty. */
  languages: ["Tamil (Fluent)", "English (Fluent)", "Hindi (Intermediate)"],
};

export const skills = {
  id: "skills",
  index: "02",
  eyebrow: "Technical skills",
  title: "Technical Skills",
  intro:
    "Hardware and software are listed with equal weight. There is no proficiency score.",
  groups: [
    {
      id: "software",
      label: "Software",
      items: [
        "C++",
        "Python",
        "Java",
        "SQL",
        "PL/SQL",
        "Node.js",
        "Express",
        "PostgreSQL",
        "HTML",
        "CSS",
        "JavaScript",
        "Git/GitHub",
        "Machine Learning (Random Forest, Q-learning)",
      ],
    },
    {
      id: "hardware",
      label: "Hardware / Embedded",
      items: [
        "ESP32",
        "Embedded C / Embedded Systems",
        "IoT",
        "Sensor Integration (MQ-series, DHT22, SW-420, BME280)",
        "RF / SDR (CC1101, RTL-SDR, GNU Radio)",
        "ADC Signal Processing",
        "Power Electronics",
        "Switchgear",
      ],
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        "VS Code",
        "Arduino IDE",
        "MATLAB",
        "GNU Radio",
        "Proteus",
        "Blynk",
        "Render",
        "Cisco Networking",
      ],
    },
  ],
};

export const projectsSection = {
  id: "projects",
  index: "03",
  eyebrow: "Projects",
  title: "Projects",
  intro:
    "Four projects. Team projects name everyone involved. Nothing here is claimed as one person's work unless it is marked as a personal project.",
};

export const projects = [
  {
    id: "atm-cash-monitoring",
    title: "ATM Cash Replenishment & Downtime Monitoring System",
    summary:
      "Personal full-stack project for ATM cash replenishment and downtime monitoring, deployed on Render.",
    credit: "Personal project",
    context: null,
    tech: ["Node.js", "Express", "EJS", "PostgreSQL", "PL/pgSQL", "Render"],
    coverBadge: "Illustration",
    github: "https://github.com/balajivijayan161-hub/atm-cash-monitoring",
    details: [
      "Personal full-stack project. Stack is Node.js and Express with EJS views, PostgreSQL and PL/pgSQL, deployed on Render.",
      "Login uses role-based access control with six roles. The app keeps an append-only activity log and a live feed, and it supports data imports.",
      "Cash operations cover holiday-aware cash forecasting, denomination planning, SLA tracking, and variance case management.",
      "Security hardening includes a Content-Security-Policy and CSRF protection.",
    ],
    links: [
      {
        label: "Live demo",
        href: "https://atm-cash-monitoring.onrender.com",
        note: "Hosted on Render’s free tier. The app may take about a minute to wake.",
      },
    ],
    gallery: [
      {
        src: "/images/projects/atm/cover.svg",
        alt: "Line illustration of an ATM linked to role access, cash forecasting, and an activity log. Not a screenshot of the app.",
        caption:
          "Original illustration of the system idea. It is not a screenshot of the live app.",
        width: 1200,
        height: 750,
      },
    ],
  },
  {
    id: "spectrum-sharing",
    title: "AI-Based Adaptive Spectrum Sharing for Emergency Communication Networks",
    summary:
      "Final-year team project on emergency communication that senses the 433 MHz band and selects a channel for priority traffic.",
    credit: "Team: Balaji V, Bineesh S, Haniel Johnson A",
    context: "Final-year project · September 2026 · Supervisor: Dr. N. Sathishkumar",
    tech: [
      "ESP32",
      "MQ-2",
      "DHT22",
      "SW-420",
      "CC1101",
      "RTL-SDR",
      "GNU Radio",
      "Random Forest",
      "Q-learning",
      "Python",
      "TFT ILI9341",
    ],
    coverBadge: null,
    github: "",
    details: [
      "Final-year project report, September 2026, by Balaji V, Bineesh S, and Haniel Johnson A at Sri Krishna College of Engineering and Technology. Supervisor: Dr. N. Sathishkumar, Associate Professor, Electronics and Communication Engineering. The report does not split tasks among the three members.",
      "ESP32 sensor nodes use an MQ-2 smoke and gas sensor, a DHT22 temperature and humidity sensor, and an SW-420 vibration sensor. CC1101 transceivers carry 433 MHz links. The receiver node uses a TFT ILI9341 display.",
      "An RTL-SDR with GNU Radio senses the 433 MHz ISM band. Processing extracts RSSI, SNR, signal energy, and channel occupancy. A Random Forest classifier labels a channel FREE or BUSY. A Q-learning agent selects a channel and prioritises emergency traffic.",
      "The report includes a GNU Radio simulation, a Python dashboard simulation of emergency detection and channel selection, and a hardware prototype of the ESP32–CC1101 nodes. Serial logs in the report show sensor packets sent and received.",
      "The report describes these results as preliminary and says further physical testing is still required.",
    ],
    links: [],
    gallery: [
      {
        src: "/images/projects/spectrum/prototype.webp",
        alt: "Breadboard prototype with an ESP32, a 433 MHz CC1101 module and spring antenna, an MQ-series gas sensor, a vibration module, and a DHT22.",
        caption:
          "Hardware prototype for emergency communication, from the project report (Figure 4.6).",
        width: 1150,
        height: 863,
      },
      {
        src: "/images/projects/spectrum/esp32-cc1101.webp",
        alt: "ESP32 development board wired to a 433 MHz CC1101 transceiver with a spring antenna.",
        caption:
          "ESP32 interfaced with the CC1101 transceiver, from the project report (Figure 4.5).",
        width: 1093,
        height: 820,
      },
      {
        src: "/images/projects/spectrum/flow.webp",
        alt: "Flow diagram from ESP32 sensor nodes through RTL-SDR spectrum sensing, channel selection, and a dashboard alert.",
        caption:
          "System flow: sensor nodes, spectrum sensing, channel selection, and a dashboard alert (Figure 3.8).",
        width: 868,
        height: 1244,
      },
      {
        src: "/images/projects/spectrum/gnu-radio.webp",
        alt: "GNU Radio Companion flowgraph with four paths near 433 MHz feeding a channel selector.",
        caption:
          "GNU Radio flowgraph used for spectrum sensing and RF feature extraction (Figure 4.1).",
        width: 1600,
        height: 930,
      },
      {
        src: "/images/projects/spectrum/occupancy.webp",
        alt: "Line chart titled Simulated Dynamic Spectrum Occupancy Across Four Channels, with a free or busy threshold.",
        caption:
          "Simulated channel occupancy with a free/busy threshold (Figure 4.3).",
        width: 989,
        height: 540,
      },
      {
        src: "/images/projects/spectrum/dashboard.webp",
        alt: "Dashboard titled AI Based Adaptive Spectrum Sharing showing sensor status, an emergency flag, spectrum occupancy, and a selected channel.",
        caption:
          "Python dashboard simulation of emergency detection and channel selection (Figure 4.4). The numbers on this screen are simulated values from the report.",
        width: 1289,
        height: 715,
      },
      {
        src: "/images/projects/spectrum/serial-receive.webp",
        alt: "Arduino IDE serial monitor showing received packets with node, temperature, gas, and vibration fields, plus RSSI lines.",
        caption:
          "Receiver serial log of sensor-data packets at the ESP32–CC1101 node (Figure 4.7).",
        width: 1600,
        height: 900,
      },
      {
        src: "/images/projects/spectrum/serial-transmit.webp",
        alt: "Arduino IDE serial monitor showing transmitted sensor packets and TX OK lines from an ESP32.",
        caption:
          "Transmitter serial log of environmental sensor packets (Figure 4.8).",
        width: 1600,
        height: 900,
      },
    ],
  },
  {
    id: "inhalo-tracker",
    title: "Inhalo Tracker",
    summary:
      "Team breath-analysis screening prototype. ESP32 and MQ-series sensors, shown on an OLED, Blynk, and a local web page. Not a medical device.",
    credit: "Team of 4: Aashif Ahamed M, Balaji V, Bineesh S, Haniel Johnson A",
    context: "November 2025 · Supervisor: Mr. N. Girinath",
    tech: [
      "ESP32",
      "MQ-3",
      "MQ-135",
      "MQ-136",
      "MQ-2",
      "ADS1115",
      "BME280",
      "DHT22",
      "OLED",
      "Blynk",
      "HTML",
      "CSS",
      "JavaScript",
      "Proteus",
    ],
    coverBadge: "Screening prototype",
    github: "",
    details: [
      "Project report, November 2025, by Aashif Ahamed M, Balaji V, Bineesh S, and Haniel Johnson A. The bonafide certificate names Mr. N. Girinath, Assistant Professor, as supervisor. The report does not split tasks among the four members.",
      "This is a student screening prototype. It is not a medical device and it does not diagnose. It reads breath-sensor responses associated, in the report, with biomarkers for diabetes (MQ-3, acetone), kidney conditions (MQ-135, ammonia), liver conditions (MQ-136, hydrogen sulfide), and H. pylori (MQ-2, hydrogen).",
      "The MQ sensors are sampled with an ADS1115 ADC. The report uses a BME280 for temperature and humidity compensation and also describes a DHT22 as an alternative. Results are shown on an OLED, on Blynk, and on a local dashboard written with HTML, CSS, and JavaScript. A Proteus simulation is included in the report.",
      "The OLED and Blynk images below are reproduced from the report, including the words those screens display. Read them as prototype output, not a clinical result.",
    ],
    links: [],
    gallery: [
      {
        src: "/images/projects/inhalo/prototype-lit.webp",
        alt: "Breadboard prototype with an ESP32, four MQ-series gas sensors with heaters glowing, and a small OLED.",
        caption: "Inhalo Tracker prototype from the November 2025 project report.",
        width: 960,
        height: 1280,
      },
      {
        src: "/images/projects/inhalo/prototype.webp",
        alt: "Overhead view of the breath-analysis prototype on breadboards, with an ESP32 and gas sensors.",
        caption: "Another view of the prototype assembly from the project report.",
        width: 960,
        height: 1280,
      },
      {
        src: "/images/projects/inhalo/oled.webp",
        alt: "OLED titled Breath Disease Detect, listing MQ3, MQ135, and MQ136 as Normal and MQ2 with an H. pylori flag.",
        caption:
          "On-device OLED output from the report. Screening prototype, not a medical device.",
        width: 350,
        height: 378,
      },
      {
        src: "/images/projects/inhalo/oled-close.webp",
        alt: "Close-up of the OLED showing breath-sensor voltages and Normal labels.",
        caption: "Close-up of the OLED during a run shown in the report.",
        width: 960,
        height: 1280,
      },
      {
        src: "/images/projects/inhalo/blynk-clear.webp",
        alt: "Blynk dashboard named Inhalo Tracker with gauges for MQ3, MQ135, MQ136, and MQ2, and the text No gas detected.",
        caption: "Blynk dashboard capture from the report, with no gas flagged in this view.",
        width: 1280,
        height: 655,
      },
      {
        src: "/images/projects/inhalo/blynk-flag.webp",
        alt: "Blynk dashboard named Inhalo Tracker with sensor gauges and a Liver Risk label.",
        caption:
          "Blynk dashboard capture from the report. The label is prototype output, not a clinical result.",
        width: 1280,
        height: 709,
      },
      {
        src: "/images/projects/inhalo/block-diagram.webp",
        alt: "Block diagram of MQ-2, MQ-3, MQ-135, and MQ-136 feeding an ADS1115 and an ESP32, with BME280, an OLED, and a webpage.",
        caption: "System block diagram from the report (Figure 3.2).",
        width: 1063,
        height: 769,
      },
      {
        src: "/images/projects/inhalo/flowchart.webp",
        alt: "Flowchart from sensor calibration through a threshold check to the OLED and Blynk or a webpage.",
        caption: "Functional flow from the report (Figure 3.5).",
        width: 494,
        height: 1280,
      },
      {
        src: "/images/projects/inhalo/proteus.webp",
        alt: "Proteus schematic with a microcontroller, four gas-sensor symbols, and an OLED display.",
        caption:
          "Proteus simulation schematic from the report (Figure 7.2). The prototype photographs use an ESP32.",
        width: 1280,
        height: 1041,
      },
    ],
  },
  {
    id: "energy-tile",
    title: "Hybrid Footsteps Energy Harvesting Tile",
    summary:
      "Prototype lab tile that turns footsteps into a small electrical store using piezoelectric discs and a PTFE/aluminium triboelectric layer.",
    credit: "Team: Balaji V, Bineesh S, Haniel Johnson A",
    context: "23EC603 prototype lab · March 2026 · Faculty: Mr. N. Girinath",
    tech: [
      "Piezoelectric discs",
      "PTFE",
      "Aluminium",
      "Bridge rectifier",
      "Supercapacitor",
      "DC-DC boost",
      "MT3608",
      "LED load",
    ],
    coverBadge: null,
    github: "",
    details: [
      "Prototype lab report for course 23EC603, March 2026, by Balaji V, Bineesh S, and Haniel Johnson A. Faculty in charge: Mr. N. Girinath, Assistant Professor. The report does not split tasks among the three members.",
      "The tile uses an array of piezoelectric discs plus a triboelectric layer of PTFE and aluminium. Footstep pressure and contact–separation each produce charge. Both paths are bridge-rectified, stored in a capacitor or supercapacitor, and raised with an MT3608 DC–DC boost converter to drive an LED or another low-power load such as a sensor.",
      "The lab report says capacitor voltage rises by about 0.002 V to 0.010 V per footstep until approximately 2.5 V, then discharges through the LED. The voltage graph and photographs in this gallery are taken from that report.",
    ],
    links: [],
    gallery: [
      {
        src: "/images/projects/energy/piezo-array.webp",
        alt: "Array of round piezoelectric discs with red and black leads, taped to a board.",
        caption: "Piezoelectric disc array from the prototype (Figure 4.3 in the lab report).",
        width: 1200,
        height: 877,
      },
      {
        src: "/images/projects/energy/led-output.webp",
        alt: "Breadboard with a lit green LED, a boost-converter module, and an orange storage capacitor, with piezoelectric discs beside it.",
        caption: "LED lit from stored footstep energy (Figure 6.4).",
        width: 899,
        height: 759,
      },
      {
        src: "/images/projects/energy/circuit.webp",
        alt: "Breadboard close-up of the rectifier and boost-converter wiring, with a diode and an LED.",
        caption: "Rectifier and boost-converter circuit on a breadboard (Figure 4.5).",
        width: 1600,
        height: 535,
      },
      {
        src: "/images/projects/energy/layers.webp",
        alt: "Exploded diagram of tile layers: top cover, aluminium foil, PTFE sheet, springs, a piezoelectric disc array, and a base plate.",
        caption:
          "Layer stack: impact surface, PTFE and aluminium triboelectric layer, piezoelectric array, and base (Figure 4.1).",
        width: 1382,
        height: 607,
      },
      {
        src: "/images/projects/energy/architecture.webp",
        alt: "Diagram of piezo discs and triboelectric layers feeding rectifiers, an MT3608 boost converter, storage, and LEDs.",
        caption:
          "Electrical architecture with separate rectifiers, an MT3608 boost converter, and storage (Figure 6.1).",
        width: 1400,
        height: 556,
      },
      {
        src: "/images/projects/energy/block-diagram.webp",
        alt: "Flowchart from a footstep through piezoelectric and triboelectric paths, bridge rectifiers, capacitor storage, a boost converter, and an LED.",
        caption: "Block diagram of the hybrid harvesting path (Figure 3.2).",
        width: 500,
        height: 1213,
      },
      {
        src: "/images/projects/energy/flowchart.webp",
        alt: "Flowchart titled Hybrid Footstep Energy Harvesting Flowchart, from mechanical force to an LED load.",
        caption: "Working sequence of the hybrid tile (Figure 5.1).",
        width: 1024,
        height: 1536,
      },
      {
        src: "/images/projects/energy/voltage-graph.webp",
        alt: "Graph of capacitor voltage rising toward 2.5 volts across footsteps, then falling as the LED discharges it.",
        caption:
          "Capacitor voltage versus footsteps, from the lab report. The curve climbs to about 2.5 V and then drops as the LED discharges the store.",
        width: 700,
        height: 525,
      },
    ],
  },
];

export const educationSection = {
  id: "education",
  index: "04",
  eyebrow: "Education",
  title: "Education",
};

export const education = [
  {
    id: "be-ece",
    credential: "B.E. Electronics and Communication Engineering",
    school: "Sri Krishna College of Engineering and Technology",
    place: "Coimbatore",
    score: "CGPA 8.15",
    mode: "Full time",
    time: "Expected May 2027",
  },
  {
    id: "hsc",
    credential: "HSC",
    school: "Senthil Public School",
    place: "Salem",
    score: "74.2%",
    mode: "Full time",
    time: "April 2023",
  },
  {
    id: "sslc",
    credential: "SSLC",
    school: "Notre Dame of Holy Cross",
    place: "Salem",
    score: "90%",
    mode: "Full time",
    time: "April 2021",
  },
];

export const experienceSection = {
  id: "experience",
  index: "05",
  eyebrow: "Experience and certifications",
  title: "Experience & Certifications",
  experienceLabel: "Internships",
  certificationsLabel: "Certifications",
};

export const experience = [
  {
    id: "megawin",
    role: "Switchgear Engineering Intern",
    org: "Megawin Switchgear Private Limited (Unit-II)",
    place: "Salem",
    time: "Jan 2026 – Feb 2026",
    points: [
      "Worked with the engineering team on the design, assembly, and testing of medium-voltage switchgear systems.",
      "Hands-on work with vacuum circuit breakers (VCBs) and load break switches (LBS).",
      "Exposure to CT, CRT, and LT/HT panels.",
    ],
  },
  {
    id: "tech-forge",
    role: "Full Stack Intern",
    org: "Tech Forge",
    place: "Salem",
    time: "May 2025 – Jun 2025",
    points: [
      "Code reviews, testing, and debugging.",
      "Version control and project collaboration with Git and GitHub.",
    ],
  },
  {
    id: "sail",
    role: "Central Electrical Maintenance Intern",
    org: "SAIL Salem Steel Plant",
    place: "Salem",
    time: "Dec 2024 – Jan 2025",
    points: [
      "Internship in central electrical maintenance, including industrial safety training.",
      "The training covered workplace safety, hazard identification, and emergency response.",
    ],
  },
];

// Optional certificate scans: set image to a file under public/images/certificates/. See README.
export const certifications = [
  {
    id: "ccna",
    name: "CCNA: Introduction to Networks",
    issuer: "Cisco",
    image: null,
    imageAlt: "Cisco CCNA Introduction to Networks certificate",
  },
  {
    id: "infosys-java",
    name: "Java",
    issuer: "Infosys Springboard",
    image: null,
    imageAlt: "Infosys Springboard Java certificate",
  },
  {
    id: "infosys-cpp",
    name: "C++",
    issuer: "Infosys Springboard",
    image: null,
    imageAlt: "Infosys Springboard C++ certificate",
  },
  {
    id: "infosys-sql",
    name: "SQL",
    issuer: "Infosys Springboard",
    image: null,
    imageAlt: "Infosys Springboard SQL certificate",
  },
];

export const activitiesSection = {
  id: "activities",
  index: "06",
  eyebrow: "IEEE and co-curricular",
  title: "Achievements & Activities",
};

// Optional event photos: put files in public/images/activities/<slug>/ and list the filenames in photos. See README.

export const activities = [
  {
    id: "ieee-upskill-2024",
    slug: "ieee-upskill-2024",
    title: "Coordinated IEEE UPSKILL Event 2024",
    icon: "users",
    photos: [],
  },
  {
    id: "ieee-wie-ils-2024",
    slug: "ieee-wie-ils-2024",
    title: "Participated in IEEE WIE International Leadership Summit 2024",
    icon: "award",
    photos: [],
  },
  {
    id: "krisnecs-2024",
    slug: "krisnecs-2024",
    title: "Organized KRISNECS 2024",
    icon: "circuit",
    photos: [],
  },
  {
    id: "ieee-xtreme-2025",
    slug: "ieee-xtreme-2025",
    title: "Organized and participated in IEEE Xtreme Coding Contest 2025",
    icon: "code",
    photos: [],
  },
  {
    id: "ieee-icinvents-2025",
    slug: "ieee-icinvents-2025",
    title: "Member of the organizing panel, IEEE ICINVENTS 2025",
    icon: "radio",
    photos: [],
  },
];

export const contact = {
  id: "contact",
  index: "07",
  eyebrow: "Contact",
  title: "Contact",
  intro:
    "For campus placements and project conversations, send an email. The form checks your message in the browser before it sends.",
  email: "balajivijayan161@gmail.com",
  location: "Coimbatore / Salem",
  form: {
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    honeypotLabel: "Company",
  },
};

export const footer = {
  note: "Electronics and Communication Engineering, Sri Krishna College of Engineering and Technology.",
};
