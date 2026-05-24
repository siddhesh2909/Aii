"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "DataFlow AI transformed our data operations. What used to take weeks now happens in hours with their AI-powered cleaning and validation.",
    author: "Sarah Chen",
    role: "VP of Data Engineering",
    company: "TechFlow Inc",
    rating: 5,
  },
  {
    quote: "The collaborative features are game-changing. Our data engineers and business analysts finally work together seamlessly on the same platform.",
    author: "Michael Rodriguez",
    role: "Chief Data Officer",
    company: "DataVerse Systems",
    rating: 5,
  },
  {
    quote: "The AI chatbot is incredibly intuitive. Our non-technical team members can now query complex datasets without writing a single line of SQL.",
    author: "Emily Watson",
    role: "Director of Analytics",
    company: "Quantum AI Labs",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 relative" id="testimonials">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Loved by{" "}
            <span className="text-primary">data teams</span>{" "}
            everywhere
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Join thousands of organizations that have transformed their data workflows 
            with our AI-powered platform.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass rounded-2xl p-8 h-full hover:border-primary/30 transition-colors duration-300">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {testimonial.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
