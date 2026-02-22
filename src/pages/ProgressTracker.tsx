import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Plus, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WorkoutLog {
  id: number;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  sets: number;
}

const initialLogs: WorkoutLog[] = [
  { id: 1, date: "2026-02-17", exercise: "Développé couché", weight: 80, reps: 8, sets: 4 },
  { id: 2, date: "2026-02-18", exercise: "Squat", weight: 100, reps: 10, sets: 4 },
  { id: 3, date: "2026-02-19", exercise: "Tractions", weight: 0, reps: 10, sets: 3 },
  { id: 4, date: "2026-02-20", exercise: "Développé couché", weight: 82.5, reps: 8, sets: 4 },
  { id: 5, date: "2026-02-21", exercise: "Squat", weight: 105, reps: 8, sets: 4 },
];

const ProgressTracker = () => {
  const [logs, setLogs] = useState<WorkoutLog[]>(initialLogs);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");

  const addLog = () => {
    if (!exercise || !reps || !sets) return;
    const newLog: WorkoutLog = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      exercise,
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps),
      sets: parseInt(sets),
    };
    setLogs([...logs, newLog]);
    setExercise(""); setWeight(""); setReps(""); setSets("");
  };

  // Chart data: volume per day
  const chartData = logs.reduce<{ date: string; volume: number }[]>((acc, log) => {
    const existing = acc.find((d) => d.date === log.date);
    const vol = log.weight * log.reps * log.sets;
    if (existing) {
      existing.volume += vol;
    } else {
      acc.push({ date: log.date, volume: vol });
    }
    return acc;
  }, []).slice(-7);

  const totalVolume = logs.reduce((s, l) => s + l.weight * l.reps * l.sets, 0);
  const maxWeight = Math.max(...logs.map((l) => l.weight));

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">Tracker de progression</h1>
          </div>
          <p className="text-muted-foreground mb-10">Suis ton évolution et bats tes records.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: TrendingUp, label: "Volume total", value: `${(totalVolume / 1000).toFixed(1)}t` },
            { icon: Trophy, label: "Charge max", value: `${maxWeight}kg` },
            { icon: BarChart3, label: "Séances", value: `${new Set(logs.map(l => l.date)).size}` },
          ].map((stat) => (
            <div key={stat.label} className="gradient-card rounded-xl border border-border p-5 text-center">
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-heading text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="gradient-card rounded-xl border border-border p-6 mb-10">
          <h2 className="font-heading text-lg font-bold mb-4">Volume d'entraînement</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 18%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "hsl(220 10% 55%)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 15% 18%)", borderRadius: "8px", color: "hsl(0 0% 95%)" }}
                  labelStyle={{ color: "hsl(82 85% 50%)" }}
                />
                <Bar dataKey="volume" fill="hsl(82, 85%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add entry */}
        <div className="gradient-card rounded-xl border border-border p-6 mb-8">
          <h2 className="font-heading text-lg font-bold mb-4">Ajouter une séance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Input placeholder="Exercice" value={exercise} onChange={(e) => setExercise(e.target.value)} className="bg-background border-border" />
            <Input placeholder="Poids (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-background border-border" />
            <Input placeholder="Reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} className="bg-background border-border" />
            <Input placeholder="Séries" type="number" value={sets} onChange={(e) => setSets(e.target.value)} className="bg-background border-border" />
          </div>
          <Button onClick={addLog} className="gradient-primary text-primary-foreground font-heading font-bold">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </div>

        {/* Recent logs */}
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-bold mb-3">Historique récent</h2>
          {[...logs].reverse().slice(0, 8).map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-3">
              <div>
                <span className="font-heading font-bold text-foreground">{log.exercise}</span>
                <span className="ml-3 text-sm text-muted-foreground">{log.date}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {log.weight}kg × {log.reps} × {log.sets}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
