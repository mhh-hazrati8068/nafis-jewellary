"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { isAdminLoggedIn } from "@/lib/adminAuth";
import styles from "./admin-layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname !== "/admin/login" && !isAdminLoggedIn()) {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

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
