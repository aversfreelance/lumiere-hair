import { ThemedSiteLayout } from "@/components/theme/ThemedSiteLayout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <ThemedSiteLayout>{children}</ThemedSiteLayout>;
}
