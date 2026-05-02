// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t("profile_title")}</h2>
        <button
          onClick={() => setEditing(!editing)}
          className={
            editing
              ? "btn-secondary !py-2 !px-4 !text-sm"
              : "btn-primary !py-2 !px-4 !text-sm"
          }
        >
          {editing ? t("profile_cancel") : t("profile_edit")}
        </button>
      </div>

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/20">
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-white/40">{user?.email}</p>
            <span className="badge badge-orange mt-2">{user?.role}</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t("profile_first_name")}
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  defaultValue={user?.first_name}
                  disabled={!editing}
                  className="input !pl-12 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t("profile_last_name")}
              </label>
              <input
                type="text"
                defaultValue={user?.last_name}
                disabled={!editing}
                className="input disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {t("profile_email")}
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="input !pl-12 opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {t("profile_phone")}
            </label>
            <div className="relative">
              <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="tel"
                defaultValue={user?.phone || ""}
                disabled={!editing}
                className="input !pl-12 disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              {t("profile_bio")}
            </label>
            <textarea
              rows={4}
              defaultValue={user?.bio || ""}
              disabled={!editing}
              className="input disabled:opacity-50 resize-none"
            />
          </div>
          {editing && (
            <button className="btn-primary">{t("profile_save")}</button>
          )}
        </div>
      </div>
    </div>
  );
}
