// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

export const dynamic = "force-dynamic";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { RoleGuard } from "@/guards";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { generalApi } from "@/lib/api";
import type { AdminUserSummary } from "@/lib/types";

function normalizeUserSummary(user: unknown): AdminUserSummary {
  const record =
    typeof user === "object" && user !== null
      ? (user as Record<string, unknown>)
      : {};
  const firstName =
    typeof record.first_name === "string" ? record.first_name : "";
  const lastName = typeof record.last_name === "string" ? record.last_name : "";
  const name =
    typeof record.name === "string" && record.name.trim().length > 0
      ? record.name
      : `${firstName} ${lastName}`.trim();

  return {
    id: typeof record.id === "number" ? record.id : null,
    name,
    email: typeof record.email === "string" ? record.email : "",
    role: record.role === "Admin" ? "Admin" : "User",
    status: record.status === "Inactive" ? "Inactive" : "Active",
    joined:
      typeof record.joined === "string"
        ? record.joined
        : typeof record.created_at === "string"
          ? record.created_at
          : undefined,
  };
}

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [editing, setEditing] = useState<AdminUserSummary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await generalApi.listUsers();
        if (!active) return;
        setUsers(((res.data ?? []) as unknown[]).map(normalizeUserSummary));
      } catch (e) {
        console.warn("Failed to load admin users", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const openCreate = () => {
    setEditing({
      id: null,
      name: "",
      email: "",
      role: "User",
      status: "Active",
    });
    setModalOpen(true);
  };

  const openEdit = (u: AdminUserSummary) => {
    setEditing({ ...u });
    setModalOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (editing.id == null) {
      const nextId = Math.max(0, ...users.map((x) => x.id ?? 0)) + 1;
      setUsers([
        {
          ...editing,
          id: nextId,
          joined: new Date().toISOString().slice(0, 10),
        },
        ...users,
      ]);
    } else {
      setUsers(users.map((u) => (u.id === editing.id ? editing : u)));
    }
    setModalOpen(false);
    setEditing(null);
  };

  const remove = (id: number | null) => {
    if (id === null) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <RoleGuard roles="admin">
      <div className="space-y-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white">
          {t("admin_manage_users")}
        </h2>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div />
            <Button onClick={openCreate} className="py-2! px-4! text-sm!">
              {t("admin_add_user")}
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-base font-bold text-orange-400">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">
                      {user.name}
                    </h4>
                    <p className="text-xs text-white/50">{user.email}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`badge ${user.role === "Admin" ? "badge-orange" : "badge-blue"}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`badge ${user.status === "Active" ? "badge-green" : "badge-red"}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => openEdit(user)}
                    className="p-2 rounded hover:bg-white/5 text-blue-400"
                  >
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(user.id)}
                    className="p-2 rounded hover:bg-red-500/10 text-red-400"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
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
                ? t("admin_edit_user")
                : t("admin_add_user")
              : undefined
          }
        >
          {editing && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_user_name")}
                </label>
                <input
                  className="input"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  {t("admin_user_email")}
                </label>
                <input
                  className="input"
                  value={editing.email}
                  onChange={(e) =>
                    setEditing({ ...editing, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_user_role")}
                  </label>
                  <select
                    className="input"
                    value={editing.role}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        role: e.target.value as AdminUserSummary["role"],
                      })
                    }
                  >
                    <option>Admin</option>
                    <option>User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">
                    {t("admin_user_status")}
                  </label>
                  <select
                    className="input"
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        status: e.target.value as AdminUserSummary["status"],
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
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
                <Button onClick={save}>{t("admin_save_user")}</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </RoleGuard>
  );
}
