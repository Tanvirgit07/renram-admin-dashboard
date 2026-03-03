"use client";

import React from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";

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

export default function UpdatePersonalInfo() {
  // ডেমো/স্ট্যাটিক ডেটা (ফর্মে প্রি-ফিল করার জন্য)
  const formData = {
    fullName: "Tanvir Ahmed",
    email: "tanvir@example.com",
    dateOfBirth: "1995-08-15",
    gender: "Male",
    address: "123 Mirpur Road, Dhaka 1216, Bangladesh",
    avatar: "/images/default-avatar.png", // অথবা কোনো রিয়েল URL
  };

  // ডেমো পাসওয়ার্ড ফিল্ডের জন্য স্টেট (শুধু UI দেখানোর জন্য)
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  const labelClass = "text-base font-medium text-[#707070]";
  const inputClass = "h-[48px] rounded-[4px] border-[#0000001A] text-base text-[#272727] placeholder:text-base placeholder:text-[#272727]";
  const selectClass = "h-[48px] rounded-[4px] border-[#0000001A] text-base text-[#272727] [&>span]:text-base [&>span]:text-[#272727]";

  return (
    <div className="min-h-screen px-2 py-8">
      <h1 className="text-[24px] font-semibold text-[#272727] mb-2 mt-0">Setting</h1>

      <div className="flex items-center gap-1.5 text-[13px] text-gray-400 mb-6">
        <span className="text-[#595959] text-base cursor-pointer hover:text-[#595959]/90 transition-colors">
          Dashboard
        </span>
        <span className="text-[#595959] text-base">›</span>
        <span className="text-[#595959] text-base font-medium">Setting</span>
      </div>

      {/* Profile Header Section */}
      <div className="rounded-xl px-7 py-5 flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-[120px] h-[120px] shrink-0">
            <img
              src={formData.avatar}
              alt="Profile"
              className="w-[120px] h-[120px] rounded-full object-cover border-2 border-gray-200"
            />
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full flex items-center justify-center transition-colors"
              title="Change photo"
            >
              <Pencil className="w-[10px] h-[10px] text-white" />
            </button>
          </div>

          <div>
            <p className="font-bold text-[20px] text-[#131313] leading-tight">
              {formData.fullName}
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
          >
            <Pencil className="w-3.5 h-3.5" />
            Update Profile
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Full Name</Label>
          <Input
            value={formData.fullName}
            className={inputClass}
          />
        </div>

        {/* Email (read-only) */}
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Email</Label>
          <Input
            type="email"
            value={formData.email}
            disabled
            className={`${inputClass} bg-gray-50 cursor-not-allowed`}
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Date of Birth</Label>
          <Input
            value={formData.dateOfBirth}
            placeholder="YYYY-MM-DD"
            className={inputClass}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <Label className={labelClass}>Gender</Label>
          <Select value={formData.gender}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label className={labelClass}>Address</Label>
          <Input
            value={formData.address}
            placeholder="Enter your full address"
            className={inputClass}
          />
        </div>
      </div>

      {/* Change Password Modal (শুধু ডিজাইন) */}
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
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.newPass ? "text" : "password"}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, newPass: !prev.newPass }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className={labelClass}>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-[#272727]"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                Save Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}