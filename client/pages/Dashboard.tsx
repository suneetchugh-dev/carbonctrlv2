import AppLayout from "@/components/layout/AppLayout";
import { motion } from "framer-motion";

export default function Dashboard() {
  const cards = [
    {
      title: "EcoCoin Balance",
      body: <p className="text-5xl font-orbitron">0</p>,
    },
    {
      title: "Daily Mission",
      body: (
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 w-1/5" />
          </div>
          <p className="text-white/70 text-sm">Complete 5 quizzes</p>
        </div>
      ),
    },
    {
      title: "Recent Activity",
      body: <p className="text-white/60 text-sm">No activity yet</p>,
    },
    {
      title: "Mini Leaderboard",
      body: (
        <ul className="text-sm text-white/80 space-y-1">
          <li>1. You — 0</li>
          <li>2. Student B — 0</li>
          <li>3. Student C — 0</li>
        </ul>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-6">
        <h1 className="font-orbitron text-3xl mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-white/90 mb-2">{c.title}</h3>
              {c.body}
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
