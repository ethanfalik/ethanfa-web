"use client";

import { useRouter } from "next/navigation";

const profiles = [
  {
    id: "about",
    name: "about me",
    href: "/about",
    newTab: false,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill="#003087" />
        {/* Stylised person silhouette */}
        <circle cx="50" cy="34" r="17" fill="rgba(255,255,255,0.9)" />
        <path
          d="M16 90 C16 68 84 68 84 90"
          fill="rgba(255,255,255,0.9)"
        />
        {/* Subtle grid lines for depth */}
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "projects",
    name: "projects",
    href: "/browse",
    newTab: false,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill="#8B0000" />
        {/* Code / monitor icon */}
        <rect x="18" y="28" width="64" height="40" rx="4" stroke="rgba(255,255,255,0.9)" strokeWidth="4" />
        <polyline
          points="30,55 40,45 30,35"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="44" y1="55" x2="58" y2="55" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
        <rect x="42" y="68" width="16" height="5" fill="rgba(255,255,255,0.9)" />
        <line x1="30" y1="73" x2="70" y2="73" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "github",
    name: "github",
    href: "https://github.com/ethanfalik",
    newTab: true,
    avatar: (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill="#1A5C2D" />
        {/* GitHub-inspired octocat simplified */}
        <path
          d="M50 18C32.33 18 18 32.33 18 50c0 14.15 9.17 26.15 21.88 30.38 1.6.29 2.19-.69 2.19-1.54 0-.75-.03-2.75-.04-5.4-8.9 1.93-10.78-4.29-10.78-4.29-1.46-3.7-3.55-4.68-3.55-4.68-2.9-1.98.22-1.94.22-1.94 3.21.22 4.9 3.3 4.9 3.3 2.85 4.88 7.48 3.47 9.31 2.65.29-2.06 1.11-3.47 2.02-4.27-7.1-.8-14.57-3.55-14.57-15.8 0-3.49 1.25-6.34 3.29-8.58-.33-.8-1.43-4.06.31-8.46 0 0 2.68-.86 8.78 3.27A30.6 30.6 0 0150 33.6c2.71.01 5.44.37 7.99 1.07 6.09-4.13 8.77-3.27 8.77-3.27 1.74 4.4.64 7.66.32 8.46 2.05 2.24 3.29 5.09 3.29 8.58 0 12.28-7.48 14.99-14.6 15.78 1.15.99 2.17 2.94 2.17 5.93 0 4.28-.04 7.73-.04 8.78 0 .85.57 1.85 2.19 1.54C72.84 76.14 82 64.14 82 50 82 32.33 67.67 18 50 18z"
          fill="rgba(255,255,255,0.9)"
        />
      </svg>
    ),
  },
];

export default function ProfilesPage() {
  const router = useRouter();

  const handleProfileClick = (profile: (typeof profiles)[0]) => {
    if (profile.newTab) {
      window.open(profile.href, "_blank");
    } else {
      router.push(profile.href);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.08) 0%, #141414 60%)",
      }}
    >
      {/* Netflix-style logo top-left */}
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
        {/* Heading */}
        <h1
          className="text-white font-light tracking-wide"
          style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}
        >
          Who&apos;s watching?
        </h1>

        {/* Profile avatars */}
        <div className="flex items-start gap-6 md:gap-10">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className="profile-avatar-wrapper flex flex-col items-center gap-3 group cursor-pointer bg-transparent border-none"
              onClick={() => handleProfileClick(profile)}
            >
              {/* Avatar circle */}
              <div
                className="profile-avatar-ring relative overflow-hidden rounded-md border-[3px] border-transparent transition-all duration-200 group-hover:border-white"
                style={{ width: 160, height: 160 }}
              >
                {profile.avatar}
              </div>

              {/* Profile name */}
              <span
                className="profile-name text-[#808080] text-sm tracking-widest uppercase transition-colors duration-200 group-hover:text-white"
                style={{ letterSpacing: "0.12em" }}
              >
                {profile.name}
              </span>
            </button>
          ))}
        </div>

        {/* Manage Profiles button */}
        <button
          className="mt-4 px-6 py-2 border border-[#808080] text-[#808080] text-sm tracking-widest uppercase transition-all duration-200 hover:text-white hover:border-white"
          style={{ letterSpacing: "0.12em" }}
        >
          Manage Profiles
        </button>
      </div>
    </div>
  );
}
