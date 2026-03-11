import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, ArrowRight, ArrowLeft, Zap, Target, Dumbbell, 
  Flame, Scale, Activity, CheckCircle2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UserProfile {
  age: string;
  sex: "homme" | "femme" | "";
  weight: string;
  height: string;
  goal: "masse" | "seche" | "maintien" | "";
  level: "debutant" | "intermediaire" | "avance" | "expert" | "";
}

interface CalorieResult {
  bmr: number;
  tdee: number;
  target: number;
  protein: number;
  carbs: number;
  fat: number;
  goalLabel: string;
}

const calculateCalories = (profile: UserProfile): CalorieResult => {
  const age = parseInt(profile.age);
  const weight = parseFloat(profile.weight);
  const height = parseFloat(profile.height);

  // Mifflin-St Jeor
  let bmr: number;
  if (profile.sex === "homme") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier based on level
  const multipliers: Record<string, number> = {
    debutant: 1.375,
    intermediaire: 1.55,
    avance: 1.725,
    expert: 1.9,
  };
  const tdee = Math.round(bmr * (multipliers[profile.level] || 1.55));

  let target: number;
  let goalLabel: string;
  if (profile.goal === "masse") {
    target = tdee + 400;
    goalLabel = "Prise de masse";
  } else if (profile.goal === "seche") {
    target = tdee - 400;
    goalLabel = "Sèche";
  } else {
    target = tdee;
    goalLabel = "Maintien";
  }

  // Macros
  const protein = Math.round(weight * (profile.goal === "seche" ? 2.2 : 1.8));
  const fat = Math.round((target * 0.25) / 9);
  const carbsCal = target - protein * 4 - fat * 9;
  const carbs = Math.round(Math.max(carbsCal, 0) / 4);

  return { bmr: Math.round(bmr), tdee, target, protein, carbs, fat, goalLabel };
};

