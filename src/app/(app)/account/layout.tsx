interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      data-wrapper=""
      className="border-grid flex w-full max-w-[100vw] flex-1 flex-col"
    >
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
