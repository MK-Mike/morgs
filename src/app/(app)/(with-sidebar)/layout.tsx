import type React from "react";
import Sidebar from "~/components/Sidebar";

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="hidden lg:block lg:w-72 lg:flex-none">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
