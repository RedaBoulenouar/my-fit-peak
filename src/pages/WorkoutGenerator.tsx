import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, RefreshCw, Clock, Flame, ChevronDown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const objectives = [
  { label: "Prise de masse", value: "masse", desc: "Charges lourdes, repos longs" },
  { label: "Perte de poids", value: "perte", desc: "Circuits, intensité haute" },
  { label: "Endurance", value: "endurance", desc: "Reps élevées, peu de repos" },
  { label: "Force", value: "force", desc: "Charges max, séries courtes" },
];

const muscleGroups = [
  "Pectoraux", "Dos", "Épaules", "Biceps", "Triceps", "Jambes", "Abdominaux", "Full Body"
];

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

const exerciseDB: Record<string, Exercise[]> = {
  Pectoraux: [
    { name: "Développé couché", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Développé incliné haltères", sets: 3, reps: "10-12", rest: "75s" },
    { name: "Écarté poulie vis-à-vis", sets: 3, reps: "12-15", rest: "60s" },
    { name: "Pompes", sets: 3, reps: "Max", rest: "60s" },
  ],
  Dos: [
    { name: "Tractions", sets: 4, reps: "6-10", rest: "90s" },
    { name: "Rowing barre", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Tirage vertical", sets: 3, reps: "10-12", rest: "75s" },
    { name: "Rowing haltère unilatéral", sets: 3, reps: "10-12", rest: "60s" },
  ],
  Épaules: [
    { name: "Développé militaire", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Élévations latérales", sets: 4, reps: "12-15", rest: "60s" },
    { name: "Oiseau haltères", sets: 3, reps: "12-15", rest: "60s" },
    { name: "Face pull", sets: 3, reps: "15", rest: "45s" },
  ],
  Biceps: [
    { name: "Curl barre EZ", sets: 4, reps: "10-12", rest: "60s" },
    { name: "Curl haltères alternés", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Curl marteau", sets: 3, reps: "12", rest: "45s" },
    { name: "Curl concentré", sets: 3, reps: "12-15", rest: "45s" },
  ],
  Triceps: [
    { name: "Dips", sets: 4, reps: "8-12", rest: "75s" },
    { name: "Extension poulie haute", sets: 3, reps: "12-15", rest: "60s" },
    { name: "Barre au front", sets: 3, reps: "10-12", rest: "60s" },
    { name: "Kickback haltère", sets: 3, reps: "12-15", rest: "45s" },
  ],
  Jambes: [
    { name: "Squat barre", sets: 4, reps: "8-10", rest: "120s" },
    { name: "Presse à cuisses", sets: 4, reps: "10-12", rest: "90s" },
    { name: "Fentes marchées", sets: 3, reps: "12/jambe", rest: "75s" },
    { name: "Leg curl", sets: 3, reps: "12-15", rest: "60s" },
    { name: "Mollets debout", sets: 4, reps: "15-20", rest: "45s" },
  ],
  Abdominaux: [
    { name: "Crunch câble", sets: 4, reps: "15-20", rest: "45s" },
    { name: "Relevé de jambes suspendu", sets: 3, reps: "12-15", rest: "45s" },
    { name: "Planche", sets: 3, reps: "45-60s", rest: "30s" },
    { name: "Russian twist", sets: 3, reps: "20", rest: "30s" },
  ],
  "Full Body": [
    { name: "Squat barre", sets: 4, reps: "8-10", rest: "120s" },
    { name: "Développé couché", sets: 4, reps: "8-10", rest: "90s" },
    { name: "Rowing barre", sets: 3, reps: "10-12", rest: "90s" },
    { name: "Développé militaire", sets: 3, reps: "10-12", rest: "75s" },
    { name: "Curl barre", sets: 3, reps: "12", rest: "60s" },
    { name: "Dips", sets: 3, reps: "Max", rest: "60s" },
  ],
};

const adaptToObjective = (exercises: Exercise[], objective: string): Exercise[] => {
  return exercises.map((ex) => {
    switch (objective) {
      case "masse":
        return { ...ex, sets: ex.sets + 1, reps: "6-8", rest: "120s" };
      case "perte":
        return { ...ex, sets: 4, reps: "15-20", rest: "30s" };
      case "endurance":
        return { ...ex, sets: 3, reps: "20-25", rest: "20s" };
      case "force":
        return { ...ex, sets: 5, reps: "3-5", rest: "180s" };
      default:
        return ex;
    }
  });
};

const WorkoutGenerator = () => {
  const [objective, setObjective] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [workout, setWorkout] = useState<Exercise[] | null>(null);

  const generate = () => {
    if (!selected || !objective) return;
    const base = exerciseDB[selected];
    const adapted = adaptToObjective(base, objective);
    const shuffled = [...adapted].sort(() => Math.random() - 0.5);
    setWorkout(shuffled);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">Générateur d'entraînement</h1>
          </div>
          <p className="text-muted-foreground mb-10">Choisis ton objectif, ton muscle et génère ton programme.</p>
        </motion.div>

        {/* Objective selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            <p className="font-heading font-bold text-sm text-foreground">Ton objectif</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {objectives.map((obj) => (
              <button
                key={obj.value}
                onClick={() => { setObjective(obj.value); setWorkout(null); }}
                className={`rounded-lg border px-4 py-3 text-left transition-all ${
                  objective === obj.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className={`text-sm font-bold font-heading block ${objective === obj.value ? "text-primary" : "text-foreground"}`}>
                  {obj.label}
                </span>
                <span className="text-xs text-muted-foreground">{obj.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Muscle group selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="h-4 w-4 text-primary" />
            <p className="font-heading font-bold text-sm text-foreground">Groupe musculaire</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {muscleGroups.map((group) => (
              <button
                key={group}
                onClick={() => { setSelected(group); setWorkout(null); }}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                  selected === group
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={!selected || !objective}
          size="lg"
          className="w-full gradient-primary text-primary-foreground font-heading font-bold mb-10"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Générer le programme
        </Button>

        {/* Workout display */}
        <AnimatePresence mode="wait">
          {workout && (
            <motion.div
              key={`${objective}-${selected}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h2 className="font-heading text-xl font-bold text-primary mb-4">
                Programme {selected} — {objectives.find((o) => o.value === objective)?.label}
              </h2>
              {workout.map((ex, i) => (
                <motion.div
                  key={ex.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="gradient-card rounded-xl border border-border p-5 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{ex.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-primary" />
                        {ex.sets} × {ex.reps}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        Repos: {ex.rest}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkoutGenerator;
