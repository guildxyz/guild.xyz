import type { Metadata } from "next";
import "@/styles/globals.css";
import { PrefetchUserBoundary } from "@/components/PrefetchUserBoundary";
import { PreloadResources } from "@/components/PreloadResources";
import { Providers } from "@/components/Providers";
import { SignInDialog } from "@/components/SignInDialog";
import { Toaster } from "@/components/ui/Toaster";
import { dystopian } from "@/lib/fonts";
import { cn } from "lib/cssUtils";

export const metadata: Metadata = {
  title: "Guildhall",
  applicationName: "Guildhall",
  description:
    "Automated membership management for the platforms your community already uses.",
  // icons: {
  //   icon: "/guild-icon.png",
  // },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(dystopian.variable)}>
        <PreloadResources />
        <Providers>
          <PrefetchUserBoundary>{children}</PrefetchUserBoundary>

          <SignInDialog />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
