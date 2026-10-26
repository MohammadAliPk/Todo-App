/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f1c1a",
          soft: "#243330",
          mute: "#5a6e69"
        },
        mist: {
          DEFAULT: "#eef5f2",
          deep: "#dce8e3",
          frost: "rgba(255,255,255,0.72)"
        },
        tide: {
          DEFAULT: "#0f766e",
          bright: "#14b8a6",
          glow: "#2dd4bf"
        },
        ember: {
          DEFAULT: "#d97706",
          soft: "#f59e0b"
        },
        coral: {
          DEFAULT: "#e11d48"
        }
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-figtree)", "sans-serif"]
      },
      boxShadow: {
        lift: "0 18px 40px -18px rgba(15, 28, 26, 0.28)",
        glass: "0 8px 32px rgba(15, 118, 110, 0.12)",
        depth: "0 25px 50px -12px rgba(15, 28, 26, 0.25)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(45, 212, 191, 0.35), transparent), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(245, 158, 11, 0.22), transparent), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(15, 118, 110, 0.12), transparent)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotateX(0deg)" },
          "50%": { transform: "translateY(-18px) rotateX(8deg)" }
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(12px,-22px,40px) rotate(8deg)" }
        },
        "spin-3d": {
          "0%": { transform: "rotateX(12deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(12deg) rotateY(360deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "spin-3d": "spin-3d 14s linear infinite",
        shimmer: "shimmer 3.5s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
