"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, Loader2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function RegisterForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState("form"); // form, biometric

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !name) {
      toast.warning("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // First create the user in the backend
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      // Move to biometric registration
      setRegistrationStep("biometric");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFingerprint = async () => {
    try {
      setLoading(true);

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create user ID from email (for demo purposes)
      const userId = new TextEncoder().encode(email);

      const publicKeyCredential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Biometric Auth Demo",
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: email,
            displayName: name,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      });

      if (publicKeyCredential) {
        // Convert ArrayBuffer to Base64 for storage
        const credential = {
          id: publicKeyCredential.id,
          rawId: arrayBufferToBase64(publicKeyCredential.rawId),
          response: {
            clientDataJSON: arrayBufferToBase64(
              publicKeyCredential.response.clientDataJSON
            ),
            attestationObject: arrayBufferToBase64(
              publicKeyCredential.response.attestationObject
            ),
          },
          type: publicKeyCredential.type,
        };

        // Send credential to server
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/credentials/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              credential,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to register credential");
        }

        const userData = {
          email,
          name,
          fingerprint: credential.rawId,
        };

        // Store user data in localStorage (in a real app, you'd use a more secure method)
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("Fingerprint registered successfully");

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register fingerprint");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  if (registrationStep === "biometric") {
    return (
      <>
        <CardContent className="space-y-6 px-6">
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <Fingerprint className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Register Your Fingerprint</h3>
              <p className="text-sm text-slate-500">
                Place your finger on the fingerprint sensor to register
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6">
          <Button
            className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            onClick={handleRegisterFingerprint}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register Fingerprint
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardContent className="space-y-4 px-6">
        <form id="register-form" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">
              Secure Authentication
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Fingerprint className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Biometric Authentication</p>
              <p className="text-slate-500 text-xs">
                You'll set up fingerprint authentication in the next step
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-6">
        <Button
          type="submit"
          form="register-form"
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </CardFooter>
    </>
  );
}
