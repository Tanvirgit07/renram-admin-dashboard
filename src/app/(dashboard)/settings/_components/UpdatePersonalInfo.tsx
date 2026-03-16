"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Pencil, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdatePersonalInfo() {
  const queryClient = useQueryClient();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // ─── Profile Form State ───────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    avatar: "/images/default-avatar.png",
  });

  // ─── Password Form State ──────────────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ─── Avatar Upload State ──────────────────────────────────────────────
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const labelClass = "text-base font-medium text-[#707070]";
  const inputClass =
    "h-[48px] rounded-[4px] border-[#0000001A] text-base text-[#272727] placeholder:text-base placeholder:text-[#272727]";
  const selectClass =
    "h-[48px] rounded-[4px] border-[#0000001A] text-base text-[#272727] [&>span]:text-base [&>span]:text-[#272727]";

  const session = useSession();
  const userId = session?.data?.user?.id;
  const TOKEN = session?.data?.user?.accessToken;

  const router = useRouter();

  // ─── Fetch User ───────────────────────────────────────────────────────
  const { data: singleUser, isSuccess } = useQuery({
    queryKey: ["singleUser"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });

  // ─── Populate Form ────────────────────────────────────────────────────
  useEffect(() => {
    if (isSuccess && singleUser?.data) {
      const user = singleUser.data;
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        gender: user.gender || "",
        address: user.address || "",
        avatar: user.profilePicture || "/images/default-avatar.png",
      });
    }
  }, [isSuccess, singleUser]);

  // ─── Update Profile Mutation ──────────────────────────────────────────
  const updateUserMutation = useMutation({
    mutationFn: async () => {
      const formDataPayload = new FormData();

      if (formData.firstName.trim())
        formDataPayload.append("firstName", formData.firstName.trim());
      if (formData.lastName.trim())
        formDataPayload.append("lastName", formData.lastName.trim());
      if (formData.phoneNumber.trim())
        formDataPayload.append("phoneNumber", formData.phoneNumber.trim());
      if (formData.dateOfBirth)
        formDataPayload.append(
          "dateOfBirth",
          new Date(formData.dateOfBirth).toISOString()
        );
      if (formData.gender)
        formDataPayload.append("gender", formData.gender);
      if (formData.address.trim())
        formDataPayload.append("address", formData.address.trim());
      if (avatarFile)
        formDataPayload.append("profilePicture", avatarFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formDataPayload,
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleUser"] });
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update profile");
    },
  });

  // ─── Change Password Mutation ─────────────────────────────────────────
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!passwordData.oldPassword.trim())
        throw new Error("Please enter your current password.");
      if (!passwordData.newPassword.trim())
        throw new Error("Please enter a new password.");
      if (passwordData.newPassword !== passwordData.confirmPassword)
        throw new Error("New password and confirm password do not match.");

      const payload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        // confirmPassword: passwordData.confirmPassword,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: () => {
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully");
      router.push('/signin')
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to change password");
    },
  });

  return (
    <div className="min-h-screen px-2 py-8">
      <h1 className="text-[24px] font-semibold text-[#272727] mb-2 mt-0">
        Setting
      </h1>

      <div className="flex items-center gap-1.5 text-[13px] text-gray-400 mb-6">
        <span className="text-[#595959] text-base cursor-pointer hover:text-[#595959]/90 transition-colors">
          Dashboard
        </span>
        <span className="text-[#595959] text-base">›</span>
        <span className="text-[#595959] text-base font-medium">Setting</span>
      </div>

      {/* Profile Header */}
      <div className="rounded-xl px-7 py-5 flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-[120px] h-[120px] shrink-0">
            <Image
              width={300}
              height={300}
              src={formData.avatar}
              alt="Profile"
              className="w-[120px] h-[120px] rounded-full object-cover border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full flex items-center justify-center transition-colors"
              title="Change photo"
            >
              <Pencil className="w-[10px] h-[10px] text-white" />
            </button>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <p className="font-bold text-[20px] text-[#131313] leading-tight">
              {formData.firstName} {formData.lastName}
            </p>
            <p className="text-[16px] text-[#616161] mt-0.5">
              @{formData.email.split("@")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#595959] text-[#595959] hover:bg-transparent bg-transparent medium text-base h-[43px] px-5"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
          <Button
            className="bg-[#0024DA] hover:bg-[#0024DA]/90 text-white font-semibold text-base h-[43px] px-5 flex items-center gap-2"
            disabled={updateUserMutation.isPending}
            onClick={() => updateUserMutation.mutate()}
          >
            {updateUserMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Pencil className="w-3.5 h-3.5" />
                Update Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>First Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="Enter first name"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Last Name</Label>
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Enter last name"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Email</Label>
          <Input
            type="email"
            value={formData.email}
            disabled
            className={`${inputClass} bg-gray-50 cursor-not-allowed`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Phone Number</Label>
          <Input
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            placeholder="Enter phone number"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Date of Birth</Label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, gender: val }))
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className={labelClass}>Address</Label>
          <Input
            value={formData.address}
            placeholder="Enter your full address"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[440px] p-7">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold text-gray-900">
              Change Password
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.oldPassword}
                  className={`${inputClass} pr-10`}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.newPass ? "text" : "password"}
                  value={passwordData.newPassword}
                  className={`${inputClass} pr-10`}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      newPass: !prev.newPass,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.newPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  className={`${inputClass} pr-10`}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                disabled={changePasswordMutation.isPending}
                onClick={() => changePasswordMutation.mutate()}
              >
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  "Save Password"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}