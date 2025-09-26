import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Globe } from "@/components/globe";

export default function Index() {
  const [eco, setEco] = useState(0);
  const [missions, setMissions] = useState(0);

  useEffect(() => {
    const ecoTarget = 1280;
    const missionTarget = 42;
    const start = performance.now();
    const duration = 1200;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setEco(Math.floor(ecoTarget * p));
      setMissions(Math.floor(missionTarget * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans antialiased">
      {/* Background Globe */}
      <div className="fixed inset-0 -z-10">
        <Globe onSelectSchool={() => {}} />
      </div>
      
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-16 space-y-32">
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center justify-center min-h-[70vh]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="typewriter text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron mb-8 leading-relaxed px-4 py-2"
          >
            CarbonCtrl — Learn. Play. Earn.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto px-4"
          >
            Gamified environmental education. Learn about sustainability through interactive challenges and track your impact on our 3D Earth.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center mb-12"
          >
            <Link to="/login">
              <Button className="bg-white text-black hover:bg-white/90 mono-glow px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-3">
                Create Account
              </Button>
            </Link>
          </motion.div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass rounded-xl p-6 mono-glow"
            >
              <div className="text-3xl font-orbitron mb-2">{eco.toLocaleString()}</div>
              <p className="text-white/70 text-sm">EcoCoins Earned</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="glass rounded-xl p-6 mono-glow"
            >
              <div className="text-3xl font-orbitron mb-2">{missions}</div>
              <p className="text-white/70 text-sm">Missions Completed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="glass rounded-xl p-6 mono-glow"
            >
              <div className="text-3xl font-orbitron mb-2">98%</div>
              <p className="text-white/70 text-sm">Engagement Rate</p>
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-orbitron text-center mb-12"
          >
            Why Choose CarbonCtrl?
          </motion.h2>
          <div className="max-w-6xl mx-auto px-4 space-y-20">
            {[
              {
                title: "Interactive Learning",
                description:
                  "Master environmental science through engaging quizzes, games, and hands-on challenges designed for all learning styles.",
                visual: (
                  <div className="glass rounded-2xl p-8 mono-glow">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <p className="font-orbitron mb-2">Quiz Module</p>
                        <div className="h-2 bg-white/20 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/20 rounded w-1/2" />
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="h-8 bg-white/10 rounded" />
                          <div className="h-8 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                        <p className="font-orbitron mb-2">Mini Game</p>
                        <div className="h-24 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Global Impact Tracking",
                description:
                  "Visualize your environmental actions on our interactive 3D Earth and see how your choices contribute to global sustainability.",
                visual: (
                  <div className="glass rounded-2xl p-8 mono-glow">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <p className="font-orbitron mb-3">Impact Map</p>
                      <div className="h-40 bg-white/10 rounded" />
                    </div>
                  </div>
                ),
              },
              {
                title: "Gamified Rewards",
                description:
                  "Earn EcoCoins for completing challenges, climb the leaderboard, and unlock achievements as you progress through your eco-journey.",
                visual: (
                  <div className="glass rounded-2xl p-8 mono-glow">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <p className="font-orbitron mb-3">EcoCoins</p>
                      <div className="flex gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/15" />
                        <div className="h-12 w-12 rounded-full bg-white/15" />
                        <div className="h-12 w-12 rounded-full bg-white/15" />
                      </div>
                      <div className="h-2 bg-white/20 rounded w-2/3" />
                    </div>
                  </div>
                ),
              },
              {
                title: "Educational Platform",
                description:
                  "Built for students, teachers, and schools with comprehensive analytics, curriculum alignment, and collaborative learning tools.",
                visual: (
                  <div className="glass rounded-2xl p-8 mono-glow">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <p className="font-orbitron mb-3">Classroom Tools</p>
                      <div className="space-y-2">
                        <div className="h-2 bg-white/20 rounded w-5/6" />
                        <div className="h-2 bg-white/20 rounded w-2/3" />
                        <div className="h-2 bg-white/20 rounded w-3/5" />
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((feature, index) => (
              <div key={feature.title} className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={"" + (index % 2 === 1 ? " lg:order-2" : "")}
                >
                  <h3 className="text-2xl font-orbitron mb-4">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed">{feature.description}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={index % 2 === 1 ? "lg:order-1" : ""}
                >
                  {feature.visual}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Preview */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 mono-glow max-w-5xl mx-auto px-4"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-orbitron mb-4">See CarbonCtrl in Action</h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Experience our interactive dashboard where students track their environmental impact, 
                  complete missions, and see their progress on the global leaderboard.
                </p>
                <div className="flex gap-4">
                  <Link to="/login">
                    <Button className="bg-white text-black hover:bg-white/90 mono-glow">
                      Try Demo
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                  <div className="space-y-4">
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="h-12 bg-white/10 rounded"></div>
                      <div className="h-12 bg-white/10 rounded"></div>
                      <div className="h-12 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-black px-3 py-1 rounded-full text-xs font-orbitron">
                  Live Preview
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Social Proof */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 mono-glow max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-2xl font-orbitron mb-8">Trusted by Educators Worldwide</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-orbitron text-white mb-2">1,200+</div>
                <p className="text-white/70 text-sm">Active Students</p>
              </div>
              <div>
                <div className="text-3xl font-orbitron text-white mb-2">45</div>
                <p className="text-white/70 text-sm">Schools Participating</p>
              </div>
              <div>
                <div className="text-3xl font-orbitron text-white mb-2">98%</div>
                <p className="text-white/70 text-sm">Student Engagement</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-12 mono-glow max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-3xl font-orbitron mb-4">Ready to Start Your Eco-Journey?</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Join thousands of students learning about environmental sustainability through gamified education.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button className="bg-white text-black hover:bg-white/90 mono-glow px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 px-8 py-3">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.jpg" 
                  alt="CarbonCtrl Logo" 
                  className="h-6 w-6 rounded-sm object-cover shadow-[0_0_15px_rgba(255,255,255,0.7)]" 
                />
                <span className="font-orbitron tracking-widest text-lg text-white">CarbonCtrl</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Gamified environmental education for the next generation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-orbitron mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/quizzes" className="hover:text-white transition-colors">Quizzes</Link></li>
                <li><Link to="/games" className="hover:text-white transition-colors">Games</Link></li>
                <li><Link to="/missions" className="hover:text-white transition-colors">Missions</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-orbitron mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-orbitron mb-4 text-sm">Education</h3>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">For Teachers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Schools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 CarbonCtrl. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}