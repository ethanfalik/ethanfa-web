"use client";

import { useRouter } from "next/navigation";

// Clean minimal SVG avatars — dark backgrounds, simple line icons
const AboutIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#1a1a1a" />
    {/* Head */}
    <circle cx="50" cy="36" r="14" stroke="white" strokeWidth="2.5" fill="none" />
    {/* Shoulders */}
    <path d="M22 82 C22 62 78 62 78 82" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const ProjectsIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#1a1a1a" />
    {/* < */}
    <polyline points="30,38 18,50 30,62" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* > */}
    <polyline points="70,38 82,50 70,62" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* / */}
    <line x1="58" y1="32" x2="42" y2="68" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#1a1a1a" />
    <path
      d="M50 18C32.33 18 18 32.33 18 50c0 14.15 9.17 26.15 21.88 30.38 1.6.29 2.19-.69 2.19-1.54 0-.75-.03-2.75-.04-5.4-8.9 1.93-10.78-4.29-10.78-4.29-1.46-3.7-3.55-4.68-3.55-4.68-2.9-1.98.22-1.94.22-1.94 3.21.22 4.9 3.3 4.9 3.3 2.85 4.88 7.48 3.47 9.31 2.65.29-2.06 1.11-3.47 2.02-4.27-7.1-.8-14.57-3.55-14.57-15.8 0-3.49 1.25-6.34 3.29-8.58-.33-.8-1.43-4.06.31-8.46 0 0 2.68-.86 8.78 3.27A30.6 30.6 0 0150 33.6c2.71.01 5.44.37 7.99 1.07 6.09-4.13 8.77-3.27 8.77-3.27 1.74 4.4.64 7.66.32 8.46 2.05 2.24 3.29 5.09 3.29 8.58 0 12.28-7.48 14.99-14.6 15.78 1.15.99 2.17 2.94 2.17 5.93 0 4.28-.04 7.73-.04 8.78 0 .85.57 1.85 2.19 1.54C72.84 76.14 82 64.14 82 50 82 32.33 67.67 18 50 18z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

const profiles = [
  { id: "about",    name: "about me",  href: "/about",                        newTab: false, Icon: AboutIcon    },
  { id: "projects", name: "projects",  href: "/browse",                       newTab: false, Icon: ProjectsIcon },
  { id: "github",   name: "github",    href: "https://github.com/ethanfalik", newTab: true,  Icon: GitHubIcon   },
];

export default function ProfilesPage() {
  const router = useRouter();

  const handleClick = (profile: (typeof profiles)[0]) => {
    if (profile.newTab) window.open(profile.href, "_blank");
    else router.push(profile.href);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#141414" }}
    >
      {/* Logo */}
      <div className="absolute top-8 left-12">
        <span
          style={{
            color: "#E50914",
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 36,
            letterSpacing: "-0.01em",
          }}
        >
          ethan
        </span>
      </div>

      <div className="flex flex-col items-center gap-14 animate-fadeIn">
        <h1
          className="text-white font-light"
          style={{ fontSize: "clamp(26px, 3.5vw, 48px)", letterSpacing: "0.01em" }}
        >
          Who&apos;s watching?
        </h1>

        <div className="flex items-start gap-8 md:gap-12">
          {profiles.map(({ id, name, Icon, ...profile }) => (
            <button
              key={id}
              className="flex flex-col items-center gap-3 group cursor-pointer bg-transparent border-none"
              onClick={() => handleClick({ id, name, Icon, ...profile })}
            >
              <div
                className="relative overflow-hidden rounded-md border-[3px] border-transparent transition-all duration-200 group-hover:border-white"
                style={{ width: 156, height: 156 }}
              >
                <Icon />
              </div>
              <span
                className="text-[#808080] text-sm uppercase transition-colors duration-200 group-hover:text-white"
                style={{ letterSpacing: "0.12em" }}
              >
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
