"use client"

import { Code2, Zap, Shield, Palette } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Code2,
    title: "Beautiful Reusable Components",
    description:
      "Versatile collection of pre-designed React and Next.js components based on JSX. From dynamic forms to interactive dashboards.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Zap,
    title: "Highly-Customizable with Tailwind CSS",
    description:
      "Effortlessly style and theme your UI with Tailwind CSS. Leverage utility-first classes for pixel-perfect designs without custom CSS.",
    color: "from-purple-400 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description: "Enterprise-grade components tested and optimized for performance. Deploy with confidence to scale.",
    color: "from-green-400 to-teal-500",
  },
  {
    icon: Palette,
    title: "Dark & Light Modes",
    description:
      "Seamless theme switching with built-in dark mode support. Perfect contrast ratios and accessibility out of the box.",
    color: "from-orange-400 to-pink-500",
  },
]

export function FeatureCards() {
  return (
    <section className="py-20 px-4 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build modern, responsive web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="card-elevated p-8 border-0 bg-card hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
