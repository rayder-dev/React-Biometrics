"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Fingerprint, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("You have been successfully logged out.");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md border shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 w-full" />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Account</CardTitle>
            <Badge variant="outline" className="bg-slate-50">
              <Shield className="h-3 w-3 mr-1 text-emerald-500" />
              Secured
            </Badge>
          </div>
          <CardDescription>Your biometric secured dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-violet-100">
              <AvatarFallback className="bg-gradient-to-br from-violet-100 to-indigo-100 text-indigo-600 text-xl">
                {user.name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              SECURITY
            </h4>
            <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">Biometric Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Fingerprint registered
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-600 border-emerald-100"
              >
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50 p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
