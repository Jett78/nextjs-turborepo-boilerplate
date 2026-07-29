"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import SubmittingLoader from "@/components/dashboard/submitting-loader";
import AvatarUpload from "@/components/ui/avatar-upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCrud } from "@/hooks/useCRUD";
import { API_ROUTES } from "@/config/api-routes";
import { apiClient } from "@/lib/api-client";
import { showSuccess, showError } from "@/lib/toast-helper";

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
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { getAll } = useCrud<UserProfile>({
    endpoint: `${API_ROUTES.AUTH}/profile`,
    queryKey: "user-profile",
  });

  const { data: profile, isLoading } = getAll();

  const profileData = profile as UserProfile | undefined;

  if (profileData && !initialized) {
    setName(profileData.name || "");
    setPhone(profileData.phone || "");
    setAddress(profileData.address || "");
    setImageUrl(profileData.image || null);
    setInitialized(true);
  }

  const mutation = useMutation({
    mutationFn: (data: { name: string; phone: string; address: string; image: string | null }) =>
      apiClient<{ success: boolean; data: UserProfile }>(
        `${API_ROUTES.AUTH}/profile`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          isAuthenticated: true,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      showSuccess("Profile updated successfully!");
    },
    onError: () => {
      showError("Failed to update profile");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, phone, address, image: imageUrl });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-8 border-4 border-primarymain border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  const initials = profileData.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {mutation.isPending && <SubmittingLoader status="Saving profile" />}
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Cover Background */}
        <div className="h-32 bg-linear-to-r from-primarymain/20 via-primarymain/10 to-slate-100" />

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            {/* Avatar */}
            <AvatarUpload
              currentImage={imageUrl}
              initials={initials}
              onImageUploaded={(url) => setImageUrl(url)}
              size="md"
            />

            {/* Name & Role */}
            <div className="flex-1 sm:pb-1">
              <h1 className="text-xl font-bold text-slate-900">
                {profileData.name}
              </h1>
              <p className="text-sm text-slate-500">{profileData.email}</p>
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2 sm:pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primarymain/10 text-primarymain capitalize">
                <Shield className="size-3.5" />
                {profileData.role?.replace("_", " ")}
              </span>
              {profileData.emailVerified && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                  <CheckCircle className="size-3.5" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 ">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Mail className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">
              {profileData.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 ">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Phone className="size-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Phone</p>
            <p className="text-sm font-medium text-slate-900">
              {profileData.phone || "Not set"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-4 ">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Calendar className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Joined</p>
            <p className="text-sm font-medium text-slate-900">
              {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-slate-200  overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50/80 to-transparent">
          <h2 className="text-sm font-bold text-slate-900">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your personal details
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 h-11 rounded-xl"
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  className="pl-10 h-11 rounded-xl bg-slate-50"
                  disabled
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Contact support to change your email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977-9841234567"
                  className="pl-10 h-11 rounded-xl"
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Role
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={profileData.role?.replace("_", " ") || "customer"}
                  className="pl-10 h-11 rounded-xl bg-slate-50 capitalize"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-xs font-semibold text-slate-700">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="pl-10 h-11 rounded-xl"
                  disabled={mutation.isPending}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <PrimaryButton
              type="submit"
              text={mutation.isPending ? "Saving..." : "Save Changes"}
              disabled={mutation.isPending}
              className="rounded-xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
