import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint, UserPlus, LogIn, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 mb-4">
            <Fingerprint className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              SecureID
            </span>
          </h1>
          <p className="text-slate-600">Biometric authentication made simple</p>
        </div>

        <Card className="border shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 w-full" />
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-center">
              Get Started
            </CardTitle>
            <CardDescription className="text-center">
              Choose an option to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button
              asChild
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            >
              <Link
                to="/register"
                className="flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <Link
                to="/login"
                className="flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-center w-full text-sm text-slate-500 gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-500" />
              <span>Secured by WebAuthn</span>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Fingerprint recognition for ultimate security</p>
        </div>
      </div>
    </div>
  );
}
