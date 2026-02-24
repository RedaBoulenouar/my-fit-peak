import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ChevronRight, RotateCcw, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface ExerciseEntry {
  name: string;
  before: { weight: number; reps: number };
  after: { weight: number; reps: number };
}

const exercisesList = ["Développé couché", "Squat", "Soulevé de terre", "Tractions", "Développé militaire"];

const ProgressionQuiz = () => {
  const [step, setStep] = useState(0); // 0=select exercises, 1..N=fill data, done=results
  const [selected, setSelected] = useState<string[]>([]);
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [beforeWeight, setBeforeWeight] = useState("");
  const [beforeReps, setBeforeReps] = useState("");
  const [afterWeight, setAfterWeight] = useState("");
  const [afterReps, setAfterReps] = useState("");
  const [showResult, setShowResult] = useState(false);

  const toggleExercise = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : prev.length < 4 ? [...prev, name] : prev
    );
  };

  const startQuiz = () => {
    if (selected.length < 2) return;
    setEntries(selected.map((name) => ({ name, before: { weight: 0, reps: 0 }, after: { weight: 0, reps: 0 } })));
    setCurrentIdx(0);
    setStep(1);
  };

  const nextExercise = () => {
    const updated = [...entries];
    updated[currentIdx] = {
      ...updated[currentIdx],
      before: { weight: parseFloat(beforeWeight) || 0, reps: parseInt(beforeReps) || 0 },
      after: { weight: parseFloat(afterWeight) || 0, reps: parseInt(afterReps) || 0 },
    };
    setEntries(updated);
    setBeforeWeight("");
    setBeforeReps("");
    setAfterWeight("");
    setAfterReps("");

    if (currentIdx < entries.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setStep(0);
    setSelected([]);
    setEntries([]);
    setCurrentIdx(0);
    setShowResult(false);
  };

  // Calculate progression
  const getProgression = (entry: ExerciseEntry) => {
    const volBefore = entry.before.weight * entry.before.reps;
    const volAfter = entry.after.weight * entry.after.reps;
    if (volBefore === 0) return volAfter > 0 ? 100 : 0;
    return ((volAfter - volBefore) / volBefore) * 100;
  };

  const avgProgression = entries.length > 0
    ? entries.reduce((sum, e) => sum + getProgression(e), 0) / entries.length
    : 0;

  const getVerdict = (avg: number) => {
    if (avg >= 15) return { label: "Progression explosive 🔥", color: "text-primary", desc: "Tu progresses à une vitesse impressionnante ! Continue comme ça." };
    if (avg >= 5) return { label: "Bonne progression 💪", color: "text-emerald-400", desc: "Tu avances bien. Reste constant et les résultats suivront." };
    if (avg >= 0) return { label: "Progression stable ⚡", color: "text-sky-400", desc: "Tu maintiens tes perfs. Essaie de varier tes entraînements pour relancer la progression." };
    return { label: "En baisse 📉", color: "text-orange-400", desc: "Tes perfs ont baissé. Vérifie ta récupération, ton sommeil et ton alimentation." };
  };

  const totalSteps = step === 0 ? 1 : entries.length + 1;
  const currentStep = step === 0 ? 0 : showResult ? totalSteps : currentIdx + 1;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="gradient-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-bold">Quiz : Calcule ta progression</h2>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        {step === 0 && !showResult && (
          <motion.div key="select" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-foreground font-heading font-semibold mb-4">Choisis 2 à 4 exercices à comparer :</p>
            <div className="grid gap-2 mb-4">
              {exercisesList.map((ex) => (
                <button
                  key={ex}
                  onClick={() => toggleExercise(ex)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm flex items-center justify-between ${
                    selected.includes(ex)
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {ex}
                  {selected.includes(ex) && <span className="text-primary text-xs font-bold">✓</span>}
                </button>
              ))}
            </div>
            <Button onClick={startQuiz} disabled={selected.length < 2} className="gradient-primary text-primary-foreground font-heading font-bold w-full">
              Commencer <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {step === 1 && !showResult && entries.length > 0 && (
          <motion.div key={`ex-${currentIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <p className="text-foreground font-heading font-semibold mb-1">
              {entries[currentIdx].name}
            </p>
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

        {showResult && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            {(() => {
              const verdict = getVerdict(avgProgression);
              return (
                <div className="text-center mb-5">
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

export default ProgressionQuiz;
