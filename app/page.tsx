import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { Testimonials } from "@/components/landing/testimonials"
import { Plans } from "@/components/landing/plans"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <Plans />
        <CTASection />
      </main>
      <LandingFooter />
    </>
  )
}
