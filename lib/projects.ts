import { Project } from "./types";

export const projects: Project[] = [
  {
    id: "rustplusplus",
    title: "rustplusplus",
    displayTitle: "rustplusplus",
    tagline: "Rust game meets Discord",
    description:
      "A fully-featured Discord bot that bridges your Rust game server with Discord. Real-time alerts, smart device control, and more.",
    longDescription:
      "Connect your Rust game to Discord with this battle-tested, production-grade bot. Get real-time alerts for Patrol Helicopters, Cargo Ships, and Bradley APCs. Control smart switches, alarm systems, and storage monitors remotely via Discord commands. A two-way chat bridge keeps your team connected between Discord and the in-game chat. BattleMetrics integration lets you track player activity, and multi-language support via Crowdin means your whole server can enjoy it. Docker-ready and running at version 1.22.0.",
    year: 2024,
    status: "finished",
    type: "Discord Bot",
    genre: ["Gaming", "Discord", "Automation", "Node.js"],
    tech: ["TypeScript", "Node.js", "Discord.js v14", "Rust+ API", "ffmpeg", "Docker"],
    subdomain: "rustplusplus",
    githubUrl: "https://github.com/ethanfalik/rustplusplus",
    liveUrl: "https://github.com/ethanfalik/rustplusplus",
    thumbnail: {
      gradient: "from-orange-950 via-red-950 to-black",
      accent: "#E25822",
      icon: "🦀",
      bgClass: "bg-gradient-to-br from-orange-950 via-red-950 to-black",
    },
    matchScore: 99,
    maturityRating: "All",
    featured: true,
  },
  {
    id: "calc01",
    title: "calc01",
    displayTitle: "calc01",
    tagline: "AI-powered math solver",
    description:
      "Solve complex equations with Google Gemini AI. Real-time LaTeX rendering makes math beautiful. Drag-and-drop panels, fast.",
    longDescription:
      "Type any equation, expression, or math problem and Gemini AI solves it in seconds. KaTeX renders the result with beautiful mathematical notation. Drag-and-drop panels let you arrange your workspace exactly how you like it. Built with Next.js and deployed on Cloudflare Workers for sub-100ms response times. Whether it's calculus, linear algebra, or a quick arithmetic check, calc01 handles it all with style.",
    year: 2025,
    status: "finished",
    type: "Web App",
    genre: ["Web App", "AI", "Math", "Education"],
    tech: ["Next.js", "TypeScript", "Gemini AI", "KaTeX", "TailwindCSS", "Cloudflare Workers"],
    subdomain: "calc01",
    liveUrl: process.env.CALC01_URL || "https://calc01.ethanfa.com",
    thumbnail: {
      gradient: "from-blue-950 via-violet-950 to-black",
      accent: "#6366F1",
      icon: "∑",
      bgClass: "bg-gradient-to-br from-blue-950 via-violet-950 to-black",
    },
    matchScore: 97,
    maturityRating: "All",
  },
  {
    id: "emoji-reactor",
    title: "OG Emoji Reactor",
    displayTitle: "OG Emoji Reactor",
    tagline: "Your face, but make it emoji",
    description:
      "Real-time facial expression and pose detection via webcam. Smile → 😊. Raise hands → 🙌. Stay still → 😐. Powered by MediaPipe.",
    longDescription:
      "Uses MediaPipe's Face Mesh and Pose detection to track your expressions and body language through your webcam in real time. The app overlays matching emojis on screen as you move — a smile triggers 😊, raising both hands shows 🙌, and a straight face defaults to 😐. Built entirely in Python with OpenCV for video capture. Fully customizable: swap in your own emoji images or adjust detection thresholds. An original project that proves computer vision can be fun.",
    year: 2024,
    status: "finished",
    type: "Python App",
    genre: ["Computer Vision", "AI/ML", "Python", "Fun"],
    tech: ["Python 3", "OpenCV", "MediaPipe", "NumPy"],
    subdomain: "emoji",
    githubUrl: "https://github.com/ethanfalik",
    liveUrl: "https://github.com/ethanfalik",
    thumbnail: {
      gradient: "from-purple-950 via-pink-950 to-black",
      accent: "#EC4899",
      icon: "😊",
      bgClass: "bg-gradient-to-br from-purple-950 via-pink-950 to-black",
    },
    matchScore: 95,
    maturityRating: "All",
  },
  {
    id: "signlingo",
    title: "SignLingo",
    displayTitle: "SignLingo",
    tagline: "Learn ASL with your hands",
    description:
      "A Duolingo-style desktop app teaching American Sign Language fingerspelling with real-time ML-powered hand tracking. Coming soon.",
    longDescription:
      "SignLingo brings ASL fingerspelling to your desktop with a Duolingo-inspired learning experience. Your webcam tracks hand landmarks via MediaPipe in real time, and a TensorFlow.js model trained on crowdsourced data gives you instant feedback on each letter. The app runs offline, works cross-platform (Windows, Mac, Linux) via Electron, and is designed with accessibility at its core. Firebase powers a backend for sharing training data and tracking progress. Currently in active development.",
    year: 2025,
    status: "wip",
    type: "Desktop App",
    genre: ["AI/ML", "Education", "Accessibility", "Electron"],
    tech: ["Electron", "React", "TypeScript", "MediaPipe", "TensorFlow.js", "Firebase"],
    subdomain: "signlingo",
    thumbnail: {
      gradient: "from-teal-950 via-cyan-950 to-black",
      accent: "#14B8A6",
      icon: "🤟",
      bgClass: "bg-gradient-to-br from-teal-950 via-cyan-950 to-black",
    },
    matchScore: 0,
    maturityRating: "All",
  },
  {
    id: "poop",
    title: "💩",
    displayTitle: "💩",
    tagline: "Send vibes, no words needed",
    description:
      "An iOS app with Liquid Glass UI for sending emoji notifications to friends in real time. Friend system, push notifications, SwiftUI.",
    longDescription:
      "Built with SwiftUI and Apple's latest Liquid Glass design language, this iOS app lets you send emoji messages to friends with zero friction. A clean friend system with shareable invite links makes it easy to connect. Push notifications via Firebase Cloud Messaging ensure your messages land instantly. Onboarding with avatar upload, user blocking, and real-time Firestore sync complete the package. A polished, feature-complete iOS project awaiting its Firebase backend configuration before launch.",
    year: 2024,
    status: "wip",
    type: "iOS App",
    genre: ["Mobile", "Social", "SwiftUI", "iOS"],
    tech: ["SwiftUI", "Swift", "Firebase", "Firestore", "FCM", "PhotosUI"],
    subdomain: "poop",
    thumbnail: {
      gradient: "from-amber-950 via-yellow-950 to-black",
      accent: "#F59E0B",
      icon: "💩",
      bgClass: "bg-gradient-to-br from-amber-950 via-yellow-950 to-black",
    },
    matchScore: 0,
    maturityRating: "All",
  },
];

export const getProjectById = (id: string) =>
  projects.find((p) => p.id === id) ?? null;

export const getProjectsByGenre = (genre: string) =>
  projects.filter((p) => p.genre.includes(genre));

export const getFinishedProjects = () =>
  projects.filter((p) => p.status === "finished");

export const getWipProjects = () =>
  projects.filter((p) => p.status === "wip");

export const rows = [
  { title: "All Projects", projects: projects },
  {
    title: "Web & Developer Tools",
    projects: projects.filter((p) =>
      ["rustplusplus", "calc01"].includes(p.id)
    ),
  },
  {
    title: "AI & Computer Vision",
    projects: projects.filter((p) =>
      ["emoji-reactor", "signlingo"].includes(p.id)
    ),
  },
  {
    title: "Mobile & Desktop",
    projects: projects.filter((p) => ["poop", "signlingo"].includes(p.id)),
  },
  {
    title: "Coming Soon",
    projects: projects.filter((p) => p.status === "wip"),
  },
];
