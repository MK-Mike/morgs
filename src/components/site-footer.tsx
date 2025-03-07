import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-grid border-t py-6 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Mike Kent.
            <a
              href={siteConfig.links.facebook}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              facebook
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              whatsapp
            </a>
            <a
              href={siteConfig.links.ecclimbing}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Easter Cape Rock Climbing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
