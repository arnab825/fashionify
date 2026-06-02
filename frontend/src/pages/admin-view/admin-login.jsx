import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AdminLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Admin login successful",
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white w-full px-4">
      <div className="mx-auto w-full max-w-md space-y-6 bg-zinc-900 p-8 rounded-xl shadow-2xl border border-zinc-800">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-primary/20 p-3 rounded-full">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-4">
            Admin Portal
          </h1>
          <p className="text-zinc-400 text-sm">
            Sign in with your administrator credentials
          </p>
        </div>
        <div className="admin-form-theme">
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Access Dashboard"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
