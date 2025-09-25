import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <AppLayout>
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-orbitron leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]"
            >
              CarbonCtrl
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-white/80 text-lg max-w-xl"
            >
              Gamified environmental education. Learn, play, and earn EcoCoins while exploring a living 3D Earth.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex gap-3"
            >
              <Link to="/login"><Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.5)]">Login</Button></Link>
              <Link to="/register"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10">Register</Button></Link>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {[
                { label: "Quizzes", href: "/quizzes" },
                { label: "Games", href: "/games" },
                { label: "Missions", href: "/missions" },
                { label: "Leaderboard", href: "/leaderboard" },
              ].map((c) => (
                <Link key={c.label} to={c.href}>
                  <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-4 text-center text-sm">
                    <span className="text-white/90">{c.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-6">
            <h3 className="text-white/90 mb-2">EcoCoin Balance</h3>
            <p className="text-4xl font-orbitron">0</p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-6">
            <h3 className="text-white/90 mb-2">Daily Mission</h3>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 w-1/5" />
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-6">
            <h3 className="text-white/90 mb-2">Recent Activity</h3>
            <p className="text-white/60 text-sm">No activity yet</p>
          </motion.div>
          <motion.div whileHover={{ y: -6 }} className="glass rounded-2xl p-6">
            <h3 className="text-white/90 mb-2">Mini Leaderboard</h3>
            <ul className="text-sm text-white/80 space-y-1">
              <li>1. You — 0</li>
              <li>2. Student B — 0</li>
              <li>3. Student C — 0</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </AppLayout>
  );
}
