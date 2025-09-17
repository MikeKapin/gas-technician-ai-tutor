'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Flame,
  BookOpen,
  Brain,
  Search,
  MessageCircle,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  Award,
  Home,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import TutorSelection from '@/components/tutor/TutorSelection'
import { TutorLevel } from '@/types/tutor'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="application-card group hover:scale-[1.02] transition-transform"
  >
    <div className="application-icon mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
)

const StatCard = ({ number, label, delay = 0 }: { number: string, label: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6"
  >
    <div className="text-3xl font-bold text-primary-600 mb-2">{number}</div>
    <div className="text-slate-600 text-sm uppercase tracking-wide">{label}</div>
  </motion.div>
)

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showTutorSelection, setShowTutorSelection] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGetStarted = () => {
    setShowTutorSelection(true)
  }

  const handleTutorSelected = (level: TutorLevel) => {
    router.push(`/chat?tutor=${level}`)
  }

  const handleExploreFeatures = () => {
    router.push('/dashboard')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (showTutorSelection) {
    return (
      <TutorSelection
        onTutorSelected={handleTutorSelected}
        selectedLevel={undefined}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="application-icon">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Gas Technician AI Tutor
                </h1>
                <p className="text-xs text-slate-500">Canadian Gas Code Assistant</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <button
                onClick={handleGetStarted}
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                Start Learning
              </button>
              <Link
                href="/dashboard"
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/modules"
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                Modules
              </Link>
              <button
                onClick={handleGetStarted}
                className="interactive-button"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Master the{' '}
                <span className="text-gradient">Canadian Gas Code</span>
                <br />
                with AI Intelligence
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Choose your specialized AI tutor for G3 or G2 certification. Get personalized explanations
                of CSA B149.1-25, B149.2-25, TSSA regulations, and all learning modules.
              </p>
            </motion.div>

            {/* Tutor Level Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">G3 Tutor</h3>
                    <p className="text-sm text-slate-600">Residential & Small Commercial</p>
                  </div>
                </div>
                <ul className="text-left space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    CSA B149.1-25 Code
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    TSSA Act & Regulations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Learning Modules 1-9
                  </li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">G2 Tutor</h3>
                    <p className="text-sm text-slate-600">Commercial & Industrial</p>
                  </div>
                </div>
                <ul className="text-left space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    CSA B149.1-25 & B149.2-25
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    Advanced Regulations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                    Learning Modules 10-24
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={handleGetStarted}
                className="interactive-button text-lg px-8 py-4 shadow-lg hover:shadow-xl"
              >
                Choose Your AI Tutor
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={handleExploreFeatures}
                className="flex items-center px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-all font-medium"
              >
                Explore Features
                <Search className="ml-2 h-5 w-5" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              <StatCard number="24" label="CSA Modules" delay={0.5} />
              <StatCard number="2" label="Code Books" delay={0.6} />
              <StatCard number="1000+" label="Examples" delay={0.7} />
              <StatCard number="24/7" label="AI Support" delay={0.8} />
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
          <div className="w-96 h-96 bg-gradient-to-r from-primary-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Specialized AI Tutoring Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced AI capabilities designed specifically for Canadian Gas Technician training with level-specific expertise
            </p>
          </motion.div>

          <div className="grid-responsive">
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8" />}
              title="Level-Specific AI Chat"
              description="G3 or G2 specialized AI tutors that understand your certification level and provide targeted guidance for your specific learning path."
              delay={0.1}
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="Multi-Code Integration"
              description="G3: Complete CSA B149.1-25 coverage. G2: Advanced dual-code expertise with CSA B149.1-25 and B149.2-25 (Propane) integration."
              delay={0.2}
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Code Compass Explainer"
              description="Breaking down complex code sections into easy-to-understand explanations with visual guides, real-world contexts, and step-by-step instructions."
              delay={0.3}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Targeted Real-World Examples"
              description="G3: Residential and small commercial scenarios. G2: Advanced commercial and industrial applications with complex system examples."
              delay={0.4}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="TSSA Regulation Focus"
              description="Comprehensive coverage of TSSA Act requirements, Ontario regulations, and safety protocols specific to your certification level."
              delay={0.5}
            />
            <FeatureCard
              icon={<Award className="h-8 w-8" />}
              title="Module-Specific Training"
              description="G3: Focused training on Modules 1-9. G2: Advanced training covering Modules 10-24 with complex system integration concepts."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Your AI Tutor Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Three simple steps to get specialized, level-appropriate gas technician training
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Select Your Level',
                description: 'Choose G3 tutor for residential/small commercial focus with CSA B149.1-25 and TSSA regulations, or G2 tutor for advanced commercial/industrial training with dual-code expertise.',
                icon: <Award className="h-6 w-6" />
              },
              {
                step: '2',
                title: 'Ask Targeted Questions',
                description: 'Your AI tutor understands your certification level and provides answers specific to your learning path, code coverage, and module requirements.',
                icon: <MessageCircle className="h-6 w-6" />
              },
              {
                step: '3',
                title: 'Learn with Context',
                description: 'Get explanations tailored to your level with appropriate examples, code references, and real-world applications for your certification path.',
                icon: <Brain className="h-6 w-6" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <div className="application-icon mx-auto -mt-8 mb-4 bg-white border-4 border-primary-100">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Master Your Gas Technology Level?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Choose your specialized AI tutor and get personalized training for G3 or G2 certification with targeted code coverage and module-specific guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-primary-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Select Your AI Tutor
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => router.push('/modules')}
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Browse Learning Modules
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">Gas Technician AI Tutor</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Specialized AI tutors for G3 and G2 Canadian Gas Technician certification.
                Learn with targeted code coverage and module-specific training.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">G3 Coverage</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>CSA B149.1-25</li>
                <li>TSSA Regulations</li>
                <li>Modules 1-9</li>
                <li>Residential Systems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">G2 Coverage</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>CSA B149.1-25 & B149.2-25</li>
                <li>Advanced Regulations</li>
                <li>Modules 10-24</li>
                <li>Commercial Systems</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Gas Technician AI Tutor. Specialized Training for Canadian Gas Technician Excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}