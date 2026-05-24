"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Building2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    icon: <Sparkles className="w-5 h-5" />,
    price: "Free",
    description: "Perfect for trying out the platform",
    features: [
      "Up to 100K records/month",
      "3 data sources",
      "Basic AI cleaning",
      "Community support",
      "1 team member",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    icon: <Rocket className="w-5 h-5" />,
    price: "$99",
    period: "/month",
    description: "For growing data teams",
    features: [
      "Up to 10M records/month",
      "Unlimited data sources",
      "Advanced AI cleaning",
      "Priority support",
      "10 team members",
      "Data contracts",
      "Collaboration tools",
      "Custom dashboards",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: <Building2 className="w-5 h-5" />,
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited records",
      "Unlimited everything",
      "Custom AI models",
      "24/7 dedicated support",
      "Unlimited team members",
      "SSO & advanced security",
      "Custom integrations",
      "On-premise deployment",
      "SLA guarantees",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Simple,{" "}
            <span className="text-primary">transparent pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`glass rounded-2xl p-8 h-full ${plan.popular ? "border-primary/50 glow-primary" : ""}`}>
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.popular ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA */}
                <Link href="/auth/signup">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
