// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useTranslation } from "react-i18next";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

export default function UserMyPropertiesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {t("dashboard_my_properties")}
        </h2>
        <button className="btn-primary py-2! px-5! text-sm!">
          {t("admin_add_property")}
        </button>
      </div>
      <div className="card p-12 text-center">
        <HiOutlineOfficeBuilding className="w-16 h-16 mx-auto text-white/10 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          {t("dashboard_no_properties_title")}
        </h3>
        <p className="text-white/40 text-sm">
          {t("dashboard_no_properties_text")}
        </p>
      </div>
    </div>
  );
}
