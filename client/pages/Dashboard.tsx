import AppLayout from "@/components/layout/AppLayout";
import { Globe } from "@/components/globe";
import type { MissionCity } from "@/components/globe/Globe";
import { GameModal } from "@/components/game";
import { QuizModal } from "@/components/quiz";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "EcoCoin Balance",
      body: <p className="text-5xl font-orbitron">2,847</p>,
    },
    {
      title: "Daily Mission",
      body: (
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 w-3/5" />
          </div>
          <p className="text-white/70 text-sm">Complete 5 quizzes (3/5 done)</p>
        </div>
      ),
    },
    {
      title: "Recent Activity",
      body: (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Completed "Climate Basics" quiz</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Earned 150 EcoCoins</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Started "Solar Revolution" mission</span>
          </div>
        </div>
      ),
    },
    {
      title: "Mini Leaderboard",
      body: (
        <ul className="text-sm text-white/80 space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-amber-400">🥇</span>
            <span>You — 2,847</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-300">🥈</span>
            <span>Alex Chen — 2,156</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-400">🥉</span>
            <span>Maya Patel — 1,892</span>
          </li>
        </ul>
      ),
    },
  ];

  const [active, setActive] = useState<"dashboard" | "quizzes" | "missions" | "leaderboard">("dashboard");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [selectedMission, setSelectedMission] = useState<MissionCity | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [currentGameMission, setCurrentGameMission] = useState<MissionCity | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{id: string, title: string, difficulty: string, est: string} | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(["q1", "q2"]);
  const [totalScore, setTotalScore] = useState(285);
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  const handleStartGame = (mission: MissionCity) => {
    if (mission.isUnlocked) {
      setCurrentGameMission(mission);
      setIsGameModalOpen(true);
    }
  };

  const handleGameComplete = (missionId: string) => {
    // Update mission completion status
    // In a real app, this would update the backend
    console.log(`Mission ${missionId} completed!`);
    // For now, just close the modal
    setIsGameModalOpen(false);
    setCurrentGameMission(null);
  };

  const handleCloseGame = () => {
    setIsGameModalOpen(false);
    setCurrentGameMission(null);
  };

  const handleStartQuiz = (quiz: {id: string, title: string, difficulty: string, est: string}) => {
    setCurrentQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const handleQuizComplete = (quizId: string, score: number) => {
    setCompletedQuizzes(prev => [...prev, quizId]);
    setTotalScore(prev => prev + score);
    console.log(`Quiz ${quizId} completed with score ${score}!`);
  };

  const handleCloseQuiz = () => {
    setIsQuizModalOpen(false);
    setCurrentQuiz(null);
  };

  const quizzes = [
    { id: "q1", title: "Climate Basics", difficulty: "Easy", est: "5 min" },
    { id: "q2", title: "Carbon Footprint 101", difficulty: "Easy", est: "6 min" },
    { id: "q3", title: "Renewable Energy", difficulty: "Medium", est: "7 min" },
    { id: "q4", title: "Sustainable Cities", difficulty: "Medium", est: "8 min" },
    { id: "q5", title: "Advanced Climate Policy", difficulty: "Hard", est: "10 min" },
  ];

  return (
    <AppLayout showGlobe={false} noScroll activeNav={active} onNavSelect={setActive}>
      <div className="w-full h-[calc(100vh-6rem)] max-w-[1800px] mx-auto px-6 lg:px-14 flex flex-col">
        <h1 className="font-orbitron text-3xl mb-2 shrink-0">
          {active === "dashboard" ? "Dashboard" : 
           active === "quizzes" ? "Quizzes" :
           active === "missions" ? "Missions" :
           active === "leaderboard" ? "Leaderboard" : "Dashboard"}
        </h1>
        <div className="h-full grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
          {/* Left Sidebar */}
          <aside className="order-2 lg:order-1 h-full">
            <div 
              ref={leftSidebarRef}
              className="rounded-2xl p-0 h-full border border-white/20 relative overflow-hidden group"
              onMouseMove={(e) => handleMouseMove(e, leftSidebarRef)}
            >
              <div className="absolute inset-0 bg-grid-bw" style={{ opacity: 0.3, backgroundSize: "16px 16px" }} />
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ 
                  background: `radial-gradient(60% 40% at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.28), rgba(0,0,0,0) 35%)` 
                }} 
              />
              <div className="relative z-10 p-6 space-y-6 h-full">
              {active === "dashboard" && (
                <>
                  <div>
                    <h3 className="text-white/90 mb-2">{cards[0].title}</h3>
                    {cards[0].body}
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <h3 className="text-white/90 mb-2">{cards[2].title}</h3>
                    {cards[2].body}
                  </div>
                </>
              )}
              {active === "quizzes" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white/90 mb-2">Your Progress</h3>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-300"
                        style={{ width: `${(completedQuizzes.length / quizzes.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-1">{completedQuizzes.length} of {quizzes.length} quizzes completed</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <h3 className="text-white/90 mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Basics","Energy","Transport","Food","Policy"].map((c) => (
                        <span key={c} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/80">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {active === "missions" && (
                <div className="space-y-4">
                  {selectedMission ? (
                    <>
                      <div>
                        <h3 className="text-white/90 mb-3">Mission Summary</h3>
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg bg-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full ${selectedMission.isUnlocked ? 'bg-amber-500' : 'bg-gray-500'}`}></div>
                              <h4 className="text-white/90 font-semibold">{selectedMission.missionTitle}</h4>
                            </div>
                            <p className="text-white/70 text-sm mb-3">{selectedMission.missionDescription}</p>
                            
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="text-center p-2 rounded bg-white/5">
                                <div className="text-white/60 text-xs">Difficulty</div>
                                <div className="text-white/90 text-sm font-medium">{selectedMission.difficulty}</div>
                              </div>
                              <div className="text-center p-2 rounded bg-white/5">
                                <div className="text-white/60 text-xs">Time</div>
                                <div className="text-white/90 text-sm font-medium">{selectedMission.estimatedTime}</div>
                              </div>
                            </div>
                            
                                <Button 
                                  className="w-full bg-white text-black hover:bg-white/90"
                                  disabled={!selectedMission.isUnlocked}
                                  onClick={() => handleStartGame(selectedMission)}
                                >
                                  {selectedMission.isUnlocked ? "Start Mission" : "Complete Previous Missions"}
                                </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white/90 mb-3">Mission Summary</h3>
                        <div className="text-center p-6 rounded-lg bg-white/5">
                          <div className="text-white/60 text-sm">Click on a mission city to view details</div>
                          <div className="text-white/40 text-xs mt-2">Start with Delhi to begin your journey</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {active === "leaderboard" && (
                <div className="text-white/80">Leaderboard filters here</div>
              )}
              </div>
            </div>
          </aside>

          {/* Center: interactive globe (largest section) */}
          <section className="order-1 lg:order-2 h-full">
            <div className="w-full h-full">
              <Globe 
                showMarkers={false} 
                showMissions={true}
                onSelectMission={(city) => {
                  setSelectedMission(city);
                  setActive("missions");
                }}
              />
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="order-3 h-full">
            <div 
              ref={rightSidebarRef}
              className="rounded-2xl p-0 h-full border border-white/20 relative overflow-hidden group"
              onMouseMove={(e) => handleMouseMove(e, rightSidebarRef)}
            >
              <div className="absolute inset-0 bg-grid-bw" style={{ opacity: 0.3, backgroundSize: "16px 16px" }} />
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{ 
                  background: `radial-gradient(60% 40% at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.28), rgba(0,0,0,0) 35%)` 
                }} 
              />
              <div className="relative z-10 p-6 space-y-6 h-full">
              {active === "dashboard" && (
                <>
                  <div>
                    <h3 className="text-white/90 mb-2">{cards[1].title}</h3>
                    {cards[1].body}
                  </div>
                  <div className="h-px bg-white/10" />
                  <div>
                    <h3 className="text-white/90 mb-2">{cards[3].title}</h3>
                    {cards[3].body}
                  </div>
                </>
              )}
              {active === "quizzes" && (
                <div className="space-y-4">
                  <h3 className="text-white/90">Available Quizzes</h3>
                  <div className="space-y-3">
                    {quizzes.map((q) => {
                      const isCompleted = completedQuizzes.includes(q.id);
                      return (
                        <div key={q.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white/90 truncate">{q.title}</p>
                              {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                            <p className="text-white/60 text-xs">{q.difficulty} • {q.est}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartQuiz(q)}
                            className={isCompleted ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30" : "bg-white text-black hover:bg-white/90"}
                          >
                            {isCompleted ? "Retake" : "Start"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {active === "missions" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white/90 mb-3">Mission Roadmap</h3>
                    <div className="space-y-2">
                      {/* Delhi - Always unlocked first */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/10 cursor-pointer hover:bg-white/15 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "delhi",
                          name: "Delhi",
                          country: "India",
                          lat: 28.6139,
                          lon: 77.2090,
                          missionTitle: "Solar Revolution",
                          missionDescription: "Build India's renewable energy future by placing solar panels strategically",
                          difficulty: "Easy",
                          estimatedTime: "5 min",
                          isUnlocked: true,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <div className="text-white/90 text-sm font-medium">Delhi, India</div>
                          <div className="text-white/60 text-xs">Solar Revolution</div>
                        </div>
                        <div className="text-xs text-white/50">✓</div>
                      </div>
                      
                      {/* Beijing - Unlocked after Delhi */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "beijing",
                          name: "Beijing",
                          country: "China",
                          lat: 39.9042,
                          lon: 116.4074,
                          missionTitle: "Carbon Footprint Simulator",
                          missionDescription: "Manage a city's carbon emissions through smart policy decisions",
                          difficulty: "Medium",
                          estimatedTime: "7 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="flex-1">
                          <div className="text-white/90 text-sm font-medium">Beijing, China</div>
                          <div className="text-white/60 text-xs">Carbon Footprint Simulator</div>
                        </div>
                        <div className="text-xs text-white/50">Next</div>
                      </div>
                      
                      {/* Moscow - Unlocked after Beijing */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "moscow",
                          name: "Moscow",
                          country: "Russia",
                          lat: 55.7558,
                          lon: 37.6176,
                          missionTitle: "Arctic Ecosystem Protector",
                          missionDescription: "Protect Arctic species from climate change threats",
                          difficulty: "Medium",
                          estimatedTime: "8 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Moscow, Russia</div>
                          <div className="text-white/50 text-xs">Arctic Ecosystem Protector</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Berlin */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "berlin",
                          name: "Berlin",
                          country: "Germany",
                          lat: 52.5200,
                          lon: 13.4050,
                          missionTitle: "Green City Planner",
                          missionDescription: "Design sustainable urban infrastructure and renewable energy systems",
                          difficulty: "Medium",
                          estimatedTime: "7 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Berlin, Germany</div>
                          <div className="text-white/50 text-xs">Green City Planner</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Los Angeles */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "los-angeles",
                          name: "Los Angeles",
                          country: "USA",
                          lat: 34.0522,
                          lon: -118.2437,
                          missionTitle: "Electric Vehicle Revolution",
                          missionDescription: "Transform transportation with electric vehicles and charging infrastructure",
                          difficulty: "Hard",
                          estimatedTime: "9 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Los Angeles, USA</div>
                          <div className="text-white/50 text-xs">Electric Vehicle Revolution</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* New York */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "new-york",
                          name: "New York",
                          country: "USA",
                          lat: 40.7128,
                          lon: -74.0060,
                          missionTitle: "Smart Grid Manager",
                          missionDescription: "Optimize energy distribution and reduce carbon footprint in the city",
                          difficulty: "Hard",
                          estimatedTime: "10 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">New York, USA</div>
                          <div className="text-white/50 text-xs">Smart Grid Manager</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Tel Aviv */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "tel-aviv",
                          name: "Tel Aviv",
                          country: "Israel",
                          lat: 32.0853,
                          lon: 34.7818,
                          missionTitle: "Water Innovation Hub",
                          missionDescription: "Develop advanced water conservation and desalination technologies",
                          difficulty: "Medium",
                          estimatedTime: "8 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Tel Aviv, Israel</div>
                          <div className="text-white/50 text-xs">Water Innovation Hub</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Cairo */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "cairo",
                          name: "Cairo",
                          country: "Egypt",
                          lat: 30.0444,
                          lon: 31.2357,
                          missionTitle: "Desert Solar Farm",
                          missionDescription: "Build massive solar installations in the Sahara desert",
                          difficulty: "Easy",
                          estimatedTime: "6 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Cairo, Egypt</div>
                          <div className="text-white/50 text-xs">Desert Solar Farm</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Tunis */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "tunis",
                          name: "Tunis",
                          country: "Tunisia",
                          lat: 36.8065,
                          lon: 10.1815,
                          missionTitle: "Mediterranean Conservation",
                          missionDescription: "Protect marine ecosystems and coastal environments",
                          difficulty: "Medium",
                          estimatedTime: "7 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Tunis, Tunisia</div>
                          <div className="text-white/50 text-xs">Mediterranean Conservation</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Buenos Aires */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "buenos-aires",
                          name: "Buenos Aires",
                          country: "Argentina",
                          lat: -34.6118,
                          lon: -58.3960,
                          missionTitle: "Urban Green Transformation",
                          missionDescription: "Convert the city into a sustainable urban ecosystem with green spaces and clean energy",
                          difficulty: "Medium",
                          estimatedTime: "8 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Buenos Aires, Argentina</div>
                          <div className="text-white/50 text-xs">Urban Green Transformation</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                      
                      {/* Toronto */}
                      <div 
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMission({
                          id: "toronto",
                          name: "Toronto",
                          country: "Canada",
                          lat: 43.6532,
                          lon: -79.3832,
                          missionTitle: "Climate Resilience Builder",
                          missionDescription: "Develop infrastructure to withstand extreme weather and climate change impacts",
                          difficulty: "Hard",
                          estimatedTime: "9 min",
                          isUnlocked: false,
                          isCompleted: false,
                        })}
                      >
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <div className="flex-1">
                          <div className="text-white/70 text-sm font-medium">Toronto, Canada</div>
                          <div className="text-white/50 text-xs">Climate Resilience Builder</div>
                        </div>
                        <div className="text-xs text-white/40">Locked</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {active === "leaderboard" && (
                <div className="text-white/80">Top players panel</div>
              )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Game Modal */}
      <GameModal
        isOpen={isGameModalOpen}
        onClose={handleCloseGame}
        mission={currentGameMission}
        onComplete={handleGameComplete}
      />
      
      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={handleCloseQuiz}
        quiz={currentQuiz}
        onComplete={handleQuizComplete}
      />
    </AppLayout>
  );
}