const STEPS = ["Sexe", "Âge", "Mensurations", "Objectif", "Niveau"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    age: "",
    sex: "",
    weight: "",
    height: "",
    goal: "",
    level: "",
  });
  const [showResult, setShowResult] = useState(false);

  const totalSteps = STEPS.length;
  const progress = showResult ? 100 : ((step + 1) / (totalSteps + 1)) * 100;

  const canNext = (): boolean => {
    switch (step) {
      case 0: return profile.sex !== "";
      case 1: return profile.age !== "" && parseInt(profile.age) >= 14 && parseInt(profile.age) <= 99;
      case 2: return profile.weight !== "" && profile.height !== "" && parseFloat(profile.weight) > 30 && parseFloat(profile.height) > 100;
      case 3: return profile.goal !== "";
      case 4: return profile.level !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save profile
      const result = calculateCalories(profile);
      localStorage.setItem("mfp_profile", JSON.stringify(profile));
      localStorage.setItem("mfp_calories", JSON.stringify(result));
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const result = showResult ? calculateCalories(profile) : null;

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-heading font-semibold text-primary">Profil personnalisé</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold">
            Crée ton <span className="text-primary text-glow">profil</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {showResult ? "Voici ton plan personnalisé" : `Étape ${step + 1} sur ${totalSteps}`}
          </p>
        </motion.div>

        {/* Progress */}
        <Progress value={progress} className="h-2 mb-8" />

        {/* Steps */}
        <div className="gradient-card rounded-xl border border-border p-6 sm:p-8 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                {/* Step 0: Sexe */}
                {step === 0 && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Quel est ton sexe ?
                    </h2>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {[
                        { value: "homme" as const, label: "Homme", emoji: "♂️" },
                        { value: "femme" as const, label: "Femme", emoji: "♀️" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setProfile({ ...profile, sex: opt.value })}
                          className={`rounded-xl border-2 p-6 text-center transition-all duration-200 ${
                            profile.sex === opt.value
                              ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(82_85%_50%/0.15)]"
                              : "border-border bg-background hover:border-muted-foreground/30"
                          }`}
                        >
                          <span className="text-4xl block mb-3">{opt.emoji}</span>
                          <span className="font-heading font-bold text-foreground">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Âge */}
                {step === 1 && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" /> Quel âge as-tu ?
                    </h2>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Input
                          type="number"
                          min={14}
                          max={99}
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                          placeholder="25"
                          className="text-center text-4xl font-heading font-bold h-20 w-32 mx-auto border-2 focus:border-primary"
                        />
                        <p className="text-muted-foreground text-sm mt-3">ans</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Poids & Taille */}
                {step === 2 && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" /> Tes mensurations
                    </h2>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-6 w-full max-w-xs">
                        <div className="text-center">
                          <Input
                            type="number"
                            min={30}
                            max={250}
                            value={profile.weight}
                            onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                            placeholder="75"
                            className="text-center text-3xl font-heading font-bold h-16 border-2 focus:border-primary"
                          />
                          <p className="text-muted-foreground text-sm mt-2">kg</p>
                        </div>
                        <div className="text-center">
                          <Input
                            type="number"
                            min={100}
                            max={230}
                            value={profile.height}
                            onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                            placeholder="178"
                            className="text-center text-3xl font-heading font-bold h-16 border-2 focus:border-primary"
                          />
                          <p className="text-muted-foreground text-sm mt-2">cm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Objectif */}
                {step === 3 && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" /> Ton objectif ?
                    </h2>
                    <div className="grid gap-3 flex-1">
                      {[
                        { value: "masse" as const, label: "Prise de masse", desc: "Gagner du muscle avec un surplus calorique", icon: Dumbbell },
                        { value: "seche" as const, label: "Sèche", desc: "Perdre du gras en préservant le muscle", icon: Flame },
                        { value: "maintien" as const, label: "Maintien", desc: "Rester en forme, garder l'équilibre", icon: Scale },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setProfile({ ...profile, goal: opt.value })}
                          className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 flex items-center gap-4 ${
                            profile.goal === opt.value
                              ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(82_85%_50%/0.15)]"
                              : "border-border bg-background hover:border-muted-foreground/30"
                          }`}
                        >
                          <opt.icon className={`h-6 w-6 shrink-0 ${profile.goal === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                          <div>
                            <span className="font-heading font-bold text-foreground block">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Niveau */}
                {step === 4 && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" /> Ton niveau sportif ?
                    </h2>
                    <div className="grid gap-3 flex-1">
                      {[
                        { value: "debutant" as const, label: "Débutant", desc: "0-6 mois d'entraînement" },
                        { value: "intermediaire" as const, label: "Intermédiaire", desc: "6 mois - 2 ans" },
                        { value: "avance" as const, label: "Avancé", desc: "2-5 ans d'expérience" },
                        { value: "expert" as const, label: "Expert", desc: "5+ ans, entraînement sérieux" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setProfile({ ...profile, level: opt.value })}
                          className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                            profile.level === opt.value
                              ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(82_85%_50%/0.15)]"
                              : "border-border bg-background hover:border-muted-foreground/30"
                          }`}
                        >
                          <span className="font-heading font-bold text-foreground block">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-1"
              >
                {/* Result */}
                <div className="text-center mb-6">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">Ton profil est prêt !</h2>
                  <p className="text-sm text-muted-foreground mt-1">Objectif : {result.goalLabel}</p>
                </div>

                {/* Calorie Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-lg border border-border bg-background p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading mb-1">Métabolisme de base</p>
                    <p className="font-heading text-2xl font-bold text-foreground">{result.bmr}</p>
                    <p className="text-xs text-muted-foreground">kcal/jour</p>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                    <p className="text-xs text-primary uppercase tracking-wider font-heading mb-1">Objectif calorique</p>
                    <p className="font-heading text-2xl font-bold text-primary">{result.target}</p>
                    <p className="text-xs text-muted-foreground">kcal/jour</p>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { label: "Protéines", value: `${result.protein}g`, color: "text-primary" },
                    { label: "Glucides", value: `${result.carbs}g`, color: "text-sky-400" },
                    { label: "Lipides", value: `${result.fat}g`, color: "text-amber-400" },
                  ].map((macro) => (
                    <div key={macro.label} className="rounded-lg border border-border bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">{macro.label}</p>
                      <p className={`font-heading text-lg font-bold ${macro.color}`}>{macro.value}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => navigate("/workout")}
                  className="w-full gradient-primary text-primary-foreground font-heading font-bold text-lg py-6 animate-pulse-glow"
                >
                  Obtenir mon plan personnalisé <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Navigation */}
          {!showResult && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 0}
                className="text-muted-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Retour
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canNext()}
                className="gradient-primary text-primary-foreground font-heading font-bold"
              >
                {step === totalSteps - 1 ? "Voir mon profil" : "Suivant"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
