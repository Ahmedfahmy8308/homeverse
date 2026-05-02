// Copyright (c) 2025 Ahmed Fahmy
// Developed at UFUQ TECH
// Proprietary software. See LICENSE file in the project root for full license information.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/types/users.types";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function UnauthorizedAccess({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center max-w-md p-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-white/60 mb-6">
          {message || "You do not have permission to access this page."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push(redirectTo);
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) return fallback || <LoadingSpinner />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

interface RoleGuardProps {
  children: React.ReactNode;
  roles: Role | Role[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export function RoleGuard({
  children,
  roles,
  fallback,
  requireAll = false,
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  if (isLoading) return fallback || <LoadingSpinner />;
  if (!user)
    return (
      fallback || (
        <UnauthorizedAccess message="Please log in to access this page." />
      )
    );

  const normalizeRole = (role: string) => role?.toLowerCase().trim() || "";
  const normalizedUserRole = normalizeRole(user.role);
  const normalizedRequiredRoles = requiredRoles.map(normalizeRole);

  const userHasRole = requireAll
    ? normalizedRequiredRoles.every((role) => normalizedUserRole === role)
    : normalizedRequiredRoles.some((role) => normalizedUserRole === role);

  if (!userHasRole) {
    return (
      fallback || (
        <UnauthorizedAccess
          message={`This page requires ${requiredRoles.join(" or ")} access.`}
        />
      )
    );
  }

  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role | Role[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  roles,
  requireAll = false,
  fallback,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  return (
    <AuthGuard fallback={fallback} redirectTo={redirectTo}>
      {roles ? (
        <RoleGuard roles={roles} requireAll={requireAll} fallback={fallback}>
          {children}
        </RoleGuard>
      ) : (
        children
      )}
    </AuthGuard>
  );
}

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function GuestGuard({
  children,
  redirectTo = "/dashboard",
  fallback,
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) router.push(redirectTo);
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) return fallback || <LoadingSpinner />;
  if (isAuthenticated) return null;
  return <>{children}</>;
}
