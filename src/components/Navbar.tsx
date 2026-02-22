import { Link, useLocation } from "react-router-dom";
import { Dumbbell, BarChart3, Calculator, Home } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/workout", label: "Entraînement", icon: Dumbbell },
  { to: "/progress", label: "Progression", icon: BarChart3 },
  { to: "/macros", label: "Macros", icon: Calculator },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-7 w-7 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">
            MyFit<span className="text-primary">Peak</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className="relative p-2">
                {isActive && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`relative z-10 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
