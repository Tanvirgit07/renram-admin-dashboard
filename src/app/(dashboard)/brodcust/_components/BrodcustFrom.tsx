"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

function BrodcustFrom() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  const brodcustMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/newsletter/broadcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ subject, html:description }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to send broadcast");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Broadcast sent successfully!");
      setSubject("");
      setDescription("");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to send broadcast");
    },
  });

  const handleSubmit = () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }
    if (!description.trim() || description === "<p><br></p>") {
      toast.error("Please enter a description.");
      return;
    }
    brodcustMutation.mutate();
  };

  return (
    <div className="">
      {/* Subject */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Type subject here..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Description - React Quill */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description
        </label>
        <style>{`.ql-editor { min-height: 280px; }`}</style>
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          placeholder="Type description here..."
          className="rounded-lg"
          style={{ minHeight: "200px" }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={brodcustMutation.isPending}
          className="flex items-center justify-center gap-2 bg-[#0024DA] hover:bg-[#0024DA]/90 text-white text-sm font-medium px-6 h-11 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {brodcustMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Send Broadcast"
          )}
        </button>
      </div>
    </div>
  );
}

export default BrodcustFrom;