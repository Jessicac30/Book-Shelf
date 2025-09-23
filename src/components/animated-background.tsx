'use client'

import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradiente animado de fundo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        animate={{
          background: [
            'linear-gradient(to bottom right, rgb(239 246 255), rgb(255 255 255), rgb(238 242 255))',
            'linear-gradient(to bottom right, rgb(238 242 255), rgb(249 250 251), rgb(239 246 255))',
            'linear-gradient(to bottom right, rgb(239 246 255), rgb(255 255 255), rgb(238 242 255))',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Círculos flutuantes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-60"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Partículas pequenas */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Formas geométricas */}
      <motion.div
        className="absolute top-20 right-20 w-4 h-4 bg-indigo-200 opacity-30"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-32 right-1/3 w-6 h-6 bg-blue-200 opacity-20"
        animate={{
          rotate: [0, -360],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}