import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-grid border-t px-2 py-6 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Mike Kent. All rights reserved. ©2025. <br /> Contribute
            to this project on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Github
            </a>
            , join the Morgan Bay Climbing community on{" "}
            <a
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            , or find other climbing venues in the{" "}
            <a
              href={siteConfig.links.ecclimbing}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Easter Cape.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
