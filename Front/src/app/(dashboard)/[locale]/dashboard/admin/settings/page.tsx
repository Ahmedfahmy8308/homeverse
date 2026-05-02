// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useTranslation } from "react-i18next";
import { RoleGuard } from "@/guards";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function AdminSettingsPage() {
  const { t } = useTranslation();

  return (
    <RoleGuard roles="admin">
      <div className="max-w-2xl space-y-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white">
          {t("admin_site_settings")}
        </h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t("admin_address")}
              </label>
              <input className="input" defaultValue="Cairo, Egypt" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t("admin_phone")}
              </label>
              <input className="input" defaultValue="01086605067" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                {t("admin_email")}
              </label>
              <input className="input" defaultValue="info@homeverse.com" />
            </div>
            <div className="pt-4">
              <Button>{t("admin_save_settings")}</Button>
            </div>
          </div>
        </Card>
      </div>
    </RoleGuard>
  );
}
