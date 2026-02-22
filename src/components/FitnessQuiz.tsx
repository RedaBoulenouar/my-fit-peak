import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronRight, RotateCcw, Flame, Dumbbell, Wind, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: { label: string; value: string }[];
}

const questions: Question[] = [
  {
    question: "Quel est ton objectif principal ?",
    options: [
      { label: "Prendre du muscle", value: "masse" },
      { label: "Perdre du gras", value: "seche" },
      { label: "Améliorer mon endurance", value: "endurance" },
      { label: "Rester en forme", value: "maintenance" },
    ],
  },
  {
    question: "Combien de fois t'entraînes-tu par semaine ?",
    options: [
      { label: "0-1 fois", value: "sedentaire" },
      { label: "2-3 fois", value: "modere" },
      { label: "4-5 fois", value: "actif" },
      { label: "6+ fois", value: "intense" },
    ],
  },
  {
    question: "Comment décrirais-tu ton alimentation ?",
    options: [
      { label: "Je mange sans trop réfléchir", value: "random" },
      { label: "J'essaie de manger équilibré", value: "equilibre" },
      { label: "Je suis mes macros de près", value: "strict" },
      { label: "Je suis un régime spécifique", value: "regime" },
    ],
  },
  {
    question: "Depuis combien de temps tu t'entraînes ?",
    options: [
      { label: "Je débute", value: "debutant" },
      { label: "Quelques mois", value: "intermediaire" },
      { label: "1-3 ans", value: "avance" },
      { label: "3+ ans", value: "expert" },
    ],
  },
  {
    question: "Quel est ton rapport au cardio ?",
    options: [
      { label: "J'évite au maximum", value: "nocardio" },
      { label: "Un peu après la muscu", value: "peucardio" },
      { label: "Sessions dédiées régulières", value: "cardioregulier" },
      { label: "C'est ma priorité", value: "cardioprio" },
    ],
  },
];

interface Result {
  title: string;
  description: string;
  icon: typeof Flame;
  tips: string[];
  color: string;
}

const getResult = (answers: string[]): Result => {
  const goal = answers[0];
  const freq = answers[1];
  const cardio = answers[4];

  if (goal === "masse") {
    return {
      title: "Prise de masse",
      description: "Ton profil indique que tu devrais te concentrer sur un programme de prise de masse avec surplus calorique contrôlé.",
      icon: Dumbbell,
      color: "text-primary",
      tips: [
        "Vise un surplus de 300-500 kcal/jour",
        "Privilégie les exercices composés (squat, développé couché, soulevé de terre)",
        freq === "sedentaire" || freq === "modere"
          ? "Augmente progressivement à 4 séances/semaine"
          : "Maintiens ta fréquence actuelle avec des jours de repos",
        "Consomme 1.6-2.2g de protéines par kg de poids de corps",
      ],
    };
  }
  if (goal === "seche") {
    return {
      title: "Sèche / Perte de gras",
      description: "Ton objectif est de perdre du gras tout en préservant ta masse musculaire. Déficit modéré + entraînement intense.",
      icon: Flame,
      color: "text-orange-400",
      tips: [
        "Déficit calorique de 300-500 kcal/jour maximum",
        "Garde tes charges lourdes pour préserver le muscle",
        "Ajoute 2-3 sessions de cardio modéré par semaine",
        "Protéines élevées : 2-2.5g par kg de poids de corps",
      ],
    };
  }
  if (goal === "endurance") {
    return {
      title: "Endurance & Cardio",
      description: "Tu veux améliorer tes capacités cardiovasculaires et ton endurance globale.",
      icon: Wind,
      color: "text-sky-400",
      tips: [
        "Alterne entre HIIT et cardio basse intensité (LISS)",
        "Augmente progressivement la durée de tes sessions",
        cardio === "nocardio" ? "Commence par 20 min de cardio 3x/semaine" : "Ajoute de la variété (natation, vélo, course)",
        "Hydratation et glucides sont tes meilleurs alliés",
      ],
    };
  }
  return {
    title: "Maintenance & Bien-être",
    description: "Ton objectif est de rester en forme et en bonne santé, sans pression. Un équilibre parfait !",
    icon: Scale,
    color: "text-emerald-400",
    tips: [
      "Maintiens 3-4 séances variées par semaine",
      "Mange à tes calories de maintenance",
      "Alterne musculation et activités plaisir",
      "Écoute ton corps et priorise la récupération",
    ],
  };
};

const FitnessQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const progress = showResult ? 100 : (currentQ / questions.length) * 100;
  const result = showResult ? getResult(answers) : null;

  return (
    <div className="gradient-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-bold">Quiz : Quel est ton objectif idéal ?</h2>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-foreground font-heading font-semibold mb-4">
              {currentQ + 1}. {questions[currentQ].question}
            </p>
            <div className="grid gap-3">
              {questions[currentQ].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors text-sm text-foreground flex items-center justify-between group"
                >
                  {opt.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center mb-5">
              <result.icon className={`h-10 w-10 ${result.color} mx-auto mb-3`} />
              <h3 className="font-heading text-2xl font-bold text-foreground">{result.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{result.description}</p>
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Conseils personnalisés</p>
              {result.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-primary mt-0.5">✦</span>
                  {tip}
                </div>
              ))}
            </div>
            <Button onClick={reset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Refaire le quiz
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default FitnessQuiz;
