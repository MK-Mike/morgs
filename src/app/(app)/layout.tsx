import { SiteHeader } from "@/components/site-header";
import { HeadlandAndSectorProvider } from "@/contexts/headland-sector-context";
import { getAllHeadlands } from "@/server/models/headlands";
import { getAllSectorsWithMetaData } from "@/server/models/sectors";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const headlands = await getAllHeadlands();
  const sectors = await getAllSectorsWithMetaData();

  return (
    <div
      data-wrapper=""
      className="border-grid flex w-full max-w-[100vw] flex-1 flex-col"
    >
      <HeadlandAndSectorProvider headlands={headlands} sectors={sectors}>
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
      </HeadlandAndSectorProvider>
    </div>
  );
}
