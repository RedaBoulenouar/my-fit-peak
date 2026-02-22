import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Goal = "perte" | "maintien" | "prise";

const MacroCalculator = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState<"homme" | "femme">("homme");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<Goal>("maintien");
  const [result, setResult] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);

  const calculate = () => {
    const a = parseInt(age), w = parseFloat(weight), h = parseFloat(height);
    if (!a || !w || !h) return;

    // Mifflin-St Jeor
    let bmr = gender === "homme"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    let tdee = bmr * activity;

    const goalMultipliers: Record<Goal, number> = { perte: 0.8, maintien: 1, prise: 1.15 };
    const calories = Math.round(tdee * goalMultipliers[goal]);

    const protein = Math.round(w * (goal === "prise" ? 2.2 : 2));
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    setResult({ calories, protein, carbs, fat });
  };

  const activityLevels = [
    { value: 1.2, label: "Sédentaire" },
    { value: 1.375, label: "Léger (1-3j)" },
    { value: 1.55, label: "Modéré (3-5j)" },
    { value: 1.725, label: "Actif (6-7j)" },
    { value: 1.9, label: "Très actif" },
  ];

  const goals: { value: Goal; label: string }[] = [
    { value: "perte", label: "Perte de poids" },
    { value: "maintien", label: "Maintien" },
    { value: "prise", label: "Prise de masse" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">Calculateur de macros</h1>
          </div>
          <p className="text-muted-foreground mb-10">Calcule tes besoins nutritionnels quotidiens.</p>
        </motion.div>

        <div className="gradient-card rounded-xl border border-border p-6 sm:p-8 mb-8">
          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Sexe</label>
            <div className="grid grid-cols-2 gap-3">
              {(["homme", "femme"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-all ${
                    gender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Âge</label>
              <Input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} className="bg-background border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Poids (kg)</label>
              <Input type="number" placeholder="75" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-background border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Taille (cm)</label>
              <Input type="number" placeholder="178" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-background border-border" />
            </div>
          </div>

          {/* Activity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Niveau d'activité</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {activityLevels.map((al) => (
                <button
                  key={al.value}
                  onClick={() => setActivity(al.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    activity === al.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {al.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Objectif</label>
            <div className="grid grid-cols-3 gap-3">
              {goals.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                    goal === g.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={calculate} size="lg" className="w-full gradient-primary text-primary-foreground font-heading font-bold">
            <Calculator className="mr-2 h-5 w-5" /> Calculer mes macros
          </Button>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: Flame, label: "Calories", value: `${result.calories}`, unit: "kcal", color: "text-primary" },
              { icon: Beef, label: "Protéines", value: `${result.protein}`, unit: "g", color: "text-red-400" },
              { icon: Wheat, label: "Glucides", value: `${result.carbs}`, unit: "g", color: "text-amber-400" },
              { icon: Droplets, label: "Lipides", value: `${result.fat}`, unit: "g", color: "text-blue-400" },
            ].map((macro) => (
              <div key={macro.label} className="gradient-card rounded-xl border border-border p-5 text-center">
                <macro.icon className={`h-6 w-6 mx-auto mb-2 ${macro.color}`} />
                <div className="font-heading text-3xl font-bold text-foreground">{macro.value}</div>
                <div className="text-xs text-muted-foreground">{macro.unit}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{macro.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MacroCalculator;
