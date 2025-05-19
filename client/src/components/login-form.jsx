import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState("form"); // form, biometric

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists
      const response = await fetch(
        `http://localhost:3001/api/users/check?email=${encodeURIComponent(
          email
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to verify user");
      }

      const data = await response.json();

      if (!data.exists) {
        throw new Error("User not found. Please register first.");
      }

      // Move to biometric verification
      setLoginStep("biometric");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprint = async () => {
    try {
      setLoading(true);

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Get credential info from server
      const infoResponse = await fetch(
        `http://localhost:3001/api/credentials/get-info?email=${encodeURIComponent(
          email
        )}`
      );

      if (!infoResponse.ok) {
        throw new Error("Failed to get credential info");
      }

      const credentialInfo = await infoResponse.json();

      if (!credentialInfo.credential) {
        throw new Error("No credential found for this user");
      }

      // Convert base64 to ArrayBuffer
      const credentialId = base64ToArrayBuffer(credentialInfo.credential.rawId);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [
            {
              id: credentialId,
              type: "public-key",
            },
          ],
          userVerification: "required",
          timeout: 60000,
        },
      });

      if (assertion) {
        // Convert ArrayBuffer to Base64 for verification
        const credential = {
          id: assertion.id,
          rawId: arrayBufferToBase64(assertion.rawId),
          response: {
            clientDataJSON: arrayBufferToBase64(
              assertion.response.clientDataJSON
            ),
            authenticatorData: arrayBufferToBase64(
              assertion.response.authenticatorData
            ),
            signature: arrayBufferToBase64(assertion.response.signature),
            userHandle: assertion.response.userHandle
              ? arrayBufferToBase64(assertion.response.userHandle)
              : null,
          },
          type: assertion.type,
        };

        // Verify with server
        const verifyResponse = await fetch(
          "http://localhost:3001/api/credentials/verify",
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

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify credential");
        }

        const userData = {
          email,
          name: credentialInfo.user.name,
          fingerprint: credentialInfo.credential.rawId,
        };

        // Store user data in localStorage (in a real app, you'd use a more secure method)
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Authentication successful");

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Failed to authenticate");
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

  // Helper function to convert Base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  if (loginStep === "biometric") {
    return (
      <>
        <CardContent className="space-y-6 px-6">
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <Fingerprint className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Verify Your Identity</h3>
              <p className="text-sm text-slate-500">
                Place your finger on the fingerprint sensor to authenticate
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6">
          <Button
            className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            onClick={handleFingerprint}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Authenticate
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <>
      <CardContent className="space-y-4 px-6">
        <form id="login-form" onSubmit={handleSubmit}>
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
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">or</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Fingerprint className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Use Passkey Instead</p>
              <p className="text-slate-500 text-xs">
                Sign in with your registered fingerprint
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t p-6">
        <Button
          type="submit"
          form="login-form"
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
