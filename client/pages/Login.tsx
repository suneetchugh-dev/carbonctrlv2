import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <AppLayout showGlobe>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto glass rounded-2xl p-8 mt-10">
          <h1 className="font-orbitron text-3xl mb-6">Login</h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Email</Label>
              <Input placeholder="you@example.com" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Password</Label>
              <Input type="password" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
            </div>
            <Button className="w-full bg-white text-black hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.5)]">Continue</Button>
            <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/10">Sign in with Google</Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
