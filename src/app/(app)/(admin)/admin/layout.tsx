import type React from "react";
import AdminSidebar from "~/components/AdminSidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-y-hidden">
      <aside className="hidden lg:block lg:w-72 lg:flex-none">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
