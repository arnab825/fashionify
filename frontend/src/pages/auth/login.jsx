import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message || "Login successful",
        });
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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full space-y-6 card-gradient card-gradient-hover p-8 rounded-2xl shadow-xl border-t-4 border-t-purple-500/30"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Don't have an account?
            <Link
              className="font-semibold ml-2 text-purple-600 dark:text-purple-400 hover:underline transition-all underline-offset-4"
              to="/auth/register"
            >
              Sign Up
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}

export default AuthLogin;
