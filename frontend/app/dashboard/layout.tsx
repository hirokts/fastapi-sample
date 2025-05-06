"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNav from '@/app/ui/dashboard/sidenav';
import { useSupabaseAuth } from "@/app/hooks/useSupabase"

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading, signOut } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav logout={signOut} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
