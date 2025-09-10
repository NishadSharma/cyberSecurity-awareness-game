'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Mail, Lock, Trophy, Clock, Users, Zap, Target, Shield } from 'lucide-react'
import PageTransition from '@/components/ui/page-transition'
import AnimatedButton from '@/components/ui/animated-button'

export default function PlayHub() {
  const games = [
    {
      id: 'quiz',
      title: 'Neural Quiz Protocol',
      description: 'Test your cybersecurity knowledge with AI-generated challenges covering advanced security protocols.',
      icon: Brain,
      difficulty: 'Adaptive',
      duration: '10-15 min',
      players: 'Solo Mission',
      color: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      href: '/games/quiz'
    },
    {
      id: 'phishing',
      title: 'Phishing Detection Matrix',
      description: 'Analyze suspicious emails and identify phishing attempts in our interactive email viewer.',
      icon: Mail,
      difficulty: 'Dynamic',
      duration: '15-20 min',
      players: 'Solo Mission',
      color: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      href: '/games/phishing'
    },
    {
      id: 'scenario',
      title: 'Threat Simulation Matrix',
      description: 'Navigate complex cybersecurity scenarios in our virtual reality training environment.',
      icon: Target,
      difficulty: 'Dynamic',
      duration: '15-25 min', 
      players: 'Solo Mission',
      color: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      href: '/games/scenario'
    },
    {
      id: 'password',
      title: 'Encryption Forge',
      description: 'Master the quantum art of creating unbreakable passwords and authentication protocols.',
      icon: Lock,
      difficulty: 'Progressive',
      duration: '8-12 min',
      players: 'Solo Mission',
      color: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      href: '/games/password'
    },
  ]

  return (
    <PageTransition className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            <div className="relative">
              <motion.div 
                className="p-4 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full border border-cyan-400/30 pulse-glow"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-12 w-12 text-cyan-400" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 p-1 bg-emerald-500/30 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="h-4 w-4 text-emerald-300" />
              </motion.div>
            </div>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent neon-text">
              Training Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Choose your cybersecurity training protocol. Each simulation is designed to enhance your 
            <span className="text-cyan-400"> digital defense capabilities</span> through engaging, hands-on experiences.
          </p>
        </motion.div>

        {/* Game Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {games.map((game, index) => {
            const IconComponent = game.icon
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${game.bgGradient} rounded-2xl border ${game.borderColor} backdrop-blur-sm p-8 h-full cyber-border hover:shadow-2xl transition-all duration-500`}>
                  {/* Icon */}
                  <motion.div 
                    className={`p-4 bg-gray-900/50 rounded-full border ${game.borderColor} mb-6 w-fit relative`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <IconComponent className={`h-10 w-10 ${game.iconColor}`} />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{game.description}</p>
                  
                  {/* Game Stats */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{game.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{game.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{game.players}</span>
                    </div>
                  </div>
                  
                  <Link href={game.href}>
                    <AnimatedButton 
                      variant="primary" 
                      className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg`}
                    >
                      <Zap className="h-5 w-5" />
                      Initialize Protocol
                    </AnimatedButton>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-emerald-500/20 backdrop-blur-sm p-12 text-center cyber-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="p-4 bg-emerald-500/20 rounded-full border border-emerald-400/30">
              <Brain className="h-10 w-10 text-emerald-400" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Advanced Protocols Loading...
            </span>
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-3xl mx-auto">
            Our neural networks are constantly developing new immersive experiences. 
            Stay connected for social engineering defense matrices, incident response simulators, 
            and multiplayer cyber warfare challenges.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Social Engineering Defense Matrix",
              "Incident Response Simulator", 
              "Network Penetration Challenge",
              "Quantum Cryptography Lab"
            ].map((protocol, index) => (
              <motion.div
                key={protocol}
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.5)' }}
              >
                <span className="text-gray-400 text-sm">{protocol}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}