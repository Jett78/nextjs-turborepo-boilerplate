"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").map((char) => char);
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setStatus("error");
      setMessage("Please enter the complete 6-digit OTP");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpString }),
        }
      );

      const data = await response.json();

      if (data.success || response.ok) {
        setStatus("success");
        setMessage("Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid or expired OTP");
      }
    } catch {
      setStatus("error");
      setMessage("An error occurred during verification");
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        }
      );

      const data = await response.json();

      if (data.success || response.ok) {
        setResendMessage("OTP sent successfully! Check your email.");
        setCountdown(60);
      } else {
        setResendMessage(data.message || "Failed to resend OTP");
      }
    } catch {
      setResendMessage("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto p-3 bg-rose-100 rounded-full w-fit">
            <XCircle className="size-12 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            No Email Provided
          </h1>
          <p className="text-muted-foreground">
            Please register first to verify your email.
          </p>
          <Link href="/register">
            <Button className="w-full">Go to Register</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto p-3 bg-emerald-100 rounded-full w-fit mb-4">
            <Mail className="size-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        {status === "success" ? (
          <div className="space-y-6 text-center">
            <div className="mx-auto p-3 bg-emerald-100 rounded-full w-fit">
              <CheckCircle className="size-12 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold">Email Verified!</h2>
            <p className="text-muted-foreground">
              Your email has been verified successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {status === "error" && message && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive text-center">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    name={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold"
                    disabled={status === "loading"}
                  />
                ))}
              </div>

              <Button
                onClick={handleVerify}
                className="w-full"
                disabled={status === "loading" || otp.join("").length !== 6}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {resendMessage && (
                <p className="text-sm text-center text-emerald-600">
                  {resendMessage}
                </p>
              )}

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-sm"
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </Button>
                )}
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="mr-1 size-4" />
                  Back to Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
