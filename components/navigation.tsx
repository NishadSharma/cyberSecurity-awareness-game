'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, User, LogOut, Zap, Play } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  const publicNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ]

  const authNavLinks = [
    { href: '/play-hub', label: 'Play Hub', icon: Play },
  ]

  const guestNavLinks = [
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ]

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <motion.nav 
      className="bg-gray-900/95 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3 text-cyan-400 group">
              <div className="relative">
                <Shield className="h-8 w-8 group-hover:text-cyan-300 transition-colors" />
                <Zap className="h-4 w-4 absolute -top-1 -right-1 text-emerald-400 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                CyberGuard
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
            
            {isAuthenticated && authNavLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (publicNavLinks.length + index), duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-all duration-300 relative group flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              )
            })}

            {!isAuthenticated && guestNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (publicNavLinks.length + index), duration: 0.5 }}
              >
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}

            {isAuthenticated && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800/50 transition-all flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 p-2 rounded-lg hover:bg-gray-800/50 transition-all"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 border-t border-cyan-500/20">
                {publicNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-cyan-400 block px-3 py-2 text-base font-medium transition-colors rounded-lg hover:bg-gray-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                
                {isAuthenticated && authNavLinks.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (publicNavLinks.length + index), duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-cyan-400 block px-3 py-2 text-base font-medium transition-colors rounded-lg hover:bg-gray-800/50 flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <IconComponent className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}

                {!isAuthenticated && guestNavLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (publicNavLinks.length + index), duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-cyan-400 block px-3 py-2 text-base font-medium transition-colors rounded-lg hover:bg-gray-800/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && (
                  <motion.div
                    className="border-t border-gray-700/50 pt-3 mt-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 px-3 py-2 text-gray-300">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-300 hover:text-red-400 px-3 py-2 text-base font-medium transition-colors rounded-lg hover:bg-gray-800/50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}