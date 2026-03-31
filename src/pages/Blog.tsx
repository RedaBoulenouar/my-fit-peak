import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Dumbbell, Apple, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const articles = [
  {
    id: 1,
    title: "Les 5 meilleurs exercices pour prendre de la masse",
    excerpt: "Découvre les mouvements composés essentiels pour maximiser ta prise de muscle et optimiser chaque séance.",
    category: "Entraînement",
    icon: Dumbbell,
    date: "28 Mars 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Comment calculer ses macros pour la sèche",
    excerpt: "Guide complet pour ajuster tes protéines, glucides et lipides afin de perdre du gras tout en conservant ta masse musculaire.",
    category: "Nutrition",
    icon: Apple,
    date: "25 Mars 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "L'importance du sommeil dans la récupération",
    excerpt: "Le sommeil est le pilier oublié de la performance. Voici pourquoi dormir 7-9h change tout pour tes résultats.",
    category: "Bien-être",
    icon: Brain,
    date: "22 Mars 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Programme full body vs split : lequel choisir ?",
    excerpt: "Analyse détaillée des deux approches d'entraînement les plus populaires selon ton niveau et tes objectifs.",
    category: "Entraînement",
    icon: Dumbbell,
    date: "18 Mars 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Les protéines végétales : mythe ou réalité ?",
    excerpt: "Peut-on vraiment construire du muscle avec une alimentation végétale ? La science répond.",
    category: "Nutrition",
    icon: Apple,
    date: "15 Mars 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Gérer le stress pour de meilleurs résultats",
    excerpt: "Le cortisol est l'ennemi de ta progression. Découvre des techniques simples pour le maîtriser.",
    category: "Bien-être",
    icon: Brain,
    date: "12 Mars 2026",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Le <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Conseils, astuces et science du fitness pour t'aider à atteindre tes objectifs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group gradient-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(82_85%_50%/0.1)] cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
                  <article.icon className="h-3 w-3 mr-1" />
                  {article.category}
                </Badge>
              </div>

              <div className="p-5">
                <h2 className="font-heading text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
