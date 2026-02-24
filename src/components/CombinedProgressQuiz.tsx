import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, ChevronRight, RotateCcw, Flame, Dumbbell, Wind, Scale,
  TrendingUp, ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// --- Phase 1: Questions objectif ---
const objectiveQuestions = [
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

// --- Phase 2: Exercises progression ---
const exercisesList = ["Développé couché", "Squat", "Soulevé de terre", "Tractions", "Développé militaire"];

interface ExerciseEntry {
  name: string;
  before: { weight: number; reps: number };
  after: { weight: number; reps: number };
}

// --- Result helpers ---
const getObjectiveResult = (answers: string[]) => {
  const goal = answers[0];
  const freq = answers[1];
  const cardio = answers[4];

  if (goal === "masse") return {
    title: "Prise de masse", icon: Dumbbell, color: "text-primary",
    description: "Concentre-toi sur un programme de prise de masse avec surplus calorique contrôlé.",
    tips: [
      "Vise un surplus de 300-500 kcal/jour",
      "Privilégie les exercices composés",
      freq === "sedentaire" || freq === "modere" ? "Augmente progressivement à 4 séances/semaine" : "Maintiens ta fréquence avec des jours de repos",
      "Consomme 1.6-2.2g de protéines par kg",
    ],
  };
  if (goal === "seche") return {
    title: "Sèche / Perte de gras", icon: Flame, color: "text-orange-400",
    description: "Perds du gras tout en préservant ta masse musculaire.",
    tips: [
      "Déficit calorique de 300-500 kcal/jour",
      "Garde tes charges lourdes pour préserver le muscle",
      "Ajoute 2-3 sessions de cardio modéré par semaine",
      "Protéines élevées : 2-2.5g par kg",
    ],
  };
  if (goal === "endurance") return {
    title: "Endurance & Cardio", icon: Wind, color: "text-sky-400",
    description: "Améliore tes capacités cardiovasculaires et ton endurance.",
    tips: [
      "Alterne entre HIIT et cardio basse intensité",
      "Augmente progressivement la durée",
      cardio === "nocardio" ? "Commence par 20 min de cardio 3x/semaine" : "Ajoute de la variété (natation, vélo, course)",
      "Hydratation et glucides sont tes alliés",
    ],
  };
  return {
    title: "Maintenance & Bien-être", icon: Scale, color: "text-emerald-400",
    description: "Reste en forme et en bonne santé, sans pression.",
    tips: [
      "Maintiens 3-4 séances variées par semaine",
      "Mange à tes calories de maintenance",
      "Alterne musculation et activités plaisir",
      "Écoute ton corps et priorise la récupération",
    ],
  };
};

const getProgression = (entry: ExerciseEntry) => {
  const volBefore = entry.before.weight * entry.before.reps;
  const volAfter = entry.after.weight * entry.after.reps;
  if (volBefore === 0) return volAfter > 0 ? 100 : 0;
  return ((volAfter - volBefore) / volBefore) * 100;
};

const getProgressionVerdict = (avg: number) => {
  if (avg >= 15) return { label: "Progression explosive 🔥", color: "text-primary", desc: "Tu progresses à une vitesse impressionnante !" };
  if (avg >= 5) return { label: "Bonne progression 💪", color: "text-emerald-400", desc: "Tu avances bien. Reste constant." };
  if (avg >= 0) return { label: "Progression stable ⚡", color: "text-sky-400", desc: "Tu maintiens tes perfs. Varie tes entraînements." };
  return { label: "En baisse 📉", color: "text-orange-400", desc: "Vérifie ta récupération, sommeil et alimentation." };
};

// --- Phases: objectives (0-4), selectExercises (5), exerciseData (6..N), results (done) ---
type Phase = "objectives" | "selectExercises" | "exerciseData" | "results";

const CombinedProgressQuiz = () => {
  const [phase, setPhase] = useState<Phase>("objectives");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [beforeWeight, setBeforeWeight] = useState("");
  const [beforeReps, setBeforeReps] = useState("");
  const [afterWeight, setAfterWeight] = useState("");
  const [afterReps, setAfterReps] = useState("");

  const totalSteps = objectiveQuestions.length + 1 + (entries.length || selectedExercises.length || 2);
  const currentStep =
    phase === "objectives" ? currentQ :
    phase === "selectExercises" ? objectiveQuestions.length :
    phase === "exerciseData" ? objectiveQuestions.length + 1 + currentIdx :
    totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentQ < objectiveQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("selectExercises");
    }
  };

  const toggleExercise = (name: string) => {
    setSelectedExercises((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : prev.length < 4 ? [...prev, name] : prev
    );
  };

  const startExerciseData = () => {
    if (selectedExercises.length < 2) return;
    setEntries(selectedExercises.map((name) => ({ name, before: { weight: 0, reps: 0 }, after: { weight: 0, reps: 0 } })));
    setCurrentIdx(0);
    setPhase("exerciseData");
  };

  const nextExercise = () => {
    const updated = [...entries];
    updated[currentIdx] = {
      ...updated[currentIdx],
      before: { weight: parseFloat(beforeWeight) || 0, reps: parseInt(beforeReps) || 0 },
      after: { weight: parseFloat(afterWeight) || 0, reps: parseInt(afterReps) || 0 },
    };
    setEntries(updated);
    setBeforeWeight(""); setBeforeReps(""); setAfterWeight(""); setAfterReps("");

    if (currentIdx < entries.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase("results");
    }
  };

  const reset = () => {
    setPhase("objectives");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedExercises([]);
    setEntries([]);
    setCurrentIdx(0);
  };

  const avgProgression = entries.length > 0
    ? entries.reduce((sum, e) => sum + getProgression(e), 0) / entries.length
    : 0;

  return (
    <div className="gradient-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-bold">Quiz complet : Objectif & Progression</h2>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        {/* Phase 1: Objective questions */}
        {phase === "objectives" && (
          <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-foreground font-heading font-semibold mb-4">
              {currentQ + 1}. {objectiveQuestions[currentQ].question}
            </p>
            <div className="grid gap-3">
              {objectiveQuestions[currentQ].options.map((opt) => (
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
        )}

        {/* Phase 2: Select exercises */}
        {phase === "selectExercises" && (
          <motion.div key="select" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-foreground font-heading font-semibold mb-4">Choisis 2 à 4 exercices à comparer :</p>
            <div className="grid gap-2 mb-4">
              {exercisesList.map((ex) => (
                <button
                  key={ex}
                  onClick={() => toggleExercise(ex)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm flex items-center justify-between ${
                    selectedExercises.includes(ex)
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {ex}
                  {selectedExercises.includes(ex) && <span className="text-primary text-xs font-bold">✓</span>}
                </button>
              ))}
            </div>
            <Button onClick={startExerciseData} disabled={selectedExercises.length < 2} className="gradient-primary text-primary-foreground font-heading font-bold w-full">
              Continuer <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Phase 3: Exercise data entry */}
        {phase === "exerciseData" && entries.length > 0 && (
          <motion.div key={`ex-${currentIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-foreground font-heading font-semibold mb-1">{entries[currentIdx].name}</p>
            <p className="text-xs text-muted-foreground mb-4">Exercice {currentIdx + 1}/{entries.length}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-2">Avant (il y a 1 mois)</p>
                <Input placeholder="Poids (kg)" type="number" value={beforeWeight} onChange={(e) => setBeforeWeight(e.target.value)} className="bg-background border-border mb-2" />
                <Input placeholder="Reps" type="number" value={beforeReps} onChange={(e) => setBeforeReps(e.target.value)} className="bg-background border-border" />
              </div>
              <div>
                <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-2">Maintenant</p>
                <Input placeholder="Poids (kg)" type="number" value={afterWeight} onChange={(e) => setAfterWeight(e.target.value)} className="bg-background border-border mb-2" />
                <Input placeholder="Reps" type="number" value={afterReps} onChange={(e) => setAfterReps(e.target.value)} className="bg-background border-border" />
              </div>
            </div>

            <Button onClick={nextExercise} className="gradient-primary text-primary-foreground font-heading font-bold w-full">
              {currentIdx < entries.length - 1 ? "Suivant" : "Voir les résultats"} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Phase 4: Combined results */}
        {phase === "results" && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            {/* Objective result */}
            {(() => {
              const obj = getObjectiveResult(answers);
              return (
                <div className="text-center mb-6">
                  <obj.icon className={`h-10 w-10 ${obj.color} mx-auto mb-3`} />
                  <h3 className="font-heading text-2xl font-bold text-foreground">{obj.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{obj.description}</p>
                  <div className="mt-4 space-y-2 text-left">
                    <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Conseils personnalisés</p>
                    {obj.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="text-primary mt-0.5">✦</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Separator */}
            <div className="border-t border-border my-6" />

            {/* Progression result */}
            {(() => {
              const verdict = getProgressionVerdict(avgProgression);
              return (
                <div className="text-center mb-5">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className={`font-heading text-4xl font-bold ${verdict.color} mb-1`}>
                    {avgProgression >= 0 ? "+" : ""}{avgProgression.toFixed(1)}%
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{verdict.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{verdict.desc}</p>
                </div>
              );
            })()}

            <div className="space-y-2 mb-6">
              <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Détail par exercice</p>
              {entries.map((entry, i) => {
                const prog = getProgression(entry);
                const Icon = prog > 0 ? ArrowUpRight : prog < 0 ? ArrowDownRight : Minus;
                const color = prog > 0 ? "text-primary" : prog < 0 ? "text-orange-400" : "text-muted-foreground";
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                    <div>
                      <span className="font-heading font-bold text-foreground text-sm">{entry.name}</span>
                      <span className="ml-3 text-xs text-muted-foreground">
                        {entry.before.weight}kg×{entry.before.reps} → {entry.after.weight}kg×{entry.after.reps}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 font-heading font-bold text-sm ${color}`}>
                      <Icon className="h-4 w-4" />
                      {prog >= 0 ? "+" : ""}{prog.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={reset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Refaire le quiz
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CombinedProgressQuiz;
