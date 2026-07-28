"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (data.success && data.data) {
          setProfile(data.data);
          setName(data.data.name || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");
          setAddress(data.data.address || "");
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, phone, address }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1 text-xs">
          Manage your personal information.
        </p>
      </div>

      {/* Profile Picture */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="size-10 text-slate-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors">
              <Camera className="size-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{profile?.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile?.email}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">
              Role: {profile?.role?.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <form onSubmit={handleSave} className="bg-white rounded-md border border-slate-200 shadow-xs p-6 space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={email}
                className="pl-10"
                disabled
              />
            </div>
            <p className="text-xs text-slate-400">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977-9841234567"
                className="pl-10"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-slate-400" />
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="pl-10 min-h-[80px]"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
