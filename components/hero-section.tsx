'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Shield, Lock, Eye, Zap, Bot } from 'lucide-react'
import AnimatedButton from '@/components/ui/animated-button'

export default function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-ping" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Logo/Mascot */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <motion.div 
              className="p-6 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full border-2 border-cyan-400/30 cyber-border pulse-glow"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="h-20 w-20 text-cyan-400" />
            </motion.div>
            
            {/* Mascot elements */}
            <motion.div
              className="absolute -top-2 -right-2 p-2 bg-emerald-500/20 rounded-full border border-emerald-400/50"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Bot className="h-6 w-6 text-emerald-400" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-1 -left-1 p-1 bg-cyan-500/20 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="h-4 w-4 text-cyan-300" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl sm:text-7xl font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.span 
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent neon-text"
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Play. Learn.
          </motion.span>
          <br />
          <motion.span 
            className="text-white glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Stay Secure.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Master cybersecurity through interactive games and scenarios. 
          <span className="text-cyan-400"> Build your digital defense skills</span> while having fun in our 
          <span className="text-emerald-400"> cyberpunk training environment</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Link href="/play-hub">
            <AnimatedButton variant="primary" size="lg" className="cyberpunk-glow">
              <Play className="h-6 w-6" />
              Play Now
            </AnimatedButton>
          </Link>
          
          <Link href="/about">
            <AnimatedButton variant="outline" size="lg">
              Learn More
            </AnimatedButton>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            {
              icon: Lock,
              title: "Password Security",
              description: "Master the art of creating unbreakable passwords",
              color: "from-cyan-500/20 to-blue-500/20",
              borderColor: "border-cyan-500/30",
              iconColor: "text-cyan-400"
            },
            {
              icon: Eye,
              title: "Phishing Detection", 
              description: "Spot and neutralize social engineering attacks",
              color: "from-emerald-500/20 to-green-500/20",
              borderColor: "border-emerald-500/30",
              iconColor: "text-emerald-400"
            },
            {
              icon: Shield,
              title: "Cyber Defense",
              description: "Build comprehensive security awareness",
              color: "from-purple-500/20 to-pink-500/20", 
              borderColor: "border-purple-500/30",
              iconColor: "text-purple-400"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} rounded-xl border ${feature.borderColor} backdrop-blur-sm p-6 hover:scale-105 transition-all duration-300 cyber-border`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`p-3 bg-gray-900/50 rounded-full border ${feature.borderColor} mb-4 w-fit mx-auto`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-20 h-20 border border-cyan-500/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-16 h-16 border border-emerald-500/20 rounded-lg"
          animate={{ rotate: -360, y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}