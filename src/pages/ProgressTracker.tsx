import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import FitnessQuiz from "@/components/FitnessQuiz";
import ProgressionQuiz from "@/components/ProgressionQuiz";

const ProgressTracker = () => {
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

        {/* Quiz objectif */}
        <div className="mb-10">
          <FitnessQuiz />
        </div>

        {/* Quiz progression */}
        <div className="mb-10">
          <ProgressionQuiz />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
