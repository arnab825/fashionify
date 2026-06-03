import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HousePlug, Mail, Lock, User, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const initialState = { userName: "", email: "", password: "" };

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
  { label: "One special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-500", "bg-red-400", "bg-amber-500", "bg-yellow-400", "bg-green-500"];
  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? colors[passed - 1] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${passed === 5 ? "text-green-500" : "text-muted-foreground"}`}>
        {labels[passed - 1] || "Too weak"}
      </p>
      {/* Rule checklist */}
      <div className="grid grid-cols-1 gap-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-none" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-muted-foreground/50 flex-none" />
              )}
              <span className={ok ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formData.password));

  function onSubmit(event) {
    event.preventDefault();

    if (!allRulesPassed) {
      toast({
        title: "Password does not meet security requirements.",
        variant: "destructive",
      });
      setShowStrength(true);
      return;
    }

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message || "Registration successful!" });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message || "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full max-w-md relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none rounded-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full space-y-6 card-gradient card-gradient-hover p-8 rounded-2xl shadow-xl border-t-4 border-t-purple-500/30"
      >
        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 text-white shadow-lg">
              <HousePlug className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline underline-offset-4"
              to="/auth/login"
            >
              Sign In
            </Link>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="reg-username">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reg-username"
                type="text"
                placeholder="Your name"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="reg-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="reg-password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setShowStrength(true);
                }}
                onFocus={() => setShowStrength(true)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength meter — shown when user starts typing */}
            {showStrength && <PasswordStrengthMeter password={formData.password} />}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 border-0 text-white rounded-xl py-6 font-bold shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {isLoading ? "Creating account…" : "Create Account"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default AuthRegister;
