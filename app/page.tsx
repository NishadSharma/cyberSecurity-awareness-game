import HeroSection from '@/components/hero-section'
import PageTransition from '@/components/ui/page-transition'

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
    </PageTransition>
  )
}