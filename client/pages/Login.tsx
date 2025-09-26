import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout showGlobe showNavbar={false} showChatbot={false}>
      <div className="container mx-auto px-6 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto glass rounded-2xl p-8"
        >
          <h1 className="font-orbitron text-3xl mb-6">Login</h1>
          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-2">
              <Label className="text-white/80">Email</Label>
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            {error && (
              <div className="text-sm text-red-300">{error}</div>
            )}
            <Button disabled={loading} className="w-full bg-white text-black hover:bg-white/90 shadow-[0_0_25px_rgba(255,255,255,0.5)]">
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full border-white/40 text-white hover:bg-white/10 mt-3"
          >
            Sign in with Google
          </Button>
          <p className="text-center text-white/70 text-sm mt-6">
            Not registered? {""}
            <Link to="/register" className="text-white underline underline-offset-4 hover:text-white/80">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
