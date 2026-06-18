import { LandingTheme } from "@/components/landing/landing-theme"
import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { Plans } from "@/components/landing/plans"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <>
      <LandingTheme />
      <LandingNav />
      <main className="landing">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Plans />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  )
}
