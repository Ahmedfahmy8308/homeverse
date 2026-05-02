// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { RoleGuard } from "@/guards";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { propertiesApi } from "@/lib/api";
import type { Property } from "@/lib/types";
import Modal from "@/components/Modal";
import { isValidLocale, type Locale } from "@/lib/i18n/locale-config";
import { getLocalizedValue, type LocalizedValue } from "@/lib/i18n/localized";

type PropertyFormState = Omit<Property, "id"> & { id: number | null };

const createEmptyText = (): LocalizedValue<string> => ({ en: "", ar: "" });

const createEmptyProperty = (): PropertyFormState => ({
  id: null,
  title: createEmptyText(),
  description: createEmptyText(),
  price: 0,
  currency: "EGP",
  period: "/Month",
  type: "rent",
  category: createEmptyText(),
  location: createEmptyText(),
  city: createEmptyText(),
  address: createEmptyText(),
  beds: 1,
  baths: 1,
  area: 0,
  floors: 1,
  yearBuilt: new Date().getFullYear(),
  garage: 0,
  featured: false,
  rating: 0,
  reviewCount: 0,
  images: [],
  amenities: [],
  agent: {
    id: "",
    name: createEmptyText(),
    phone: "",
    email: "",
    avatar: "",
    propertiesSold: 0,
    rating: 0,
  },
  createdAt: new Date().toISOString().slice(0, 10),
});

export default function AdminPropertiesPage() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale;
  const locale: Locale =
    rawLocale && isValidLocale(rawLocale) ? rawLocale : "en";

  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<PropertyFormState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoading || user?.role !== "admin") {
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await propertiesApi.listAdminProperties();
        if (active) setItems((res.data as Property[]) || []);
      } catch (error) {
        console.warn("Failed to load admin properties", error);
      }
    })();

    return () => {
      active = false;
    };
  }, [isLoading, user?.role]);

  const getTitle = (p: Property) => getLocalizedValue(p.title, locale);

  const openCreate = () => {
    setEditing(createEmptyProperty());
    setModalOpen(true);
  };

  const openEdit = (p: Property) => {
    setEditing({ ...p });
    setModalOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        title: editing.title,
        description: editing.description,
        city: editing.city,
        address: editing.address,
        location_label: editing.location,
        price: editing.price,
        currency: editing.currency,
        price_period: editing.period,
        listing_type: editing.type,
        bedrooms: editing.beds,
        bathrooms: editing.baths,
        area_sqft: editing.area,
        floors: editing.floors,
        garage: editing.garage,
        year_built: editing.yearBuilt,
        is_featured: editing.featured,
        images: editing.images,
      };

      if (editing.id === undefined || editing.id === null) {
        const res = await propertiesApi.createProperty(payload);
        const created = res.data as Property;
        setItems([created, ...items]);
      } else {
        const res = await propertiesApi.updateProperty(editing.id, payload);
        const updated = res.data as Property;
        setItems(items.map((it) => (it.id === updated.id ? updated : it)));
      }

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.warn("Failed to save property", error);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await propertiesApi.deleteProperty(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (error) {
      console.warn("Failed to delete property", error);
    }
  };

  return (
    <RoleGuard roles="admin">
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {t("admin_properties")}
          </h2>
          <Button onClick={openCreate} className="py-2! px-4! text-sm!">
            <HiOutlinePlus className="w-4 h-4" /> {t("admin_add_property")}
          </Button>
        </div>

        <div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={getTitle(p)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {getTitle(p)}
                      </h3>
                      <p className="text-xs text-white/50 mb-2">
                        {getLocalizedValue(p.city, locale)}
                      </p>
                      <div className="text-sm font-medium text-white mb-3">
                        {p.currency} {p.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`badge ${p.type === "rent" ? "badge-green" : "badge-orange"}`}
                      >
                        {p.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={p.agent.avatar}
                          alt={getLocalizedValue(p.agent.name, locale)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-white/80">
                          {getLocalizedValue(p.agent.name, locale)}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {p.agent.propertiesSold} {t("properties_sold")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded hover:bg-white/5 text-blue-400"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-2 rounded hover:bg-red-500/10 text-red-400"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            editing
              ? editing.id
                ? t("admin_edit_property")
                : t("admin_add_property")
              : undefined
          }
        >
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_property_title")}
                </label>
                <input
                  className="input"
                  value={getLocalizedValue(editing.title, locale)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: { ...editing.title, [locale]: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_property_city")}
                  </label>
                  <input
                    className="input"
                    value={getLocalizedValue(editing.city, locale)}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        city: { ...editing.city, [locale]: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_property_price")}
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_property_type")}
                  </label>
                  <select
                    className="input"
                    value={editing.type}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        type: e.target.value as Property["type"],
                      })
                    }
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_property_bedrooms")}
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={editing.beds}
                    onChange={(e) =>
                      setEditing({ ...editing, beds: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_property_bathrooms")}
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={editing.baths}
                    onChange={(e) =>
                      setEditing({ ...editing, baths: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_property_description")}
                </label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  value={getLocalizedValue(editing.description, locale)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: {
                        ...editing.description,
                        [locale]: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                >
                  {t("admin_reset")}
                </Button>
                <Button onClick={save} disabled={saving}>
                  {saving ? t("loading") : t("admin_save_property")}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </RoleGuard>
  );
}
