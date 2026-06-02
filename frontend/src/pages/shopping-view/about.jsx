import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Sparkles, Truck, Users } from "lucide-react";

function ShoppingAbout() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-gradient tracking-tight"
        >
          Our Story
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          Fashionify was founded on a simple belief: high fashion and stunning design should be accessible to all. We curate the trendiest clothes, accessories, and footwear with meticulous care, delivering exceptional premium styling and unmatched quality right to your doorstep.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gradient">Why Choose Fashionify?</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are dedicated to defining modern style. Every brand and collection we feature undergoes a rigorous vetting process to guarantee first-class comfort, exquisite fabric composition, and unique design patterns that highlight your distinct persona.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you are upgrading your casual wardrobe, seeking the perfect statement accessories, or stepping out in stylish new footwear, Fashionify ensures a flawless boutique experience from browsing to checkout.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Sparkles,
              title: "Exclusive Designs",
              desc: "Uniquely curated apparel that stands out.",
            },
            {
              icon: ShieldCheck,
              title: "Premium Quality",
              desc: "Strictly vetted high-grade premium fabrics.",
            },
            {
              icon: Truck,
              title: "Express Shipping",
              desc: "Quick delivery directly to your home.",
            },
            {
              icon: Users,
              title: "Happy Customers",
              desc: "Over 50,000+ satisfied fashionable shoppers.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="card-gradient card-gradient-hover border-t-2 border-t-purple-500/20 overflow-hidden h-full">
                <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="p-3 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingAbout;
