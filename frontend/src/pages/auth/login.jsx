import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HousePlug, Mail, Lock, ShieldCheck, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const initialState = { email: "", password: "" };

const TABS = [
  { id: "user", label: "Customer", icon: User },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [activeTab, setActiveTab] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();
    if (activeTab === "admin") {
      navigate("/admin-auth/login");
      return;
    }
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message || "Login successful" });
      } else {
        toast({
          title: data?.payload?.message || "Login failed. Please check your credentials.",
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
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline underline-offset-4"
              to="/auth/register"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex rounded-xl border border-border bg-muted/40 p-1 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "admin" ? (
          /* Admin redirect card */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-xl border border-indigo-300/40 bg-indigo-50/40 dark:bg-indigo-900/20 text-center space-y-4"
          >
            <ShieldCheck className="h-10 w-10 text-indigo-500 mx-auto" />
            <div>
              <p className="font-bold text-foreground">Admin Login</p>
              <p className="text-sm text-muted-foreground mt-1">
                You will be redirected to the secure admin login portal.
              </p>
            </div>
            <Button
              onClick={() => navigate("/admin-auth/login")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
            >
              Go to Admin Login
            </Button>
          </motion.div>
        ) : (
          /* User login form */
          <motion.form
            key="user-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
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
              <label className="text-sm font-medium text-foreground" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 border-0 text-white rounded-xl py-6 font-bold shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </Button>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}

export default AuthLogin;
