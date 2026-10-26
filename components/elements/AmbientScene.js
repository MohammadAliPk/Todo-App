"use client";

import { motion } from "framer-motion";

/** Floating 3D ambient shapes — animation #1 */
function AmbientScene() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden scene-3d"
      aria-hidden
    >
      <motion.div
        className="shape-3d absolute -left-16 top-24 h-56 w-56 rounded-[2rem] bg-gradient-to-br from-tide-glow/40 to-tide/20 blur-[2px]"
        style={{
          boxShadow:
            "inset -12px -12px 24px rgba(15,28,26,0.12), 18px 28px 40px rgba(15,118,110,0.18)",
          transform: "rotateX(48deg) rotateZ(-18deg)"
        }}
        animate={{
          y: [0, -28, 0],
          rotateZ: [-18, -10, -18],
          rotateX: [48, 56, 48]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="shape-3d absolute right-[8%] top-[18%] h-36 w-36 rounded-full bg-gradient-to-tr from-ember-soft/50 to-ember/20"
        style={{
          boxShadow:
            "inset -8px -10px 20px rgba(217,119,6,0.25), 16px 20px 36px rgba(217,119,6,0.2)"
        }}
        animate={{
          y: [0, 22, 0],
          x: [0, -14, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      <motion.div
        className="shape-3d absolute bottom-[12%] left-[35%] h-28 w-28 rounded-2xl bg-gradient-to-br from-white/80 to-mist-deep/60"
        style={{
          boxShadow:
            "inset 6px 6px 14px rgba(255,255,255,0.9), 14px 18px 30px rgba(15,28,26,0.12)",
          transform: "rotateX(35deg) rotateY(-25deg)"
        }}
        animate={{
          rotateY: [-25, 15, -25],
          y: [0, -16, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      <motion.div
        className="absolute right-[22%] bottom-[20%] h-20 w-20 rounded-xl border border-tide/30 bg-tide/10 backdrop-blur-sm"
        style={{ transform: "rotateX(20deg) rotateZ(25deg)" }}
        animate={{ rotateZ: [25, 40, 25], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,transparent_40%,rgba(238,245,242,0.75)_100%)]" />
    </div>
  );
}

export default AmbientScene;
