"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { isAdminLoggedIn, removeAdminSession } from "@/lib/adminAuth";
import { useAppStore } from "@/store/useAppStore";
import styles from "./admin-layout.module.css";

const emptySubscribe = () => () => {};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loadUserFromStorage, logout } = useAppStore();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    loadUserFromStorage();

    if (pathname !== "/admin/login" && !isAdminLoggedIn()) {
      removeAdminSession();
      logout();
      router.replace("/admin/login");
    }
  }, [pathname, router, loadUserFromStorage, logout]);

  // Listen for any 401/403 admin auth failures and redirect cleanly to login
  useEffect(() => {
    const handleAdminAuthRequired = () => {
      removeAdminSession();
      logout();
      if (pathname !== "/admin/login") {
        router.replace("/admin/login?reason=expired");
      }
    };

    window.addEventListener("nafis:admin-auth-required", handleAdminAuthRequired);
    return () => {
      window.removeEventListener("nafis:admin-auth-required", handleAdminAuthRequired);
    };
  }, [pathname, router, logout]);

  // If on login page, render children directly without admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // During SSR or before auth check on protected routes, prevent flashing
  if (!mounted || !isAdminLoggedIn()) {
    return null;
  }

  return (
    <div className={styles.adminShell} dir="rtl">
      <AdminSidebar />
      <div className={styles.mainContent}>
        <AdminTopBar />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
