import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success("Registration complete! Your fingerprint is now secured.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 w-full" />
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:bg-slate-100 h-8 w-8"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <CardTitle className="text-center flex-1 text-xl font-semibold">
                Create Account
              </CardTitle>
              <div className="w-8"></div>
            </div>
            <CardDescription className="text-center text-slate-500">
              Register your biometric identity
            </CardDescription>
          </CardHeader>
          <RegisterForm onSuccess={handleSuccess} />
        </Card>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
