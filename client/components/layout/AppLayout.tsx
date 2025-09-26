import { ReactNode, useEffect, useState } from "react";
import { Globe, School } from "@/components/globe";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Chatbot } from "@/components/chatbot";

export default function AppLayout({
  children,
  showGlobe = true,
  showNavbar = true,
  noScroll = false,
  activeNav,
  onNavSelect,
  showChatbot = true,
}: {
  children: ReactNode;
  showGlobe?: boolean;
  showNavbar?: boolean;
  noScroll?: boolean;
  activeNav?: "dashboard" | "quizzes" | "missions" | "leaderboard";
  onNavSelect?: (nav: "dashboard" | "quizzes" | "missions" | "leaderboard") => void;
  showChatbot?: boolean;
}) {
  const [selected, setSelected] = useState<School | null>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (noScroll) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
      };
    }
  }, [noScroll]);

  return (
    <div className={cn("min-h-screen text-white font-sans antialiased", noScroll && "overflow-hidden") }>
      {showGlobe && (
        <div className="fixed inset-0 z-0 pointer-events-auto">
          <Globe onSelectSchool={(s) => setSelected(s)} showMarkers={false} />
        </div>
      )}

      {showNavbar && (
        <nav
          className={cn(
            "fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4",
            "bg-transparent border-b border-white/10",
            "shadow-[0_0_30px_rgba(255,255,255,0.15)]",
          )}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-sm bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
            <span className="font-orbitron tracking-widest text-lg text-white">
              CarbonCtrl
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {onNavSelect ? (
              <>
                {(["dashboard","quizzes","missions","leaderboard"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => onNavSelect(k)}
                    className={cn(
                      "px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10",
                      activeNav === k && "bg-white/15 text-white"
                    )}
                  >
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </>
            ) : (
              <>
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
              </>
            )}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-white/40">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL ?? undefined} alt={currentUser.displayName ?? currentUser.email ?? "User"} />
                    <AvatarFallback className="bg-white text-black text-xs">
                      {(currentUser.displayName || currentUser.email || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white border-white/20">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut(auth)}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                Login
              </Button>
            </Link>
          )}
          </div>
        </nav>
      )}

      <main className={cn(
        "relative z-10",
        showNavbar ? (isHome ? "pt-28" : "pt-24") : "pt-0",
        noScroll && "overflow-hidden"
      )}> 
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

      {/* Chatbot */}
      {showChatbot && (
        <Chatbot 
          isOpen={isChatbotOpen} 
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
        />
      )}
    </div>
  );
}
