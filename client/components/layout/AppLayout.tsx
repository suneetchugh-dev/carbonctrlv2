import { ReactNode, useState } from "react";
import { Globe, School } from "@/components/globe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
  showGlobe = true,
}: {
  children: ReactNode;
  showGlobe?: boolean;
}) {
  const [selected, setSelected] = useState<School | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen text-white font-sans antialiased">
      {showGlobe && (
        <div className="fixed inset-0 -z-10">
          <Globe onSelectSchool={(s) => setSelected(s)} />
        </div>
      )}

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4",
          "backdrop-blur-xl bg-white/5 border-b border-white/10",
          "shadow-[0_0_30px_rgba(255,255,255,0.15)]",
        )}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
          <span className="font-orbitron tracking-widest text-sm">
            CARBONCTRL
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              Dashboard
            </Button>
          </Link>
          <Link to="/quizzes">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              Quizzes
            </Button>
          </Link>
          <Link to="/missions">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              Missions
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              Leaderboard
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.5)]">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      <main className={cn("relative z-10", isHome ? "pt-28" : "pt-24")}>
        {children}
      </main>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="text-white/80 space-y-2">
            <p>{selected?.details}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
