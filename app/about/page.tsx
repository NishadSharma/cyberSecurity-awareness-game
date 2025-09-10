'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Users, Award, Zap, Brain, Lock } from 'lucide-react'
import PageTransition from '@/components/ui/page-transition'
import AnimatedButton from '@/components/ui/animated-button'

export default function About() {
  return (
    <PageTransition className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          >
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-full border border-cyan-400/30 pulse-glow">
              <Shield className="h-12 w-12 text-cyan-400" />
            </div>
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent neon-text">CyberGuard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of cyber defenders through immersive, 
            <span className="text-cyan-400"> gamified learning experiences</span> in a cyberpunk digital realm.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-cyan-500/20 backdrop-blur-sm p-8 mb-16 cyber-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-400/30">
              <Target className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                In the neon-lit digital landscape of 2025, cybersecurity threats evolve at lightning speed. 
                Traditional training methods fail to engage the cyberpunk generation effectively, leaving 
                digital citizens vulnerable to sophisticated attacks.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                CyberGuard bridges this gap by transforming cybersecurity education into an immersive, 
                game-based experience that resonates with modern learners.
              </p>
            </div>
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative bg-gray-900/50 rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-6 w-6 text-cyan-400" />
                  <span className="text-cyan-300 font-semibold">Neural Learning Protocol</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Our AI-powered learning system adapts to your skill level, providing personalized 
                  challenges that maximize knowledge retention and practical application.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            {
              icon: Target,
              title: "Interactive Simulations",
              description: "Hands-on scenarios that mirror real-world cybersecurity challenges in a safe virtual environment.",
              color: "from-cyan-500/20 to-blue-500/20",
              borderColor: "border-cyan-500/30",
              iconColor: "text-cyan-400"
            },
            {
              icon: Users,
              title: "For All Skill Levels",
              description: "From cybersecurity novices to seasoned professionals, our adaptive learning system scales to your expertise.",
              color: "from-emerald-500/20 to-green-500/20",
              borderColor: "border-emerald-500/30",
              iconColor: "text-emerald-400"
            },
            {
              icon: Award,
              title: "Evidence-Based Learning",
              description: "Built on cutting-edge cybersecurity research and industry best practices from leading security firms.",
              color: "from-purple-500/20 to-pink-500/20",
              borderColor: "border-purple-500/30",
              iconColor: "text-purple-400"
            },
            {
              icon: Shield,
              title: "Comprehensive Coverage",
              description: "Master all aspects of cybersecurity from password hygiene to advanced threat detection.",
              color: "from-amber-500/20 to-orange-500/20",
              borderColor: "border-amber-500/30",
              iconColor: "text-amber-400"
            },
            {
              icon: Zap,
              title: "Real-time Feedback",
              description: "Instant analysis and personalized recommendations to accelerate your learning journey.",
              color: "from-rose-500/20 to-red-500/20",
              borderColor: "border-rose-500/30",
              iconColor: "text-rose-400"
            },
            {
              icon: Lock,
              title: "Practical Skills",
              description: "Learn by doing with hands-on exercises that translate directly to real-world security practices.",
              color: "from-indigo-500/20 to-blue-500/20",
              borderColor: "border-indigo-500/30",
              iconColor: "text-indigo-400"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} rounded-xl border ${feature.borderColor} backdrop-blur-sm p-6 hover:scale-105 transition-all duration-300 cyber-border`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`p-3 bg-gray-900/50 rounded-full border ${feature.borderColor} mb-4 w-fit`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl border border-cyan-500/20 p-12 cyber-border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            animate={{ textShadow: ['0 0 10px rgba(6, 182, 212, 0.8)', '0 0 20px rgba(16, 185, 129, 1)', '0 0 10px rgba(6, 182, 212, 0.8)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Ready to Enter the Cyber Realm?
          </motion.h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of digital warriors who are already strengthening their cybersecurity knowledge 
            through our immersive training protocols.
          </p>
          <Link href="/play-hub">
            <AnimatedButton variant="primary" size="lg" className="cyberpunk-glow">
              <Zap className="h-5 w-5" />
              Initialize Training Protocol
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  )
}