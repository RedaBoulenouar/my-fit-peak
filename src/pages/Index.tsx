import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, BarChart3, Calculator, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fitness.jpg";

const features = [
  {
    icon: Dumbbell,
    title: "Générateur d'entraînement",
    description: "Programmes personnalisés selon tes objectifs et ton niveau. Choisis tes muscles, on s'occupe du reste.",
    link: "/workout",
    cta: "Générer",
  },
  {
    icon: BarChart3,
    title: "Tracker de progression",
    description: "Visualise tes progrès semaine après semaine. Poids, répétitions, volume — tout est suivi.",
    link: "/progress",
    cta: "Suivre",
  },
  {
    icon: Calculator,
    title: "Calculateur de macros",
    description: "Calcule tes besoins en protéines, glucides et lipides selon ton profil et tes objectifs.",
    link: "/macros",
    cta: "Calculer",
  },
];

const stats = [
  { icon: Zap, value: "500+", label: "Exercices" },
  { icon: Target, value: "12", label: "Groupes musculaires" },
  { icon: TrendingUp, value: "100%", label: "Gratuit" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Fitness" className="h-full w-full object-cover" />
          <div className="absolute inset-0 gradient-hero-overlay" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              MyFit<span className="text-primary text-glow">Peak</span>
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              Ton coach fitness intelligent. Génère tes entraînements, suis ta progression et optimise ta nutrition.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground font-heading font-bold text-lg px-8 py-6 animate-pulse-glow">
                <Link to="/workout">
                  Commencer <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl sm:text-5xl font-bold mb-4">
              Tout ce qu'il te faut pour <span className="text-primary">performer</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trois outils puissants, une seule plateforme. Pas d'excuse.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to={feature.link} className="group block h-full">
                  <div className="gradient-card rounded-xl border border-border p-8 h-full transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(82_85%_50%/0.1)]">
                    <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-semibold text-primary">
                      {feature.cta} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-foreground">MyFitPeak</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/workout" className="hover:text-foreground transition-colors">Entraînement</Link>
            <Link to="/progress" className="hover:text-foreground transition-colors">Progression</Link>
            <Link to="/macros" className="hover:text-foreground transition-colors">Macros</Link>
          </nav>
          <p className="text-xs text-muted-foreground">© 2026 MyFitPeak. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
